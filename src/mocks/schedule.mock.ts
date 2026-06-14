import type { DaySchedule, ScheduleSlot } from '@/types'

export const WEEK_SCHEDULE_MOCK: DaySchedule[] = [
  { day: 'Monday', start: '09:00', end: '17:00' },
  { day: 'Tuesday', start: '09:00', end: '17:00' },
  { day: 'Wednesday', start: '13:00', end: '20:00' },
  { day: 'Thursday', start: '09:00', end: '17:00' },
  { day: 'Friday', start: '09:00', end: '15:00' },
]

export const SCHEDULE_SLOTS_MOCK: ScheduleSlot[] = [
  {
    id: 's-001',
    coachId: 'c-001',
    start: '2026-06-16T09:00:00+07:00',
    end: '2026-06-16T09:30:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'available',
    tokenCost: 3,
  },
  {
    id: 's-002',
    coachId: 'c-001',
    start: '2026-06-16T09:30:00+07:00',
    end: '2026-06-16T10:00:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'available',
    tokenCost: 3,
  },
  {
    id: 's-003',
    coachId: 'c-001',
    start: '2026-06-16T10:00:00+07:00',
    end: '2026-06-16T10:30:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'booked',
    tokenCost: 3,
  },
  {
    id: 's-004',
    coachId: 'c-001',
    start: '2026-06-16T11:00:00+07:00',
    end: '2026-06-16T11:30:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'past',
    tokenCost: 3,
  },
  {
    id: 's-005',
    coachId: 'c-001',
    start: '2026-06-16T14:00:00+07:00',
    end: '2026-06-16T14:30:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'full',
    tokenCost: 3,
  },
]
