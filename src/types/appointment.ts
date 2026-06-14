export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  coachId: string
  coachName: string
  coachAvatarUrl: string | null
  start: string
  end: string
  timezone: string
  status: AppointmentStatus
  level: string | null
  joinUrl: string | null
  recordingUrl: string | null
}
