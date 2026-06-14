import type { RecordsMetrics } from '@/types'

export const RECORDS_MOCK: RecordsMetrics = {
  pointsEarned: 1240,
  pointsToComplete: 760,
  studyTimeMinutes: 865,
  masteryTests: 8,
  coachingSessions: 6,
  progressToCertificate: 62,
  currentLevel: 'A2 neoPrep+',
  currentCourse: 'General English',
  currentLevelGoal: 'B1 Intermediate',
  weeklyPointsThisWeek: 3480,
  weeklyPointsGoal: 6000,
  studyDaysThisWeek: 3,
  studyDaysGoal: 4,
  studyStreak: 12,
  weeklyPoints: [
    { weekLabel: 'Week 1', points: 180 },
    { weekLabel: 'Week 2', points: 240 },
    { weekLabel: 'Week 3', points: 150 },
    { weekLabel: 'Week 4', points: 295 },
  ],
  certificates: [
    { id: 'cert-1', title: 'A1 Beginner', awardedAt: '2025-03-01T00:00:00Z' },
    { id: 'cert-2', title: 'A2 Elementary', awardedAt: '2025-06-01T00:00:00Z' },
  ],
}

export const RECORDS_SPARSE_MOCK: RecordsMetrics = {
  pointsEarned: null,
  pointsToComplete: null,
  studyTimeMinutes: null,
  masteryTests: null,
  coachingSessions: null,
  progressToCertificate: null,
  currentLevel: null,
  currentCourse: null,
  currentLevelGoal: null,
  weeklyPointsThisWeek: null,
  weeklyPointsGoal: null,
  studyDaysThisWeek: null,
  studyDaysGoal: null,
  studyStreak: null,
  weeklyPoints: [],
  certificates: [],
}
