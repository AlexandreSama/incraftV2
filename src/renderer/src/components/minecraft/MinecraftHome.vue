<template>
  <main class="minecraft-home">
    <!-- Zone de contenu (gauche) -->
    <div class="content">
      <div v-if="selectedServer" class="server-content">
        <video :key="selectedServer.backgroundUrl" class="content-video" muted loop autoplay>
          <source id="videoSource" :src="selectedServer.backgroundUrl" type="video/mp4" />
        </video>
        <h1 class="content-title">{{ selectedServer.name }}</h1>
        <p class="content-description">{{ selectedServer.description }}</p>

        <!-- Groupe de boutons -->
        <div class="button-group">
          <button class="btn-join" @click="joinServer(selectedServer)">Lancer</button>
          <button class="btn-settings" @click="openSettings(selectedServer)">Paramètre</button>
        </div>

        <!-- Barre de téléchargement -->
        <div class="download-container">
          <div class="download-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
            <span class="progress-text">{{ progressMessage }}</span>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <div v-else class="content-loader">Chargement des serveurs...</div>
    </div>

    <!-- Zone des tabs (droite) -->
    <div v-if="servers.length" class="server-tabs">
      <h2 class="tabs-title">Serveurs</h2>
      <ul>
        <li
          v-for="(server, index) in servers"
          :key="index"
          :class="{ active: selectedServer === server }"
          @click="selectServer(server)"
        >
          <img :src="server.iconUrl" alt="Logo" class="server-logo" />
          <span class="server-name">{{ server.name }}</span>
        </li>
      </ul>
    </div>

    <!-- Modal des paramètres -->
    <div v-if="isSettingsModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Paramètres du serveur</h2>
        <!-- Sélecteur de RAM -->
        <div class="modal-section">
          <label for="ram-select">Sélecteur de RAM :</label>
          <select id="ram-select" v-model="ram">
            <option v-for="n in ramOptions" :key="n" :value="n">{{ n }} Go</option>
          </select>
        </div>
        <!-- Boutons pour ouvrir les dossiers -->
        <div class="modal-section">
          <button @click="openLogs">Ouvrir le dossier des logs</button>
          <button @click="openServerFolder">Ouvrir le dossier du serveur</button>
        </div>
        <!-- Bouton pour fermer la modal -->
        <button class="modal-close" @click="closeSettings">Fermer</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const servers = ref([])
const selectedServer = ref(null)
const progress = ref(0)
const downloadComplete = ref(false)
const isSettingsModalOpen = ref(false)
const ram = ref(8)
const ramOptions = Array.from({ length: 9 }, (_, i) => i + 8)

const progressMessage = computed(() =>
  downloadComplete.value ? 'Téléchargement terminé ! Lancement du jeu...' : progress.value + '%'
)

const selectServer = async (server) => {
  selectedServer.value = server
  if (server && server.id) {
    const savedRam = await window.electronAPI.getRam(server.id)
    ram.value = savedRam !== undefined ? savedRam : 8
  }
}

const joinServer = async (server) => {
  if (!server) return
  console.log(`Lancement du téléchargement pour ${server.name}`)
  progress.value = 0
  downloadComplete.value = false

  try {
    // On fait une copie simple de l'objet pour s'assurer qu'il est clonable
    const serverData = JSON.parse(JSON.stringify(server))
    await window.electronAPI.startDownload(serverData)
    // if (result.success) {
    //   downloadComplete.value = true
    // } else {
    //   console.error('Erreur lors du téléchargement : ' + result.error)
    // }
  } catch (error) {
    console.error('Erreur lors du téléchargement', error)
  }
}

const openSettings = (server) => {
  console.log(`Accès aux paramètres du serveur : ${server.name}`)
  isSettingsModalOpen.value = true
}

const closeSettings = async () => {
  isSettingsModalOpen.value = false
  if (selectedServer.value && selectedServer.value.id) {
    await window.electronAPI.setRam(selectedServer.value.id, ram.value)
  }
}

const openLogs = () => {
  console.log('Ouverture du dossier des logs...')
}

