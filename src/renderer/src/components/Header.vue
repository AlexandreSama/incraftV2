<template>
  <header>
    <div class="header-text">
      <p>Incraft Launcher</p>
    </div>
    <div class="header-controls">
      <ul class="controls">
        <li class="control" @click="minimizeWindow">
          <svg class="svg" width="10" height="10" viewBox="0 0 12 12">
            <rect stroke="#ffffff" fill="#ffffff" width="10" height="1" x="1" y="6"></rect>
          </svg>
        </li>
        <li class="control" @click="maximizeWindow">
          <svg class="svg" width="10" height="10" viewBox="0 0 12 12">
            <rect
              width="9"
              height="9"
              x="1.5"
              y="1.5"
              fill="none"
              stroke="#ffffff"
              stroke-width="1.4px"
            ></rect>
          </svg>
        </li>
        <li class="control close-control" @click="closeWindow">
          <svg class="svg" width="10" height="10" viewBox="0 0 12 12">
            <polygon
              stroke="#ffffff"
              fill="#ffffff"
              fill-rule="evenodd"
              points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
            ></polygon>
          </svg>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
function minimizeWindow() {
  window.electronAPI?.minimizeWindow()
}

function maximizeWindow() {
  window.electronAPI?.maximizeWindow()
}

function closeWindow() {
  window.electronAPI?.closeWindow()
}
</script>

<style scoped>
/*******************************************************************************
 *                                                                             *
 * Header Styles (Header.vue)                                                  *
 *                                                                             *
 ******************************************************************************/

header {
  height: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-app-region: drag;
  position: relative;
  z-index: 1000;
}

.header-text {
  display: flex;
  align-items: center;
  font-size: larger;
  margin-left: 15px;
  font-family: 'Avenir Medium', sans-serif;
}

.header-controls {
  display: flex;
  width: 15%;
  -webkit-app-region: no-drag;
}

.controls {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.control {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.control:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1);
}

.svg {
  height: 20px;
  width: 15px;
  transition: transform 0.2s ease;
}

.control:hover .svg {
  transform: scale(1.2);
}

.control.close-control:hover .svg polygon {
  stroke: red;
  fill: red;
}
</style>
