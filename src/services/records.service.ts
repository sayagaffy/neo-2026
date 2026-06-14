import type { RecordsMetrics } from '@/types'
import { RECORDS_MOCK } from '@/mocks/records.mock'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function num(v: unknown): number | null {
  const n = Number(v)
  return v == null || isNaN(n) ? null : n
}

function normalizeRecords(raw: unknown): RecordsMetrics {
  const r = raw as Record<string, unknown>
  return {
    pointsEarned: num(r['pointsEarned']),
    pointsToComplete: num(r['pointsToComplete']),
    studyTimeMinutes: num(r['studyTimeMinutes']),
    masteryTests: num(r['masteryTests']),
    coachingSessions: num(r['coachingSessions']),
    progressToCertificate: num(r['progressToCertificate']),
    currentCourse:
      typeof r['currentCourse'] === 'string' && r['currentCourse'] ? r['currentCourse'] : null,
    currentLevelGoal:
      typeof r['currentLevelGoal'] === 'string' && r['currentLevelGoal']
        ? r['currentLevelGoal']
        : null,
    weeklyPoints: Array.isArray(r['weeklyPoints'])
      ? (r['weeklyPoints'] as RecordsMetrics['weeklyPoints'])
      : [],
    certificates: Array.isArray(r['certificates'])
      ? (r['certificates'] as RecordsMetrics['certificates'])
      : [],
  }
}

export async function fetchRecords(_courseId?: string): Promise<RecordsMetrics> {
  await delay(400)
  return normalizeRecords(RECORDS_MOCK)
}
