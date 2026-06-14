import type { Appointment } from '@/types'

export const APPOINTMENTS_MOCK: Appointment[] = [
  {
    id: 'a-001',
    coachId: 'c-001',
    coachName: 'Carlo Consignado',
    coachAvatarUrl: null,
    start: '2026-06-16T16:00:00+07:00',
    end: '2026-06-16T16:25:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'upcoming',
    level: 'A2 neoPrep+',
    joinUrl: 'https://meet.example.com/session/a-001',
    recordingUrl: null,
  },
  {
    id: 'a-002',
    coachId: 'c-002',
    coachName: 'James Tan',
    coachAvatarUrl: null,
    start: '2026-06-10T10:00:00+07:00',
    end: '2026-06-10T10:30:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'completed',
    level: 'B1 neoPrep',
    joinUrl: null,
    recordingUrl: 'https://recordings.example.com/a-002',
  },
  {
    id: 'a-003',
    coachId: 'c-003',
    coachName: 'Elena Vasquez',
    coachAvatarUrl: null,
    start: '2026-06-08T09:00:00+07:00',
    end: '2026-06-08T09:30:00+07:00',
    timezone: 'Asia/Jakarta',
    status: 'cancelled',
    level: null,
    joinUrl: null,
    recordingUrl: null,
  },
]

export const APPOINTMENTS_EMPTY_MOCK: Appointment[] = []
