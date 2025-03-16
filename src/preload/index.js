const { contextBridge, ipcRenderer } = require('electron')

console.log('preload.js chargé')

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => {
    console.log('minimizeWindow appelé')
    ipcRenderer.send('minimize-window')
  },
  maximizeWindow: () => {
    console.log('maximizeWindow appelé')
    ipcRenderer.send('maximize-window')
  },
  closeWindow: () => {
    console.log('closeWindow appelé')
    ipcRenderer.send('close-window')
  },
  login: (credentials) => {
    console.log('login appelé avec', credentials)
    ipcRenderer.send('minecraft-login', credentials)
  },
  onLoginResponse: (callback) => {
    ipcRenderer.on('minecraft-login-response', (event, response) => {
      callback(response)
    })
  },
  startDownload: (server) => ipcRenderer.invoke('start-download', server),
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => {
      callback(data)
    })
  },
  onDownloadStatus: (callback) => {
    ipcRenderer.on('download-status', (event, data) => {
      callback(data)
    })
  },
  onDataDownload: (callback) => {
    ipcRenderer.on('dataDownload', (event, data) => {
      callback(data)
    })
  },
  // Fonction pour récupérer la RAM pour un serveur donné (clé "ram_<serverId>")
  getRam: (serverId) => ipcRenderer.invoke('get-ram', serverId),
  setRam: (serverId, value) => ipcRenderer.invoke('set-ram', serverId, value)
})
