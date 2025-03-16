<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

// ⚡ Initialisation du routeur et du store Pinia
const router = useRouter()
const store = useAuthStore()

// 🔹 Références réactives pour l'email, le password et l'erreur
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// 🔹 Mode test : permet de tester sans API
const testMode = true

function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  if (testMode) {
    // 🔹 Mode test : identifiants fictifs
    if (email.value === 'test' && password.value === 'test') {
      store.setCredentials(email.value, password.value)
      store.setProfile({ username: 'Steve' })

      console.log('🔹 Mode test : Connexion réussie !')
      router.push('/minecraft-home')
    } else {
      errorMessage.value = 'Identifiants incorrects (Test : test / test)'
    }
  } else {
    // 🔹 Mode production : envoi à l'API Electron
    window.electronAPI.login({ email: email.value, password: password.value })
  }
}

function returnToAccueil() {
  router.push('/')
}
</script>

<template>
  <main class="main-login">
    <video class="videoPlayer" muted loop autoplay>
      <source src="../../assets/media/bg-loginMC.mp4" type="video/mp4" />
    </video>
    <audio id="audioPlayer" ref="audioPlayer" loop>
      <source src="../../assets/media/bg-loginMC.mp3" type="audio/mp3" />
    </audio>
    <div class="form-container">
      <h2 class="pixel-title">Se connecter avec Microsoft</h2>
      <!-- Ajout d'un @submit.prevent sur le form pour appeler handleLogin -->
      <form @submit.prevent="handleLogin">
        <!-- Champ utilisateur -->
        <div class="form-group">
          <label for="emailMinecraft">Adresse-mail Microsoft</label>
          <input
            id="emailMinecraft"
            v-model="email"
            type="text"
            name="username"
            placeholder="Adresse Mail"
            required
          />
        </div>
        <!-- Champ mot de passe -->
        <div class="form-group">
          <label for="passwordMinecraft">Mot de passe</label>
          <input
            id="passwordMinecraft"
            v-model="password"
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
          />
        </div>
        <!-- Boutons -->
        <button id="submitMinecraftLogin" type="submit" class="btn btn-connect">
          <i class="fa-solid fa-right-to-bracket"></i> Se connecter
        </button>
        <button
          id="returnToAccueilButton"
          type="button"
          class="btn btn-home"
          @click="returnToAccueil"
        >
          <i class="fa-solid fa-house"></i> Revenir à l'accueil
        </button>
        <!-- Lien mot de passe oublié -->
        <a
          href="https://account.live.com/ResetPassword.aspx"
          class="lost-password-link"
          target="_blank"
          >J'ai perdu mon mot de passe</a
        >
      </form>
      <div id="minecraftAlertBox" class="minecraft-alert-box">
        <p id="minecraftAlertMessage">Erreur : Nom d'utilisateur ou mot de passe incorrect</p>
        <button id="minecraftAlertCloseBtn" class="minecraft-alert-close-btn">&times;</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
/*******************************************************************************
 *                                                                             *
 * MinecraftLogin Styles (MinecraftLogin.vue)                                  *
 *                                                                             *
 ******************************************************************************/

.main-login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
  position: absolute;
  top: 0;
}

.videoPlayer {
  width: 100%;
  object-fit: cover;
  height: 100%;
}

.form-container {
  font-family: 'Avenir Medium', sans-serif;
  box-sizing: border-box;
}

.form-container label,
.form-container input[type='text'],
.form-container input[type='password'],
.form-container button,
.form-container .lost-password-link,
.form-container h2,
.form-container .pixel-title {
  font-family: 'Avenir Book', sans-serif;
  box-sizing: border-box;
}

.form-container {
  position: absolute;
  z-index: 1;
  background: rgba(0, 0, 0, 0.7);
  border: 4px solid #3c3c3c;
  border-radius: 8px;
  width: 30%;
  max-width: 90%;
  padding: 20px;
  text-align: center;
  color: #fff;
  margin-left: 5%;
  top: 20%;
  height: 55%;
  font-family: 'Avenir Book', sans-serif;
}

/* Titre "Se connecter avec Microsoft" */
.pixel-title {
  font-size: 16px;
  text-transform: uppercase;
  color: #ffcc00; /* Couleur dorée rappelant Minecraft */
  margin-bottom: 20px;
  font-family: 'Avenir Medium', sans-serif;
}

/* Groupes de champs */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: inline-block;
  margin-bottom: 5px;
  font-family:
    Avenir Book,
    sans-serif;
  font-size: 16px;
}

/* Champs de texte et mot de passe */
input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  border: 2px solid #666;
  border-radius: 4px;
  background-color: #222;
  color: #eee;
  font-size: 16px;
}

/* Boutons d'action */
.btn {
  display: inline-block;
  border: 2px solid #666;
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  text-decoration: none;
  margin: 5px 0;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  background-color: #333;
  color: #fff;
  font-size: 18px;
}

.btn:hover {
  background-color: #555;
}

/* Bouton "Se connecter" */
.btn-connect {
  margin-right: 5px;
  border-color: #ff7a00;
  background-color: #ff7a00;
}

.btn-connect:hover {
  background-color: #cc5e00;
}

.btn-home {
  border-color: #ccc;
  background-color: #fff;
  color: #333;
}

.btn-home:hover {
  background-color: #cccccc;
}

/* Lien "J'ai perdu mon mot de passe" */
.lost-password-link {
  display: block;
  margin-top: 25px;
  color: #fff;
  font-size: 18px;
  text-align: center;
  text-decoration: none;
}

.lost-password-link:hover {
  color: #ffcc00;
}

/* Alert Box */
.minecraft-alert-box {
  display: none;
  position: fixed;
  transform: translateX(-57%);
  background: rgba(0, 0, 0, 0.8);
  color: #ffcc00;
  border: 2px solid #ff7a00;
  border-radius: 8px;
  padding: 15px 20px;
  z-index: 9999;
  text-align: center;
  font-family: 'Press Start 2P', monospace;
  width: 320px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  bottom: 50px;
  margin-left: 15%;
  height: 10%;
}

/* Bouton pour fermer l'alert box */
.minecraft-alert-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 10px;
}

.minecraft-alert-close-btn:hover {
  color: #ff7a00;
}
</style>
