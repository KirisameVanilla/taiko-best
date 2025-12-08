import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将Vue相关库分离到单独的chunk
          'vue-vendor': ['vue', 'vue-router'],
          // 将Chart.js相关库分离到单独的chunk
          'chart-vendor': ['chart.js', 'chartjs-plugin-datalabels'],
          // 将html2canvas分离到单独的chunk
          'html2canvas-vendor': ['html2canvas'],
        },
      },
    },
    // 提高chunk大小警告阈值到1000kB（如果仍需要）
    chunkSizeWarningLimit: 1000,
  },
})
