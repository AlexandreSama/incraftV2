<template>
  <main class="login-vm-main">
    <video class="login-bg-video" autoplay loop muted>
      <source src="../../assets/media/bg-login-vm.mp4" type="video/mp4" />
    </video>
    <div class="login-vm-container">
      <form class="login-vm-form" @submit.prevent="handleLogin">
        <h1 class="login-vm-title">Se connecter</h1>
        <div v-if="error" class="login-vm-error">{{ error }}</div>
        <div class="login-vm-group">
          <label for="email" class="login-vm-label">Email</label>
          <input class="login-vm-input" id="email" type="text" placeholder="Email" v-model="username" />
        </div>
        <div class="login-vm-group">
          <label for="password" class="login-vm-label">Mot de passe</label>
          <input class="login-vm-input" id="password" type="password" placeholder="Mot de passe" v-model="password" />
        </div>
        <button type="submit" class="login-vm-login-button">Connexion</button>
        <button type="submit" class="login-vm-returnToAccueil-button" @click="returnToAccueil">Retour a l'accueil</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()

function handleLogin() {
  if (username.value === '' || password.value === '') {
    error.value = "Veuillez remplir tous les champs."
    return
  }
  if (username.value !== 'admin' || password.value !== '1234') {
    error.value = "Nom d'utilisateur ou mot de passe invalide."
    return
  }
  error.value = ''
  router.push('/vm-dashboard')
}

function returnToAccueil() {
  router.push('/')
}
</script>

<style scoped>
/*******************************************************************************
 *                                                                             *
 * VmLogin Styles (VmLogin.vue)                                                *
 *                                                                             *
 ******************************************************************************/

@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&display=swap');

.login-vm-main {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Vidéo de fond pixelisée */
.login-bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  image-rendering: pixelated;
}

/* Conteneur du formulaire avec fond transparent et bordure statique */
.login-vm-container {
  position: relative;
  z-index: 1;
  width: 320px;
  padding: 20px;
  background: rgb(12 11 11 / 50%);
  text-align: center;
  font-family: 'Pixelify Sans', monospace;
  border: 4px solid #fff;
  box-shadow: 4px 4px 0 #000;
  height: 50%;
}

/* Formulaire de connexion */
.login-vm-form {
  width: 100%;
  height: 100%;
}

/* Titre */
.login-vm-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 2px 2px 0 #000;
}

/* Message d'erreur */
.login-vm-error {
  font-size: 0.8rem;
  color: #ff4d4d;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 0 #000;
  height: 1%;
}

/* Groupe de champs */
.login-vm-group {
  text-align: left;
  height: 25%;
}

/* Labels */
.login-vm-label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.75rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 0 #000;
}

/* Inputs avec animation de "bounce" */
.login-vm-input {
  width: 100%;
  padding: 10px;
  font-size: 0.8rem;
  color: #fff;
  background: #333;
  border: 2px solid #fff;
  box-sizing: border-box;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Pixelify Sans', monospace;
  animation: inputBounce 9s ease-in-out infinite;
}

.login-vm-input:focus {
  border-color: #149cea;
}

/* Keyframes pour l'animation des inputs */
@keyframes inputBounce {
  0%, 50% {
    transform: translateY(0);
  }
  55% {
    transform: translateY(-10px);
  }
  60%, 100% {
    transform: translateY(0);
  }
}


/* Bouton de connexion */
.login-vm-login-button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  text-transform: uppercase;
  background: #00aaff;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
  transition: background 0.2s ease;
  letter-spacing: 1px;
  font-family: 'Pixelify Sans', monospace;
  margin-bottom: 15px;
}

.login-vm-returnToAccueil-button{
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  text-transform: uppercase;
  background: #3ca865;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
  transition: background 0.2s ease;
  letter-spacing: 1px;
  font-family: 'Pixelify Sans', monospace;
  margin-bottom: 15px;
}

.login-vm-login-button:hover {
  background: #0088cc;
}

.login-vm-returnToAccueil-button:hover{
  background: #1f5d37;
}
</style>
