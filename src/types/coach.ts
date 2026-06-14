export interface Coach {
  id: string
  name: string
  avatarUrl: string | null
  rating: number | null
  location: string | null
  country: string | null
  languages: string[]
  tokenCost: number
  recurring: boolean
}

export interface CoachFilter {
  language?: string
  minRating?: number
  maxTokenCost?: number
}
