import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Profile, AsyncState } from '@/types'
import { initAsync } from '@/types'
import { fetchProfile, updateProfile } from '@/services/profile.service'

export const useProfileStore = defineStore('profile', () => {
  const state = ref<AsyncState<Profile>>(initAsync())
  const saving = ref(false)
  const saveError = ref<string | null>(null)

  const displayName = computed<string>(() => {
    const p = state.value.data
    if (!p) return 'User'
    const parts = [p.firstName, p.lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'User'
  })

  const initials = computed<string>(() => {
    const name = displayName.value
    const parts = name.trim().split(/\s+/).filter(Boolean)
    const a = parts[0] ?? ''
    const b = parts[1] ?? ''
    if (a && b) return ((a[0] ?? '') + (b[0] ?? '')).toUpperCase()
    return a.slice(0, 2).toUpperCase() || '?'
  })

  async function loadProfile() {
    state.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchProfile()
      state.value = { data, status: 'success', error: null }
    } catch (e) {
      state.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load profile',
      }
    }
  }

  async function saveProfile(patch: Partial<Profile>): Promise<boolean> {
    saving.value = true
    saveError.value = null
    try {
      const data = await updateProfile(patch)
      state.value = { data, status: 'success', error: null }
      return true
    } catch (e) {
      saveError.value = e instanceof Error ? e.message : 'Failed to save profile'
      return false
    } finally {
      saving.value = false
    }
  }

  return { state, saving, saveError, displayName, initials, loadProfile, saveProfile }
})
