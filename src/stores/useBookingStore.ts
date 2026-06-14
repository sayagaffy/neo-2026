import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Appointment, AsyncState } from '@/types'
import { initAsync } from '@/types'
import { fetchAppointments, createAppointment } from '@/services/booking.service'

export const useBookingStore = defineStore('booking', () => {
  const upcoming = ref<AsyncState<Appointment[]>>(initAsync())
  const history = ref<AsyncState<Appointment[]>>(initAsync())
  const booking = ref<AsyncState<Appointment>>(initAsync())
  const openCoachId = ref<string | null>(null)

  const nextSession = computed<Appointment | null>(() => {
    const list = upcoming.value.data
    if (!list || list.length === 0) return null
    return list[0] ?? null
  })

  const unreadCount = computed(() => upcoming.value.data?.length ?? 0)

  async function loadUpcoming() {
    upcoming.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchAppointments('upcoming')
      upcoming.value = { data, status: 'success', error: null }
    } catch (e) {
      upcoming.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load sessions',
      }
    }
  }

  async function loadHistory() {
    history.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchAppointments('history')
      history.value = { data, status: 'success', error: null }
    } catch (e) {
      history.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load history',
      }
    }
  }

  async function book(input: { coachId: string; slotId: string }) {
    booking.value = { data: null, status: 'loading', error: null }
    try {
      const data = await createAppointment(input)
      booking.value = { data, status: 'success', error: null }
      await loadUpcoming()
    } catch (e) {
      booking.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Booking failed',
      }
    }
  }

  function openSchedule(coachId: string) {
    openCoachId.value = coachId
  }

  function closeSchedule() {
    openCoachId.value = null
  }

  return {
    upcoming,
    history,
    booking,
    openCoachId,
    nextSession,
    unreadCount,
    loadUpcoming,
    loadHistory,
    book,
    openSchedule,
    closeSchedule,
  }
})
