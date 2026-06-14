import type { Coach, CoachFilter } from '@/types'
import { COACHES_MOCK } from '@/mocks/coaches.mock'
import { SCHEDULE_SLOTS_MOCK, WEEK_SCHEDULE_MOCK } from '@/mocks/schedule.mock'

function normalizeCoach(raw: unknown): Coach {
  const r = raw as Record<string, unknown>
  const rating = Number(r['rating'])
  return {
    id: String(r['id'] ?? ''),
    name: String(r['name'] ?? ''),
    avatarUrl: typeof r['avatarUrl'] === 'string' && r['avatarUrl'] ? r['avatarUrl'] : null,
    rating: isNaN(rating) || rating === 0 ? null : rating,
    location: typeof r['location'] === 'string' && r['location'] ? r['location'] : null,
    country: typeof r['country'] === 'string' && r['country'] ? r['country'] : null,
    languages: Array.isArray(r['languages']) ? (r['languages'] as string[]) : [],
    tokenCost: typeof r['tokenCost'] === 'number' ? r['tokenCost'] : 0,
    recurring: Boolean(r['recurring']),
  }
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export async function fetchCoaches(filter?: CoachFilter): Promise<Coach[]> {
  await delay(400)
  let coaches = COACHES_MOCK.map(normalizeCoach)
  if (filter?.language) {
    coaches = coaches.filter((c) => c.languages.includes(filter.language!))
  }
  if (filter?.minRating != null) {
    coaches = coaches.filter((c) => c.rating != null && c.rating >= filter.minRating!)
  }
  if (filter?.maxTokenCost != null) {
    coaches = coaches.filter((c) => c.tokenCost <= filter.maxTokenCost!)
  }
  return coaches
}

export async function fetchCoach(id: string): Promise<Coach | null> {
  await delay(300)
  const found = COACHES_MOCK.find((c) => c.id === id)
  return found ? normalizeCoach(found) : null
}

export async function fetchCoachSchedule(coachId: string): Promise<{
  week: typeof WEEK_SCHEDULE_MOCK
  slots: typeof SCHEDULE_SLOTS_MOCK
}> {
  await delay(400)
  return {
    week: WEEK_SCHEDULE_MOCK,
    slots: SCHEDULE_SLOTS_MOCK.filter((s) => s.coachId === coachId),
  }
}