const openServerFolder = () => {
  console.log('Ouverture du dossier du serveur...')
}

async function fetchServers() {
  try {
    const response = await fetch('https://incraft-api.kashir.fr/servers')
    if (response.ok) {
      servers.value = await response.json()
      if (servers.value.length > 0) {
        selectedServer.value = servers.value[0]
        if (selectedServer.value.id) {
          const savedRam = await window.electronAPI.getRam(selectedServer.value.id)
          ram.value = savedRam !== undefined ? savedRam : 8
        }
      }
    } else {
      console.error('Erreur lors de la récupération des serveurs.')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des serveurs:', error)
  }
}

onMounted(() => {
  fetchServers()
  // Utilise l'API exposée pour mettre à jour la barre de téléchargement
  window.electronAPI.onDownloadProgress((data) => {
    // On s'attend ici à recevoir un objet contenant une propriété 'percentage'
    progress.value = data.percentage
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&display=swap');

.minecraft-home {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Pixelify Sans', sans-serif;
  background-image: url('../../assets/images/0.jpg');
  background-size: cover;
}

/* Zone de contenu (gauche) */
.content {
  flex: 1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
}

.server-content {
  text-align: left;
  width: 100%;
  position: relative;
}

.content-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  position: absolute;
  top: 10%;
  left: 5%;
  text-shadow: 2px 2px 0 #000;
}

.content-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  position: absolute;
  top: 25%;
  left: 5%;
  text-shadow: 1px 1px 0 #000;
}

/* Groupe de boutons */
.button-group {
  position: absolute;
  top: 90%;
  left: 70%;
  display: flex;
  gap: 10px;
  height: 6%;
  width: 30%;
  justify-content: space-evenly;
}

.btn-join,
.btn-settings {
  padding: 10px 20px;
  font-size: 1rem;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 2px 2px 0 #000;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  background-color: #3ca865;
}

.btn-join:hover,
.btn-settings:hover {
  background-color: #1f5d37;
  transform: scale(1.05);
}

/* Loader de contenu */
.content-loader {
  font-size: 1.5rem;
  color: #fff;
}

/* Zone des tabs (droite) */
.server-tabs {
  width: 250px;
  background: rgba(0, 0, 0, 1);
  border-left: 4px solid #fff;
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tabs-title {
  font-size: 1.5rem;
  margin-top: 55px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0 #000;
}

.server-tabs ul {
  list-style: none;
  padding: 0;
  width: 75%;
}

.server-tabs li {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background: #222;
  border: 2px solid #fff;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 1px 1px 0 #000;
  box-shadow: 2px 2px 0 #000;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.server-tabs li:hover {
  background: #444;
  transform: scale(1.05);
  box-shadow: 3px 3px 0 #000;
}

.server-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-right: 10px;
}

.server-name {
  flex: 1;
}

/* Zone de téléchargement */
.download-container {
  position: absolute;
  top: 90%;
  left: 5%;
  width: 60%;
  text-align: center;
}

.download-bar {
  width: 100%;
  background-color: #444;
  border: 2px solid #fff;
  height: 41px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #3ca865;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 5%;
  left: 0;
  width: 100%;
  height: 95%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #222;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  color: #fff;
  text-align: center;
  height: 55%;
}

.modal-content h2 {
  margin-bottom: 20px;
}

.modal-section {
  margin-bottom: 25px;
  height: 20%;
}

.modal-section label {
  display: block;
  margin-bottom: 5px;
}

.modal-section select,
.modal-section button {
  padding: 8px;
  font-size: 1rem;
  border: 2px solid #fff;
  background-color: #3ca865;
  color: #fff;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 2px 2px 0 #000;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  margin-bottom: 25px;
}

.modal-section button:hover {
  background-color: #1f5d37;
  transform: scale(1.05);
}

.modal-close {
  margin-top: 70px;
  padding: 8px 16px;
  border: 2px solid #fff;
  background-color: #3ca865;
  color: #fff;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 2px 2px 0 #000;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.modal-close:hover {
  background-color: #1f5d37;
  transform: scale(1.05);
}
</style>
