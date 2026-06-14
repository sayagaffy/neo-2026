import type { NotificationItem } from '@/types'

export const NOTIFICATIONS_MOCK: NotificationItem[] = [
  {
    id: 'n-001',
    title: 'Session reminder',
    body: 'Your session with Sarah Mitchell starts in 30 minutes.',
    createdAt: '2026-06-15T13:30:00+07:00',
    read: false,
  },
  {
    id: 'n-002',
    title: 'Session completed',
    body: 'Your session with James Tan has been marked as completed.',
    createdAt: '2026-06-14T10:30:00+07:00',
    read: false,
  },
  {
    id: 'n-003',
    title: 'Token added',
    body: '5 tokens have been added to your account.',
    createdAt: '2026-06-10T08:00:00+07:00',
    read: true,
  },
]

// Broken case: no notifications
export const NOTIFICATIONS_EMPTY_MOCK: NotificationItem[] = []
