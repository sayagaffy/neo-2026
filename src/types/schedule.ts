export type SlotStatus = 'available' | 'selected' | 'booked' | 'past' | 'full'

export interface ScheduleSlot {
  id: string
  coachId: string
  start: string
  end: string
  timezone: string
  status: SlotStatus
  tokenCost: number
}

export interface DaySchedule {
  day: string
  start: string
  end: string
}
