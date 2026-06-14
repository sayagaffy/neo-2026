import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RecordsMetrics, AsyncState } from '@/types'
import { initAsync } from '@/types'
import { fetchRecords } from '@/services/records.service'

export const useRecordsStore = defineStore('records', () => {
  const state = ref<AsyncState<RecordsMetrics>>(initAsync())

  const studyTimeFormatted = computed<string>(() => {
    const mins = state.value.data?.studyTimeMinutes
    if (mins == null) return '—'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m.toString().padStart(2, '0')}m`
  })

  const progressPercent = computed<number>(() => {
    return state.value.data?.progressToCertificate ?? 0
  })

  async function loadRecords(courseId?: string) {
    state.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchRecords(courseId)
      state.value = { data, status: 'success', error: null }
    } catch (e) {
      state.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load records',
      }
    }
  }

  return { state, studyTimeFormatted, progressPercent, loadRecords }
})
