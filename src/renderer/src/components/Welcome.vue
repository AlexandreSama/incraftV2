<template>
  <main class="welcome-main">
    <div class="split-container">
      <!-- Panneau gauche pour Minecraft -->
      <div
        class="panel left-panel"
        :class="{ hovered: hoverLeft }"
        @mouseenter="hoverLeft = true"
        @mouseleave="hoverLeft = false"
        @click="goToMinecraft"
      >
        <video class="panel-video" autoplay loop muted>
          <source
            src="https://incraft-api.kashir.fr/launcher-assets/bg-welcome-mc.mp4"
            type="video/mp4"
          />
        </video>
        <div class="panel-content-left">
          <h3>Incraft MC</h3>
          <p>Connexion pour les serveurs d'Incraft</p>
        </div>
      </div>
      <!-- Panneau droit pour le Gestionnaire de VM -->
      <div
        class="panel right-panel"
        :class="{ hovered: hoverRight }"
        @mouseenter="hoverRight = true"
        @mouseleave="hoverRight = false"
        @click="goToVM"
      >
        <video class="panel-video" autoplay loop muted>
          <source
            src="https://incraft-api.kashir.fr/launcher-assets/bg-welcome-vm.mp4"
            type="video/mp4"
          />
        </video>
        <div class="panel-content-right">
          <h3>Incraft VM</h3>
          <p>Connexion pour le gestionnaire d'Incraft</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hoverLeft = ref(false)
const hoverRight = ref(false)

function goToMinecraft() {
  router.push('/minecraft-login')
}

function goToVM() {
  router.push('/vm-login')
}
</script>

<style scoped>
/*******************************************************************************
 *                                                                             *
 * Welcome Styles (Welcome.vue)                                                *
 *                                                                             *
 ******************************************************************************/

@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&display=swap');

/* Conteneur principal */
.welcome-main {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Conteneur en flex (les panneaux se superposent en position absolue) */
.split-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Chaque panneau occupe 55vw par défaut */
.panel {
  position: absolute;
  top: 0;
  width: 55vw;
  height: 100vh;
  overflow: hidden;
  transition:
    width 0.5s ease,
    clip-path 0.5s ease;
}

/* Panneau gauche par défaut : la découpe diagonale va de (55vw,0) à (45vw,100vh) */
.left-panel {
  left: 0;
  clip-path: polygon(0 0, 55vw 0, 45vw 100vh, 0 100vh);
  z-index: 1;
}

/* Panneau droit par défaut : la découpe diagonale va de (10vw,0) à (0,100vh) */
.right-panel {
  right: 0;
  clip-path: polygon(10vw 0, 100vw 0, 100vw 100vh, 0 100vh);
  z-index: 1;
}

/* Au survol, le panneau agrandit sa width et la découpe se décale pour recouvrir l'autre moitié */
/* Pour la gauche, la width passe à 75vw et le bord droit passe de 55vw à 75vw en haut et de 45vw à 65vw en bas */
.left-panel.hovered {
  width: 90vw;
  clip-path: polygon(0 0, 75vw 0, 65vw 100vh, 0 100vh);
  z-index: 2;
}

/* Pour la droite, la width passe à 75vw (ancrée à droite) et le bord gauche passe de 10vw à 25vw */
.right-panel.hovered {
  width: 80vw;
  clip-path: polygon(10vw 0, 100vw 0, 100vw 100vh, 0 100vh);
  z-index: 2;
}

/* La vidéo occupe toute la surface du panneau */
.panel-video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Centrage du contenu textuel */
.panel-content-right {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  pointer-events: none;
  font-family: 'Pixelify Sans', monospace;
  font-size: 1.5rem;
}

.panel-content-left {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  pointer-events: none;
  font-size: 1.5rem;
}

.panel-content h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.panel-content p {
  font-size: 1.2rem;
}
</style>
