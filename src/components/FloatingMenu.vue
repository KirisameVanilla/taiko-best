<script setup lang="ts">
import { eventBus } from '@utils/eventBus'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isOpen = ref(false)
const onlyCnSongs = ref(false)

const isReportPage = computed(() => route.name === 'report')

onMounted(() => {
  const savedSetting = localStorage.getItem('onlyCnSongs')
  if (savedSetting !== null) {
    onlyCnSongs.value = savedSetting === 'true'
  }
})

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function handleScreenshot() {
  eventBus.emit('trigger-screenshot')
  closeMenu()
}

function toggleCnSongs() {
  onlyCnSongs.value = !onlyCnSongs.value
  localStorage.setItem('onlyCnSongs', String(onlyCnSongs.value))
  // 触发全局事件通知其他组件更新
  eventBus.emit('cn-filter-changed', onlyCnSongs.value)
}
</script>

<template>
  <div class="no-capture">
    <!-- Main Button -->
    <button 
      class="right-[30px] bottom-[30px] z-[1000] fixed flex justify-center items-center bg-primary hover:bg-[#d81b60] shadow-[0_4px_12px_rgba(0,0,0,0.2)] border-none rounded-full w-14 h-14 text-white text-2xl hover:scale-110 transition-all duration-300 cursor-pointer" 
      @click="toggleMenu"
      title="菜单"
    >
      <i class="z-[1] relative fas fa-bars"></i>
    </button>

    <!-- Popup Modal -->
    <Transition name="menu">
      <div v-if="isOpen" class="z-[2000] fixed inset-0 flex justify-center items-center bg-black/50" @click="closeMenu">
        <div class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-5 rounded-xl w-[90%] max-w-[300px]" @click.stop>
          <div class="flex justify-between items-center mb-5 pb-2.5 border-[#eee] border-b">
            <h3 class="m-0 text-[#333] text-lg">菜单</h3>
            <button class="bg-none px-1.5 py-0 border-none text-[#999] hover:text-[#333] text-xl cursor-pointer" @click="closeMenu">✕</button>
          </div>
          
          <div class="flex flex-col gap-2.5">
            <!-- 只查看国服设置 -->
            <button
              @click="toggleCnSongs"
              class="box-border flex items-center gap-[15px] bg-[#f8f9fa] hover:bg-white hover:shadow-[0_2px_8px_rgba(233,30,99,0.1)] px-[15px] py-3 border border-transparent hover:border-primary rounded-lg w-full text-[#333] hover:text-primary text-base no-underline transition-all hover:-translate-y-0.5 duration-200 cursor-pointer"
              :class="{ 'bg-primary/10 border-primary': onlyCnSongs }"
            >
                <i v-if="onlyCnSongs" class="fa-regular fa-circle-check"></i>
                <i v-else class="fa-regular fa-circle"></i>
              <span>只查看国服</span>
            </button>

            <a 
              href="https://qm.qq.com/q/EhuH4pBPmU" 
              target="_blank" 
              class="box-border flex items-center gap-[15px] bg-[#f8f9fa] hover:bg-white hover:shadow-[0_2px_8px_rgba(233,30,99,0.1)] px-[15px] py-3 border border-transparent hover:border-primary rounded-lg w-full text-[#333] hover:text-primary text-base no-underline transition-all hover:-translate-y-0.5 duration-200 cursor-pointer"
              title="点击链接加入群聊【太鼓之达人Rating交流群】"
            >
              <i class="fa-user-group fa-solid"></i>
              <span>加入QQ群</span>
            </a>
            
            <button 
              v-if="isReportPage" 
              @click="handleScreenshot" 
              class="box-border flex items-center gap-[15px] bg-[#f8f9fa] hover:bg-white hover:shadow-[0_2px_8px_rgba(233,30,99,0.1)] px-[15px] py-3 border border-transparent hover:border-primary rounded-lg w-full text-[#333] hover:text-primary text-base no-underline transition-all hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              <i class="fa-solid fa-camera"></i>
              <span>保存截图</span>
            </button>

            <a 
              href="https://github.com/kirisamevanilla/taiko-best" 
              target="_blank" 
              class="box-border flex items-center gap-[15px] bg-[#f8f9fa] hover:bg-white hover:shadow-[0_2px_8px_rgba(233,30,99,0.1)] px-[15px] py-3 border border-transparent hover:border-primary rounded-lg w-full text-[#333] hover:text-primary text-base no-underline transition-all hover:-translate-y-0.5 duration-200 cursor-pointer"
              title="GitHub 仓库"
            >
              <i class="fa-brands fa-github"></i>
              <span>GitHub 仓库</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Overlay fade + scale transition */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease-out;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

/* Content scale transition */
.menu-enter-active > div,
.menu-leave-active > div {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.menu-enter-from > div,
.menu-leave-to > div {
  opacity: 0;
  transform: scale(0.9);
}
</style>
