import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { app } from 'electron'
import Downloader from 'nodejs-file-downloader'

let currentNumberMod = 0
let modsToDownload = 0

/**
 * Vérifie et crée les dossiers nécessaires
 */
export function ensureServerFolders(server) {
  console.log(server)
  const appDataPath = app.getPath('appData')
  const incraftPath = path.join(appDataPath, 'Incraft-Launcher')
  if (!fs.existsSync(incraftPath)) {
    fs.mkdirSync(incraftPath)
  }
  const serverFolder = path.join(incraftPath, server.name)
  if (!fs.existsSync(serverFolder)) {
    fs.mkdirSync(serverFolder)
  }
  const modsFolder = path.join(serverFolder, 'mods')
  if (!fs.existsSync(modsFolder)) {
    fs.mkdirSync(modsFolder)
  }
  const javaFolder = path.join(serverFolder, 'java')
  if (!fs.existsSync(javaFolder)) {
    fs.mkdirSync(javaFolder)
  }
  return { serverFolder, modsFolder, javaFolder }
}

/**
 * Téléchargement simple d'un fichier avec nodejs-file-downloader
 */
async function simpleDownload(url, outputPath, mainWindow) {
  const fileName = path.basename(new URL(url).pathname)
  const directory = path.dirname(outputPath)

  const downloader = new Downloader({
    url,
    directory,
    fileName,
    onProgress: (percentage) => {
      // La valeur retournée est un pourcentage ; on l'arrondit et l'envoie à la fenêtre principale.
      mainWindow.webContents.send('download-progress', {
        file: fileName,
        percentage: Math.floor(percentage)
      })
    }
  })

  // eslint-disable-next-line no-useless-catch
  try {
    // Le téléchargement renvoie un objet contenant filePath.
    await downloader.download()
  } catch (error) {
    throw error
  }
}

/**
 * Dézippe un fichier zip et supprime l'archive
 */
function unzipAndDelete(zipPath, targetDirectory) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: targetDirectory }))
      .on('close', () => {
        fs.unlink(zipPath, (err) => {
          if (err) {
            console.error('Erreur suppression zip :', err)
            reject(err)
          } else {
            resolve()
          }
        })
      })
      .on('error', (err) => {
        console.error('Erreur dézippage :', err)
        reject(err)
      })
  })
}

/**
 * Fonction principale de téléchargement
 */
export async function downloadFiles(server, mainWindow) {
  const folders = ensureServerFolders(server)
  const filesToDownload = []

  if (server.serverJarUrl) {
    filesToDownload.push({
      url: server.serverJarUrl,
      label: 'serverJarUrl',
      directory: folders.serverFolder
    })
  }
  if (server.javaZipUrl) {
    filesToDownload.push({
      url: server.javaZipUrl,
      label: 'javaZipUrl',
      directory: folders.serverFolder
    })
  }
  if (server.mods && server.mods.length > 0) {
    modsToDownload = server.mods.length
    currentNumberMod = 0
    server.mods.forEach((modUrl) =>
      filesToDownload.push({ url: modUrl, label: 'mod', directory: folders.modsFolder })
    )
  } else {
    modsToDownload = 0
    currentNumberMod = 0
  }

  for (const file of filesToDownload) {
    const fileName = path.basename(new URL(file.url).pathname)
    const filePath = path.join(file.directory, fileName)

    if (fs.existsSync(filePath) && file.label !== 'javaZipUrl') {
      console.log(`Le fichier ${fileName} existe déjà, téléchargement ignoré.`)
      mainWindow.webContents.send('download-status', { url: file.url, status: 'skipped' })
      // Si c'est un mod, on incrémente quand même le compteur et on envoie la progression
      if (file.label === 'mod') {
        currentNumberMod++
        mainWindow.webContents.send('mods-progress', {
          current: currentNumberMod,
          total: modsToDownload
        })
      }
      continue
    }

    if (file.label === 'javaZipUrl' && fs.readdirSync(folders.javaFolder).length > 0) {
      console.log(`Java déjà dézippé, téléchargement ignoré.`)
      mainWindow.webContents.send('download-status', { url: file.url, status: 'skipped' })
      continue
    }

    try {
      await simpleDownload(file.url, filePath, mainWindow)
      mainWindow.webContents.send('download-status', { url: file.url, status: 'finished' })

      if (file.label === 'javaZipUrl') {
        await unzipAndDelete(filePath, folders.javaFolder)
        console.log(`Dézippage terminé pour ${fileName}`)
      }
      if (file.label === 'mod') {
        currentNumberMod++
        mainWindow.webContents.send('mods-progress', {
          current: currentNumberMod,
          total: modsToDownload
        })
      }
    } catch (err) {
      console.error(`Erreur téléchargement ${fileName}:`, err)
      mainWindow.webContents.send('download-status', {
        url: file.url,
        status: 'error',
        error: err.message
      })
    }
  }
}
