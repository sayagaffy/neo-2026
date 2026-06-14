<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff, CheckCircle } from 'lucide-vue-next'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const current = ref('')
const next = ref('')
const confirm = ref('')
const showCurrent = ref(false)
const showNext = ref(false)
const showConfirm = ref(false)
const submitting = ref(false)
const success = ref(false)
const submitError = ref<string | null>(null)

// Password strength: 0–4
const strength = computed<number>(() => {
  const p = next.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[strength.value] ?? ''
})

const strengthColor = computed(() => {
  const colors = ['', 'bg-danger', 'bg-warning', 'bg-success', 'bg-success']
  return colors[strength.value] ?? ''
})

const passwordsMatch = computed(
  () => confirm.value.length > 0 && next.value === confirm.value,
)

const isValid = computed(
  () =>
    current.value.trim().length > 0 &&
    strength.value >= 3 &&
    passwordsMatch.value,
)

const currentErrors = computed(() =>
  submitError.value && !current.value ? 'Current password is required' : undefined,
)

const confirmError = computed(() =>
  confirm.value.length > 0 && !passwordsMatch.value ? 'Passwords do not match' : undefined,
)

async function submit() {
  if (!isValid.value) return
  submitting.value = true
  submitError.value = null
  // Mock: always succeed after delay
  await new Promise((r) => setTimeout(r, 800))
  submitting.value = false
  success.value = true
  current.value = ''
  next.value = ''
  confirm.value = ''
}

function reset() {
  success.value = false
}
</script>

<template>
  <div class="mx-auto w-full max-w-[640px] px-4 py-6 lg:px-6 lg:py-10">
    <h1 class="mb-6 text-h1 font-semibold text-text">Settings</h1>

    <BaseCard :padding="true">
      <!-- Section header -->
      <h2 class="mb-5 text-body font-semibold text-text">Change Password</h2>

      <!-- Success state -->
      <div
        v-if="success"
        class="flex flex-col items-center gap-3 py-8 text-center"
      >
        <CheckCircle :size="40" class="text-success" />
        <p class="text-body font-semibold text-text">Password updated</p>
        <p class="text-small text-text-muted">Your password has been changed successfully.</p>
        <BaseButton variant="secondary" class="mt-2" @click="reset">Change again</BaseButton>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="submit">
        <!-- Current password -->
        <div class="relative">
          <BaseInput
            v-model="current"
            :type="showCurrent ? 'text' : 'password'"
            label="Current password"
            placeholder="Enter current password"
            :error="currentErrors"
            autocomplete="current-password"
          />
          <button
            type="button"
            tabindex="-1"
            class="absolute right-3 top-9 flex size-8 items-center justify-center text-text-muted hover:text-text"
            :aria-label="showCurrent ? 'Hide password' : 'Show password'"
            @click="showCurrent = !showCurrent"
          >
            <component :is="showCurrent ? EyeOff : Eye" :size="18" />
          </button>
        </div>

        <!-- New password -->
        <div class="relative">
          <BaseInput
            v-model="next"
            :type="showNext ? 'text' : 'password'"
            label="New password"
            placeholder="Min 8 characters"
            hint="Use uppercase, numbers, and symbols for a stronger password"
            autocomplete="new-password"
          />
          <button
            type="button"
            tabindex="-1"
            class="absolute right-3 top-9 flex size-8 items-center justify-center text-text-muted hover:text-text"
            :aria-label="showNext ? 'Hide password' : 'Show password'"
            @click="showNext = !showNext"
          >
            <component :is="showNext ? EyeOff : Eye" :size="18" />
          </button>
        </div>

        <!-- Strength meter -->
        <div v-if="next.length > 0" class="space-y-1">
          <div class="flex h-1.5 gap-1">
            <div
              v-for="i in 4"
              :key="i"
              class="flex-1 rounded-full transition-colors duration-200"
              :class="i <= strength ? strengthColor : 'bg-neutral-200'"
            />
          </div>
          <p class="text-caption" :class="strength >= 3 ? 'text-success' : 'text-text-muted'">
            {{ strengthLabel }}
          </p>
        </div>

        <!-- Confirm password -->
        <div class="relative">
          <BaseInput
            v-model="confirm"
            :type="showConfirm ? 'text' : 'password'"
            label="Confirm new password"
            placeholder="Re-enter new password"
            :error="confirmError"
            autocomplete="new-password"
          />
          <button
            type="button"
            tabindex="-1"
            class="absolute right-3 top-9 flex size-8 items-center justify-center text-text-muted hover:text-text"
            :aria-label="showConfirm ? 'Hide password' : 'Show password'"
            @click="showConfirm = !showConfirm"
          >
            <component :is="showConfirm ? EyeOff : Eye" :size="18" />
          </button>
        </div>

        <!-- Passwords match indicator -->
        <p v-if="passwordsMatch" class="flex items-center gap-1.5 text-caption text-success">
          <CheckCircle :size="14" />
          Passwords match
        </p>

        <!-- Submit error -->
        <p v-if="submitError" class="text-small text-danger">{{ submitError }}</p>

        <BaseButton
          type="submit"
          variant="primary"
          block
          :disabled="!isValid || submitting"
          :loading="submitting"
          class="mt-2"
        >
          Update password
        </BaseButton>
      </form>
    </BaseCard>
  </div>
</template>
