<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import Avatar from '@/components/ui/Avatar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import Chip from '@/components/ui/Chip.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const store = useProfileStore()
const editing = ref(false)

// Form uses empty strings so BaseInput v-model is always string
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  nativeLanguage: '',
  timezone: '',
})
const formErrors = ref<Partial<Record<keyof typeof form.value, string>>>({})

const COUNTRY_OPTIONS = [
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Australia', value: 'Australia' },
]

const TIMEZONE_OPTIONS = [
  { label: 'Asia/Jakarta (WIB, UTC+7)', value: 'Asia/Jakarta' },
  { label: 'Asia/Singapore (SGT, UTC+8)', value: 'Asia/Singapore' },
  { label: 'Asia/Kuala_Lumpur (MYT, UTC+8)', value: 'Asia/Kuala_Lumpur' },
  { label: 'America/New_York (ET)', value: 'America/New_York' },
  { label: 'Europe/London (GMT/BST)', value: 'Europe/London' },
  { label: 'Australia/Sydney (AEST)', value: 'Australia/Sydney' },
]

const profileName = computed(() => store.displayName)

// null → '' for form; '' → null on save
function toForm(v: string | null | undefined): string {
  return v ?? ''
}
function toNull(v: string): string | null {
  return v.trim() || null
}

function startEdit() {
  const d = store.state.data
  if (!d) return
  form.value = {
    firstName: toForm(d.firstName),
    lastName: toForm(d.lastName),
    email: toForm(d.email),
    phone: toForm(d.phone),
    country: toForm(d.country),
    nativeLanguage: toForm(d.nativeLanguage),
    timezone: toForm(d.timezone),
  }
  formErrors.value = {}
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

function validate(): boolean {
  const e: typeof formErrors.value = {}
  if (!form.value.email.trim()) e.email = 'Email is required'
  formErrors.value = e
  return Object.keys(e).length === 0
}

async function submitEdit() {
  if (!validate()) return
  const patch = {
    firstName: toNull(form.value.firstName),
    lastName: toNull(form.value.lastName),
    email: toNull(form.value.email),
    phone: toNull(form.value.phone),
    country: toNull(form.value.country),
    nativeLanguage: toNull(form.value.nativeLanguage),
    timezone: toNull(form.value.timezone),
  }
  const ok = await store.saveProfile(patch)
  if (ok) editing.value = false
}

onMounted(() => {
  if (store.state.status === 'idle') store.loadProfile()
})
</script>

<template>
  <div class="mx-auto w-full max-w-[720px] px-4 py-6 lg:px-6 lg:py-10">

    <!-- Loading -->
    <template v-if="store.state.status === 'loading'">
      <div class="mb-6 flex items-center gap-4 rounded-card bg-card p-5 shadow-e1">
        <Skeleton variant="avatar" />
        <div class="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="25%" />
        </div>
      </div>
      <div class="space-y-3">
        <Skeleton v-for="i in 6" :key="i" variant="line" />
      </div>
    </template>

    <!-- Error -->
    <ErrorState
      v-else-if="store.state.status === 'error'"
      :message="store.state.error ?? undefined"
      @retry="store.loadProfile()"
    />

    <!-- Loaded -->
    <template v-else-if="store.state.data">
      <!-- Header card -->
      <div class="mb-6 flex items-center gap-4 rounded-card bg-card p-5 shadow-e1">
        <Avatar :name="profileName" :size="60" />
        <div>
          <p class="text-h3 font-semibold text-text">{{ profileName }}</p>
          <p v-if="store.state.data.currentLevel" class="text-small text-text-muted">
            {{ store.state.data.currentLevel }}
          </p>
          <p v-if="store.state.data.timezone" class="text-caption text-text-muted">
            {{ store.state.data.timezone }}
          </p>
        </div>
      </div>

      <!-- Edit form -->
      <template v-if="editing">
        <form class="space-y-4" @submit.prevent="submitEdit">
          <h2 class="text-body font-semibold text-text">Personal Information</h2>
          <div class="grid gap-4 lg:grid-cols-2">
            <BaseInput v-model="form.firstName" label="First name" placeholder="First name" />
            <BaseInput v-model="form.lastName" label="Last name" placeholder="Last name" />
          </div>
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Email address"
            :error="formErrors.email"
          />
          <BaseInput v-model="form.phone" label="Phone" type="tel" placeholder="+62 …" />

          <h2 class="pt-2 text-body font-semibold text-text">Additional Information</h2>
          <BaseSelect
            v-model="form.country"
            label="Country"
            :options="COUNTRY_OPTIONS"
            placeholder="Select country"
          />
          <BaseInput
            v-model="form.nativeLanguage"
            label="Native language"
            placeholder="e.g. Indonesian"
          />
          <BaseSelect
            v-model="form.timezone"
            label="Timezone"
            :options="TIMEZONE_OPTIONS"
            placeholder="Select timezone"
          />

          <p v-if="store.saveError" class="text-small text-danger">{{ store.saveError }}</p>

          <div class="flex gap-3 pt-2">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="store.saving"
              :disabled="store.saving"
            >
              Save changes
            </BaseButton>
            <BaseButton
              type="button"
              variant="secondary"
              :disabled="store.saving"
              @click="cancelEdit"
            >
              Cancel
            </BaseButton>
          </div>
        </form>
      </template>

      <!-- Display mode -->
      <template v-else>
        <section class="mb-4 rounded-card bg-card shadow-e1">
          <h2 class="border-b border-border px-5 py-4 text-small font-semibold text-text">
            Personal Information
          </h2>
          <dl class="divide-y divide-border">
            <ProfileField label="First name" :value="store.state.data.firstName ?? undefined" />
            <ProfileField label="Last name" :value="store.state.data.lastName ?? undefined" />
            <ProfileField label="Email" :value="store.state.data.email ?? undefined" />
            <ProfileField label="Phone" :value="store.state.data.phone ?? undefined" />
          </dl>
        </section>

        <section class="mb-6 rounded-card bg-card shadow-e1">
          <h2 class="border-b border-border px-5 py-4 text-small font-semibold text-text">
            Additional Information
          </h2>
          <dl class="divide-y divide-border">
            <ProfileField label="Country" :value="store.state.data.country ?? undefined" />
            <div class="flex flex-col gap-1 px-5 py-4 lg:flex-row lg:items-center">
              <dt class="min-w-[160px] text-small font-medium text-text-muted">
                Native language
              </dt>
              <dd>
                <Chip
                  v-if="store.state.data.nativeLanguage"
                  :label="store.state.data.nativeLanguage"
                  variant="soft"
                  tone="primary"
                />
                <span v-else class="italic text-small text-text-muted">Not set</span>
              </dd>
            </div>
            <ProfileField label="Timezone" :value="store.state.data.timezone ?? undefined" />
            <ProfileField
              label="Current level"
              :value="store.state.data.currentLevel ?? undefined"
            />
          </dl>
        </section>

        <BaseButton variant="primary" block @click="startEdit">Update Profile</BaseButton>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'

const ProfileField = defineComponent({
  props: {
    label: { type: String, required: true },
    value: { type: String, default: undefined },
  },
  setup(props) {
    return () =>
      h('div', { class: 'flex flex-col gap-1 px-5 py-4 lg:flex-row lg:items-center' }, [
        h(
          'dt',
          { class: 'min-w-[160px] text-small font-medium text-text-muted' },
          props.label,
        ),
        h(
          'dd',
          {},
          props.value
            ? h('span', { class: 'text-body text-text' }, props.value)
            : h('span', { class: 'italic text-small text-text-muted' }, 'Not set'),
        ),
      ])
  },
})

export { ProfileField }
</script>
