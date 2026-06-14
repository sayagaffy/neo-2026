<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Calendar, Globe, Video, CalendarPlus, Flame, ChevronRight } from 'lucide-vue-next'
import { useBookingStore } from '@/stores/useBookingStore'
import { useTokensStore } from '@/stores/useTokensStore'
import { useRecordsStore } from '@/stores/useRecordsStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Avatar from '@/components/ui/Avatar.vue'
import {
  formatCountdownBadge,
  formatSessionDate,
  formatSessionRange,
  formatTimezoneLabel,
} from '@/utils/format'

const bookingStore = useBookingStore()
const tokensStore = useTokensStore()
const recordsStore = useRecordsStore()

const now = ref(new Date())
let ticker: ReturnType<typeof setInterval>

onMounted(() => {
  bookingStore.loadUpcoming()
  tokensStore.loadSummary()
  recordsStore.loadRecords()
  ticker = setInterval(() => {
    now.value = new Date()
  }, 30_000)
})
onUnmounted(() => clearInterval(ticker))

const nextSession = computed(() => bookingStore.nextSession)

const countdownBadge = computed(() =>
  nextSession.value ? formatCountdownBadge(nextSession.value.start, now.value) : null,
)

const canJoin = computed(() => {
  if (!nextSession.value?.joinUrl) return false
  const diff = new Date(nextSession.value.start).getTime() - now.value.getTime()
  return diff <= 15 * 60 * 1000
})

const records = computed(() => recordsStore.state.data)

const progress = computed(() => records.value?.progressToCertificate ?? 0)
const CIRC = 2 * Math.PI * 44

const weeklyPct = computed(() => {
  const cur = records.value?.weeklyPointsThisWeek ?? 0
  const goal = records.value?.weeklyPointsGoal ?? 1
  return Math.min(Math.round((cur / goal) * 100), 100)
})

