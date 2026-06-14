import type { NotificationItem } from '@/types'
import { NOTIFICATIONS_MOCK } from '@/mocks/notifications.mock'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

let _store = [...NOTIFICATIONS_MOCK]

export async function fetchNotifications(): Promise<NotificationItem[]> {
  await delay(300)
  return _store.map((n) => ({ ...n }))
}

export async function markAllRead(): Promise<void> {
  await delay(200)
  _store = _store.map((n) => ({ ...n, read: true }))
}
