import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import axios from 'axios'
import { downloadFiles } from './downloader.js'
import fs from 'fs'

const { Client } = require('minecraft-launcher-core')
const launcher = new Client()

const isDev = is.dev
let mainWindow
let accessToken
let username
let uuid

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: '#171614',
    webPreferences: {
      // On charge le preload depuis ../preload/index.js
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  // Affiche la fenêtre dès qu'elle est prête
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (isDev) mainWindow.webContents.openDevTools()
  })

  // Gère l'ouverture de liens externes dans le navigateur par défaut
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Charge le renderer en fonction du mode (dev ou prod)
  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow
      .loadURL(process.env['ELECTRON_RENDERER_URL'])
      .catch((err) => console.error("Erreur lors du chargement de l'URL :", err))
  } else {
    mainWindow
      .loadFile(join(__dirname, '../renderer/index.html'))
      .catch((err) => console.error('Erreur lors du chargement du fichier index.html :', err))
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Erreur de chargement : ${errorCode} - ${errorDescription}`)
  })
  mainWindow.webContents.on('did-finish-load', () => {
    console.info('✅ Interface chargée avec succès 🎉')
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// --- IPC : Contrôle de la fenêtre ---
ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.minimize()
})
ipcMain.on('maximize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  }
})
ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.close()
})

// --- IPC : Authentification Minecraft ---
ipcMain.on('minecraft-login', async (event, credentials) => {
  console.info('🔄 Envoi des identifiants Minecraft à l’API Express:', credentials)
  try {
    const response = await axios.post(
      'https://incraft-api.kashir.fr/auth/minecraft-login',
      credentials,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    // const response = await axios.post('http://localhost:3000/auth/minecraft-login', credentials, {
    //   headers: { 'Content-Type': 'application/json' }
    // })
    console.log(response.data)
    accessToken = response.data.access_token
    username = response.data.profile.name
    uuid = response.data.profile.uuid
    event.reply('minecraft-login-response', response.data)
  } catch (error) {
    console.error('❌ Erreur lors de l’appel à l’API Express:', error.message)
    let details = error.message
    if (error.response && error.response.data) details = error.response.data
    event.reply('minecraft-login-response', {
      status: 'error',
      message:
        "Échec de l’authentification Minecraft via API. Vérifier votre mot de passe, votre email et que l'authentification a double facteur soit désactivé",
      details
    })
  }
})

// --- IPC : Configuration RAM par serveur ---
ipcMain.handle('get-ram', async (event, serverId) => {
  const { default: Store } = await import('electron-store')
  const store = new Store()
  // Retourne 8 si aucune valeur n'est trouvée
  return store.get(`ram_${serverId}`, 8)
})

ipcMain.handle('set-ram', async (event, serverId, value) => {
  const { default: Store } = await import('electron-store')
  const store = new Store()
  store.set(`ram_${serverId}`, value)
  return true
})

ipcMain.handle('open-server-folder', async (event, serverName) => {
  let serverPath = join(app.getPath('appData'), 'Incraft-Launcher', serverName)
  if (fs.existsSync(serverPath)) {
    shell.openExternal(serverPath)
  } else {
    event.sender.send('cant-open-server-folder')
  }
})

ipcMain.handle('open-logs-folder', async (event, serverName) => {
  let logsPath = join(app.getPath('appData'), 'Incraft-Launcher', serverName, 'logs')
  if (fs.existsSync(logsPath)) {
    shell.openExternal(join(app.getPath('appData'), 'Incraft-Launcher', serverName, 'logs'))
  } else {
    event.sender.send('cant-open-logs-folder')
  }
})

// --- IPC : Lancement du jeu ---
ipcMain.handle('start-download', async (event, server) => {
  await launchGame(event, server, server.id, server.name, server.serverJar)
})

async function launchGame(event, server, serverId, serverName, serverJar) {
  try {
    // D'abord, télécharge les fichiers nécessaires pour le serveur
    await downloadFiles(server, mainWindow)

    console.log('lancement de MC')
    // Définir ici les chemins (adapter selon ta configuration)
    const appDataPath = app.getPath('appData')
    const baseFolder = join(appDataPath, 'Incraft-Launcher')
    // Pour ce serveur, les fichiers se trouvent dans un sous-dossier portant son nom
    const rootFolder = join(baseFolder, serverName)
    // On suppose que le dossier Java est commun à tous les serveurs
    const javaFolder = join(rootFolder, 'java')
    console.log(javaFolder)
    // Dossier contenant le modLoader, sur tout les serveurs
    const modLoaderFolder = rootFolder

    const { default: Store } = await import('electron-store')
    const store = new Store()
    const ramUsage = store.get(`ram_${serverId}`, '8') // Valeur par défaut : '8'
    console.log(ramUsage)

    const opts = {
      clientPackage: null,
      authorization: {
        access_token: accessToken, // Récupéré lors de l'auth via IPC
        client_token: '', // Tu peux générer un token ici si nécessaire
        uuid: uuid, // Remplir si tu disposes de l'UUID
        name: username, // Remplir si tu disposes du nom du joueur
        meta: {
          type: 'msa' // Microsoft Account
        }
      },
      root: rootFolder,
      forge: join(modLoaderFolder, serverJar),
      javaPath: join(javaFolder, 'bin', 'java.exe'),
      version: {
        number: '1.21.1',
        type: 'release',
        custom: 'neoforge-1.21.1'
      },
      memory: {
        max: `${ramUsage}G`,
        min: '8G'
      }
    }

    // Lance Minecraft via minecraft-launcher-core
    launcher.launch(opts)
    launcher.on('close', (code) => {
      const errorMessage =
        code === 1 ? 'Fermé par l’utilisateur' : 'Le processus Minecraft a planté'
      mainWindow.show()
      event.sender.send(
        'stoppingGame',
        `Le processus Minecraft s'est arrêté avec le code: ${code}. ${errorMessage}`
      )
    })

    launcher.on('debug', (message) => {
      console.log(`["Minecraft-Debug"] ${message}`)
    })

    let progressCounters = {}

    launcher.on('progress', (progress) => {
      // Si le compteur pour ce type n'existe pas, on l'initialise à 0
      if (!progressCounters.hasOwnProperty(progress.type)) {
        progressCounters[progress.type] = 0
      }
      // Incrémente le compteur pour ce type
      progressCounters[progress.type]++

      event.sender.send('dataDownload', {
        type: progress.type,
        task: progress.task,
        total: progress.total,
        current: progressCounters[progress.type]
      })
    })

    launcher.once('data', () => {
      mainWindow.hide()
      event.sender.send('LaunchingGame')
    })
  } catch (error) {
    console.error('Error launching game', error)
    event.sender.send('gameError', `Erreur de lancement du jeu: ${error.message}`)
  }
}