const tokenBalance = computed(() => tokensStore.summary.data?.balance ?? null)
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6 lg:grid lg:grid-cols-[1fr_288px] lg:gap-6 lg:px-8 lg:py-8">

    <!-- ── Left column ─────────────────────────────────────── -->
    <div class="space-y-4">

      <!-- Next Session — dark hero card -->
      <div class="rounded-card bg-indigo-700 p-5">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-caption font-semibold text-white/60 uppercase tracking-wider">
            Next coaching session
          </p>
          <span
            v-if="countdownBadge"
            class="rounded-full bg-white/10 px-3 py-0.5 text-caption font-semibold text-white"
          >
            {{ countdownBadge }}
          </span>
        </div>

        <!-- Loading -->
        <template v-if="bookingStore.upcoming.status === 'loading'">
          <div class="flex items-center gap-3">
            <Skeleton variant="avatar" />
            <div class="flex-1 space-y-2">
              <Skeleton variant="text" width="55%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        </template>

        <!-- Has session -->
        <template v-else-if="nextSession">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar :name="nextSession.coachName" :size="44" class="shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-body font-semibold text-white">{{ nextSession.coachName }}</p>
              <div class="mt-1.5 flex items-center gap-1.5 text-caption text-white/70">
                <Calendar :size="12" class="shrink-0" />
                <span>
                  {{ formatSessionDate(nextSession.start, nextSession.timezone) }} ·
                  {{ formatSessionRange(nextSession.start, nextSession.end, nextSession.timezone) }}
                </span>
              </div>
              <div class="mt-1 flex items-center gap-1.5 text-caption text-white/50">
                <Globe :size="12" class="shrink-0" />
                <span>{{ formatTimezoneLabel(nextSession.timezone, now) }}</span>
              </div>
              <div class="mt-4 flex flex-wrap items-center gap-2">
                <RouterLink to="/precall">
                  <BaseButton variant="secondary" size="md">Precall Test</BaseButton>
                </RouterLink>
                <a
                  v-if="canJoin && nextSession.joinUrl"
                  :href="nextSession.joinUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BaseButton variant="primary" size="md">
                    <Video :size="14" class="mr-1.5" /> Join
                  </BaseButton>
                </a>
                <BaseButton v-else variant="secondary" size="md" :disabled="true">
                  <Video :size="14" class="mr-1.5" /> Join
                </BaseButton>
              </div>
            </div>
          </div>
        </template>

        <!-- No session -->
        <template v-else-if="bookingStore.upcoming.status === 'success'">
          <div class="flex flex-col items-center gap-3 py-6 text-center">
            <CalendarPlus :size="28" class="text-white/40" />
            <p class="text-small text-white/60">No upcoming sessions</p>
            <RouterLink to="/book">
              <BaseButton variant="secondary" size="md">Book a Coach</BaseButton>
            </RouterLink>
          </div>
        </template>
      </div>

      <!-- This Week -->
      <BaseCard :padding="true">
        <p class="mb-4 text-caption font-semibold text-text-muted uppercase tracking-wider">
          This week
        </p>

        <template v-if="recordsStore.state.status === 'loading'">
          <div class="space-y-3">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="line" />
          </div>
        </template>

        <template v-else>
          <!-- Points progress bar -->
          <div class="mb-1 flex items-baseline justify-between">
            <p class="text-small text-text-muted">Points this week</p>
            <p class="text-small font-semibold text-text">
              {{ records?.weeklyPointsThisWeek?.toLocaleString('en-US') ?? '—' }}
              /
              {{ records?.weeklyPointsGoal?.toLocaleString('en-US') ?? '—' }}
            </p>
          </div>
          <div class="mb-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              class="h-full rounded-full bg-primary transition-[width] duration-700"
              :style="{ width: `${weeklyPct}%` }"
            />
          </div>

          <!-- Study days + streak -->
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-surface p-3">
              <p class="text-h3 font-bold text-text leading-none">
                {{ records?.studyDaysThisWeek ?? '—' }}<span class="text-small font-normal text-text-muted">/{{ records?.studyDaysGoal ?? '—' }}</span>
              </p>
              <p class="mt-1 text-caption text-text-muted">Study days</p>
            </div>
            <div class="rounded-xl bg-surface p-3">
              <p class="text-h3 font-bold text-text leading-none">
                {{ records?.studyStreak ?? '—' }}<span class="ml-1 text-small font-normal text-text-muted">days</span>
              </p>
              <p class="mt-1 flex items-center gap-1 text-caption text-text-muted">
                <Flame :size="11" class="text-warning" />
                Study streak
              </p>
            </div>
          </div>
        </template>
      </BaseCard>
    </div>

    <!-- ── Right rail ─────────────────────────────────────── -->
    <div class="mt-4 space-y-4 lg:mt-0">

      <!-- Level Progress donut -->
      <BaseCard :padding="true">
        <p class="mb-4 text-caption font-semibold text-text-muted uppercase tracking-wider">
          Level Progress
        </p>

        <template v-if="recordsStore.state.status === 'loading'">
          <div class="flex flex-col items-center gap-3">
            <Skeleton variant="avatar" width="112px" height="112px" />
            <Skeleton variant="text" width="60%" />
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col items-center gap-3">
            <!-- Donut -->
            <div class="relative inline-flex items-center justify-center">
              <svg class="h-[112px] w-[112px]" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="44"
                  fill="none"
                  stroke="var(--color-neutral-100)"
                  stroke-width="12"
                />
                <circle
                  cx="60" cy="60" r="44"
                  fill="none"
                  stroke="var(--color-primary)"
                  stroke-width="12"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                  :stroke-dasharray="CIRC"
                  :stroke-dashoffset="CIRC * (1 - progress / 100)"
                  style="transition: stroke-dashoffset 0.7s ease"
                />
              </svg>
              <div class="absolute text-center">
                <p class="text-h2 font-bold text-text leading-none">{{ progress }}%</p>
              </div>
            </div>
            <div class="text-center">
              <p class="text-small font-semibold text-primary">
                {{ records?.currentLevel ?? '—' }}
              </p>
              <p class="mt-0.5 text-caption text-text-muted">
                {{ progress }}% toward your {{ records?.currentLevel ?? '' }} certificate
              </p>
            </div>
          </div>
        </template>
      </BaseCard>

      <!-- Token Balance -->
      <RouterLink to="/token" class="block">
        <BaseCard :padding="true" :interactive="true">
          <div v-if="tokensStore.summary.status === 'loading'" class="space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="70%" />
          </div>
          <div v-else class="flex items-center justify-between">
            <div>
              <p class="text-caption text-text-muted">Token balance</p>
              <p class="mt-0.5 text-h3 font-bold text-text">
                {{ tokenBalance != null ? `${tokenBalance} tokens` : '—' }}
              </p>
            </div>
            <ChevronRight :size="18" class="shrink-0 text-text-muted" />
          </div>
        </BaseCard>
      </RouterLink>

      <!-- CTA -->
      <RouterLink to="/book" class="block">
        <BaseButton variant="primary" block>
          <CalendarPlus :size="16" class="mr-2" />
          Book a Coach
        </BaseButton>
      </RouterLink>
    </div>

  </div>
</template>
