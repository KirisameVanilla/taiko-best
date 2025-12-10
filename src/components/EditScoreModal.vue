<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { UserScore, SongData, SongStats } from '../types'
import { calculateSongStats } from '../utils/calculator'

interface Props {
  show: boolean
  title: string
  initialScore?: UserScore
  songData?: SongData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', score: Partial<UserScore>): void
  (e: 'clear'): void
}>()

const form = ref({
  score: 0,
  great: 0,
  good: 0,
  bad: 0,
  drumroll: 0,
  combo: 0
})

const previewStats = computed<SongStats | null>(() => {
  if (!props.songData) return null
  
  // Construct a temporary UserScore object for calculation
  // We only need fields that affect calculation (great, good, bad)
  // But we should provide a valid object structure
  const tempScore: UserScore = {
    id: 0, // Dummy
    level: 0, // Dummy
    score: form.value.score,
    scoreRank: 0,
    great: form.value.great,
    good: form.value.good,
    bad: form.value.bad,
    drumroll: form.value.drumroll,
    combo: form.value.combo,
    playCount: 0,
    clearCount: 0,
    fullcomboCount: 0,
    perfectCount: 0,
    updatedAt: ''
  }
  
  return calculateSongStats(props.songData, tempScore)
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.initialScore) {
      form.value = {
        score: props.initialScore.score,
        great: props.initialScore.great,
        good: props.initialScore.good,
        bad: props.initialScore.bad,
        drumroll: props.initialScore.drumroll,
        combo: props.initialScore.combo
      }
    } else {
      form.value = {
        score: 0,
        great: 0,
        good: 0,
        bad: 0,
        drumroll: 0,
        combo: 0
      }
    }
  }
})

const handleSave = () => {
  emit('save', { ...form.value })
}

const handleClear = () => {
  if (confirm('确定要清除这条成绩吗？')) {
    emit('clear')
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h3>编辑成绩 - {{ title }}</h3>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>分数</label>
            <input type="number" v-model.number="form.score" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>良</label>
              <input type="number" v-model.number="form.great" />
            </div>
            <div class="form-group">
              <label>可</label>
              <input type="number" v-model.number="form.good" />
            </div>
            <div class="form-group">
              <label>不可</label>
              <input type="number" v-model.number="form.bad" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>连打</label>
              <input type="number" v-model.number="form.drumroll" />
            </div>
            <div class="form-group">
              <label>连击</label>
              <input type="number" v-model.number="form.combo" />
            </div>
          </div>

          <div v-if="previewStats" class="preview-section">
            <h4>预览 Rating: {{ previewStats.rating.toFixed(2) }}</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="label">大歌力</span>
                <span class="value">{{ previewStats.daigouryoku.toFixed(2) }}</span>
              </div>
              <div class="stat-item">
                <span class="label">体力</span>
                <span class="value">{{ previewStats.stamina.toFixed(2) }}</span>
              </div>
              <div class="stat-item">
                <span class="label">高速力</span>
                <span class="value">{{ previewStats.speed.toFixed(2) }}</span>
              </div>
              <div class="stat-item">
                <span class="label">精度力</span>
                <span class="value">{{ previewStats.accuracy_power.toFixed(2) }}</span>
              </div>
              <div class="stat-item">
                <span class="label">节奏处理</span>
                <span class="value">{{ previewStats.rhythm.toFixed(2) }}</span>
              </div>
              <div class="stat-item">
                <span class="label">复合处理</span>
                <span class="value">{{ previewStats.complex.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-danger" @click="handleClear" v-if="initialScore">清除成绩</button>
          <div class="right-actions">
            <button class="btn btn-secondary" @click="$emit('close')">取消</button>
            <button class="btn btn-primary" @click="handleSave">保存</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.preview-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.preview-section h4 {
  margin: 0 0 10px 0;
  color: #374151;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  padding: 8px;
  border-radius: 4px;
}

.stat-item .label {
  font-size: 12px;
  color: #6b7280;
}

.stat-item .value {
  font-weight: 600;
  color: #111827;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
