import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { NotificationItem, NotificationGroup, AsyncState } from '@/types'
import { initAsync } from '@/types'
import { fetchNotifications, markAllRead } from '@/services/notifications.service'

type GroupedNotifications = Record<NotificationGroup, NotificationItem[]>

function getGroup(createdAt: string): NotificationGroup {
  const now = new Date('2026-06-15T00:00:00+07:00')
  const date = new Date(createdAt)
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  return 'earlier'
}

export const useNotificationsStore = defineStore('notifications', () => {
  const state = ref<AsyncState<NotificationItem[]>>(initAsync())
  const panelOpen = ref(false)

  const unreadCount = computed<number>(() => {
    return state.value.data?.filter((n) => !n.read).length ?? 0
  })

  const grouped = computed<GroupedNotifications>(() => {
    const empty: GroupedNotifications = { today: [], yesterday: [], earlier: [] }
    const items = state.value.data
    if (!items) return empty
    return items.reduce<GroupedNotifications>((acc, item) => {
      const group = getGroup(item.createdAt)
      acc[group].push(item)
      return acc
    }, empty)
  })

  async function loadNotifications() {
    state.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchNotifications()
      state.value = { data, status: 'success', error: null }
    } catch (e) {
      state.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load notifications',
      }
    }
  }

  async function markRead() {
    try {
      await markAllRead()
      if (state.value.data) {
        state.value = {
          ...state.value,
          data: state.value.data.map((n) => ({ ...n, read: true })),
        }
      }
    } catch {
      // silent — non-critical
    }
  }

  function openPanel() {
    panelOpen.value = true
    void loadNotifications()
  }

  function closePanel() {
    panelOpen.value = false
  }

  return { state, panelOpen, unreadCount, grouped, loadNotifications, markRead, openPanel, closePanel }
})
