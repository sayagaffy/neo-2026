import type { RecordsMetrics } from '@/types'

export const RECORDS_MOCK: RecordsMetrics = {
  pointsEarned: 340,
  pointsToComplete: 500,
  studyTimeMinutes: 187,
  masteryTests: 4,
  coachingSessions: 6,
  progressToCertificate: 68,
  currentCourse: 'neoPrep+ B2',
  currentLevelGoal: 'C1 Advanced',
  weeklyPoints: [
    { weekLabel: 'Week 1', points: 60 },
    { weekLabel: 'Week 2', points: 95 },
    { weekLabel: 'Week 3', points: 80 },
    { weekLabel: 'Week 4', points: 105 },
  ],
  certificates: [
    { id: 'cert-1', title: 'B1 neoPrep Certified', awardedAt: '2026-03-15T00:00:00Z' },
    { id: 'cert-2', title: 'A2 Foundation', awardedAt: null },
  ],
}

// Broken case: null metrics + empty arrays
export const RECORDS_SPARSE_MOCK: RecordsMetrics = {
  pointsEarned: null,
  pointsToComplete: null,
  studyTimeMinutes: null,
  masteryTests: null,
  coachingSessions: null,
  progressToCertificate: null,
  currentCourse: null,
  currentLevelGoal: null,
  weeklyPoints: [],
  certificates: [],
}
