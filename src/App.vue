<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue'
import Modal from './components/Modal.vue'
import { useModal } from './composables/useModal'

const { modalState, hideModal } = useModal()
</script>

<template>
  <div id="app">
    <NavigationBar />
    <router-view />
    <Modal 
      :show="modalState.show" 
      :title="modalState.title" 
      :message="modalState.message"
      @close="hideModal"
    />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
