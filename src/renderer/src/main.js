import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import router from './router' // <- on importe le router

createApp(App)
  .use(createPinia()) // Activation de Pinia
  .use(router) // <- on enregistre le router dans l’application
  .mount('#app')
