import type { Profile } from '@/types'

export const PROFILE_MOCK: Profile = {
  id: 'u-001',
  firstName: 'User',
  lastName: 'Student',
  email: 'user@example.com',
  phone: '+62 812 3456 7890',
  country: 'Indonesia',
  nativeLanguage: 'Indonesian',
  timezone: 'Asia/Jakarta',
  currentLevel: 'B2 neoPrep+',
}

// Broken case: minimal profile with nulls
export const PROFILE_SPARSE_MOCK: Profile = {
  id: 'u-002',
  firstName: null,
  lastName: null,
  email: 'sparse@example.com',
  phone: null,
  country: null,
  nativeLanguage: null,
  timezone: null,
  currentLevel: null,
}
