export interface WeeklyPoint {
  weekLabel: string
  points: number
}

export interface Certificate {
  id: string
  title: string
  awardedAt: string | null
}

export interface RecordsMetrics {
  pointsEarned: number | null
  pointsToComplete: number | null
  studyTimeMinutes: number | null
  masteryTests: number | null
  coachingSessions: number | null
  progressToCertificate: number | null
  currentLevel: string | null
  currentCourse: string | null
  currentLevelGoal: string | null
  weeklyPointsThisWeek: number | null
  weeklyPointsGoal: number | null
  studyDaysThisWeek: number | null
  studyDaysGoal: number | null
  studyStreak: number | null
  weeklyPoints: WeeklyPoint[]
  certificates: Certificate[]
}
