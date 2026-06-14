import type { Profile } from '@/types'
import { PROFILE_MOCK } from '@/mocks/profile.mock'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

function normalizeProfile(raw: unknown): Profile {
  const r = raw as Record<string, unknown>
  return {
    id: String(r['id'] ?? ''),
    firstName: str(r['firstName']),
    lastName: str(r['lastName']),
    email: str(r['email']),
    phone: str(r['phone']),
    country: str(r['country']),
    nativeLanguage: str(r['nativeLanguage']),
    timezone: str(r['timezone']),
    currentLevel: str(r['currentLevel']),
  }
}

export async function fetchProfile(): Promise<Profile> {
  await delay(300)
  return normalizeProfile(PROFILE_MOCK)
}

export async function updateProfile(patch: Partial<Profile>): Promise<Profile> {
  await delay(600)
  return normalizeProfile({ ...PROFILE_MOCK, ...patch })
}
