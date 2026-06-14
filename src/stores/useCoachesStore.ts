import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Coach, CoachFilter, ScheduleSlot, DaySchedule, AsyncState } from '@/types'
import { initAsync } from '@/types'
import { fetchCoaches, fetchCoach, fetchCoachSchedule } from '@/services/coaches.service'

export const useCoachesStore = defineStore('coaches', () => {
  const list = ref<AsyncState<Coach[]>>(initAsync())
  const selected = ref<AsyncState<Coach>>(initAsync())
  const schedule = ref<AsyncState<{ week: DaySchedule[]; slots: ScheduleSlot[] }>>(initAsync())
  const activeFilter = ref<CoachFilter>({})

  const filteredList = computed<Coach[]>(() => list.value.data ?? [])

  async function loadCoaches(filter?: CoachFilter) {
    if (filter !== undefined) activeFilter.value = filter
    list.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchCoaches(activeFilter.value)
      list.value = { data, status: 'success', error: null }
    } catch (e) {
      list.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load coaches',
      }
    }
  }

  async function loadCoach(id: string) {
    selected.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchCoach(id)
      if (data) {
        selected.value = { data, status: 'success', error: null }
      } else {
        selected.value = { data: null, status: 'error', error: 'Coach not found' }
      }
    } catch (e) {
      selected.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load coach',
      }
    }
  }

  async function loadSchedule(coachId: string) {
    schedule.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchCoachSchedule(coachId)
      schedule.value = { data, status: 'success', error: null }
    } catch (e) {
      schedule.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load schedule',
      }
    }
  }

  function setFilter(filter: CoachFilter) {
    activeFilter.value = filter
  }

  return {
    list,
    selected,
    schedule,
    activeFilter,
    filteredList,
    loadCoaches,
    loadCoach,
    loadSchedule,
    setFilter,
  }
})
