import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import axios from 'axios'
import { downloadFiles } from './downloader'

const isDev = is.dev
let mainWindow

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
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
      .catch((err) => console.error("Erreur lors du chargement de l'URL :", err))
  } else {
    // En production, on charge le fichier index.html du renderer
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
      .catch((err) => console.error('Erreur lors du chargement du fichier index.html :', err))
  }

  // Écoute des erreurs de chargement
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Erreur de chargement : ${errorCode} - ${errorDescription}`)
  })
  mainWindow.webContents.on('did-finish-load', () => {
    console.info('✅ Interface chargée avec succès 🎉')
  })
}

app.whenReady().then(() => {
  // Configure l'ID de l'application (Windows)
  electronApp.setAppUserModelId('com.electron')
  // Active la surveillance des raccourcis clavier dans chaque fenêtre
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
    const response = await axios.post('http://localhost:3000/auth/minecraft-login', credentials, {
      headers: { 'Content-Type': 'application/json' }
    })
    event.reply('minecraft-login-response', response.data)
  } catch (error) {
    console.error('❌ Erreur lors de l’appel à l’API Express:', error.message)
    let details = error.message
    if (error.response && error.response.data) details = error.response.data
    event.reply('minecraft-login-response', {
      status: 'error',
      message: 'Échec de l’authentification Minecraft via API.',
      details
    })
  }
})

// --- IPC : Téléchargement ---
ipcMain.handle('start-download', async (event, server) => {
  try {
    await downloadFiles(server, mainWindow)
    return { success: true }
  } catch (error) {
    console.error('Erreur dans le téléchargement :', error)
    return { success: false, error: error.message }
  }
})

// Optionnel : Ajoutez ici d'autres IPC spécifiques si besoin...
