import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Welcome from '../components/Welcome.vue'
import MinecraftLogin from '../components/minecraft/MinecraftLogin.vue'
import VmLogin from '../components/gestion/VmLogin.vue'
import MinecraftHome from '../components/minecraft/MinecraftHome.vue'

// ✅ Détection du mode (dev ou prod)
const isDev = import.meta.env.MODE === 'development'

// ✅ Définition du mode de navigation
const router = createRouter({
  history: isDev ? createWebHistory() : createWebHashHistory(), // WebHistory en dev, HashHistory en prod
  routes: [
    { path: '/', name: 'welcome', component: Welcome, meta: { transitionName: 'overlay' } },
    {
      path: '/minecraft-login',
      name: 'minecraft-login',
      component: MinecraftLogin,
      meta: { transitionName: 'overlay' }
    },
    {
      path: '/minecraft-home',
      name: 'minecraft-home',
      component: MinecraftHome,
      meta: { transitionName: 'overlay' }
    },
    { path: '/vm-login', name: 'vm-login', component: VmLogin, meta: { transitionName: 'overlay' } }
  ]
})

export default router
