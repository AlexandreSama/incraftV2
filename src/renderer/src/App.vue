<template>
  <Header />
  <div class="page-container">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transitionName || 'default'" mode="in-out">
        <component :is="Component" :key="route.name" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>
<style scoped>
/*******************************************************************************
 *                                                                             *
 * Transitions Styles (App.vue)                                                *
 *                                                                             *
 ******************************************************************************/

.page-container {
  position: absolute;
  min-height: 100vh;
  top: 0;
  width: 100%;
}
/* Transition fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Transition slide */
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Transition overlay : la nouvelle page apparaît par-dessus la précédente */
.overlay-enter-active {
  position: absolute;
  width: 100%;
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  z-index: 2;
}
.overlay-leave-active {
  position: absolute;
  width: 100%;
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  z-index: 1;
}
.overlay-enter-from {
  transform: translateY(0px);
  opacity: 0;
}
.overlay-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.overlay-leave-from {
  transform: translateY(0);
  opacity: 0;
}
.overlay-leave-to {
  transform: translateY(0px);
  opacity: 0;
}
</style>
