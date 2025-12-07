<script setup lang="ts">
import type { SongStats } from '../types'
import html2canvas from 'html2canvas'
import { ref } from 'vue'

interface Props {
  title: string
  data: SongStats[]
  valueKey: keyof SongStats
}

const props = defineProps<Props>()
const tableRef = ref<HTMLElement | null>(null)
const isGenerating = ref(false)

const formatValue = (item: SongStats, key: keyof SongStats): string => {
  const value = item[key]
  if (typeof value === 'number') {
    return value.toFixed(2)
  }
  return String(value)
}

const saveAsImage = async () => {
  if (!tableRef.value || isGenerating.value) return
  
  isGenerating.value = true
  try {
    const canvas = await html2canvas(tableRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      ignoreElements: (el: Element) => el.classList.contains('no-capture')
    })
    
    const link = document.createElement('a')
    link.download = `taiko-best-${props.title}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    console.error('Failed to generate image:', e)
    alert('图片生成失败')
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="table-section" ref="tableRef">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <button class="save-btn no-capture" @click="saveAsImage" :disabled="isGenerating">
        {{ isGenerating ? '保存中...' : '保存图片' }}
      </button>
    </div>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>曲名</th>
          <th>{{ title.split(' ')[0] }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ formatValue(item, valueKey) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-section {
  margin-top: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.save-btn {
  padding: 6px 12px;
  background-color: #e91e63;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #c2185b;
}

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

h2 {
  color: #333;
  margin: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #e91e63;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
