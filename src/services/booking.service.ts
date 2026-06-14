import type { Appointment, AppointmentStatus } from '@/types'
import { APPOINTMENTS_MOCK } from '@/mocks/appointments.mock'

function normalizeAppointment(raw: unknown): Appointment {
  const r = raw as Record<string, unknown>
  const status = (r['status'] as AppointmentStatus | undefined) ?? 'upcoming'
  return {
    id: String(r['id'] ?? ''),
    coachId: String(r['coachId'] ?? ''),
    coachName: String(r['coachName'] ?? ''),
    coachAvatarUrl:
      typeof r['coachAvatarUrl'] === 'string' && r['coachAvatarUrl'] ? r['coachAvatarUrl'] : null,
    start: String(r['start'] ?? ''),
    end: String(r['end'] ?? ''),
    timezone: String(r['timezone'] ?? 'UTC'),
    status,
    level: typeof r['level'] === 'string' && r['level'] ? r['level'] : null,
    joinUrl: typeof r['joinUrl'] === 'string' && r['joinUrl'] ? r['joinUrl'] : null,
    recordingUrl:
      typeof r['recordingUrl'] === 'string' && r['recordingUrl'] ? r['recordingUrl'] : null,
  }
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export async function fetchAppointments(mode: 'upcoming' | 'history'): Promise<Appointment[]> {
  await delay(400)
  const statusFilter: AppointmentStatus[] =
    mode === 'upcoming' ? ['upcoming'] : ['completed', 'cancelled']
  return APPOINTMENTS_MOCK.filter((a) => statusFilter.includes(a.status)).map(normalizeAppointment)
}

export async function createAppointment(input: {
  coachId: string
  slotId: string
}): Promise<Appointment> {
  await delay(800)
  const appointment: Appointment = {
    id: `a-${Date.now()}`,
    coachId: input.coachId,
    coachName: 'Coach',
    coachAvatarUrl: null,
    start: new Date().toISOString(),
    end: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    timezone: 'Asia/Jakarta',
    status: 'upcoming',
    level: null,
    joinUrl: null,
    recordingUrl: null,
  }
  return normalizeAppointment(appointment)
}
