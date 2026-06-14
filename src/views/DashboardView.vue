<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CalendarPlus, Video, Coins, Clock, TrendingUp } from 'lucide-vue-next'
import { useBookingStore } from '@/stores/useBookingStore'
import { useTokensStore } from '@/stores/useTokensStore'
import { useRecordsStore } from '@/stores/useRecordsStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Avatar from '@/components/ui/Avatar.vue'
import {
  formatCountdown,
  formatSessionDate,
  formatSessionTime,
  formatStat,
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
  ticker = setInterval(() => { now.value = new Date() }, 30_000)
})
onUnmounted(() => clearInterval(ticker))

const nextSession = computed(() => bookingStore.nextSession)

const countdown = computed(() =>
  nextSession.value ? formatCountdown(nextSession.value.start, now.value) : null,
)

const canJoin = computed(() => {
  if (!nextSession.value?.joinUrl) return false
  const diff = new Date(nextSession.value.start).getTime() - now.value.getTime()
  return diff <= 15 * 60 * 1000
})

const weeklyPoints = computed(() => recordsStore.state.data?.weeklyPoints ?? [])
const maxPoints = computed(() => Math.max(...weeklyPoints.value.map((w) => w.points), 1))
const tokenBalance = computed(() => tokensStore.summary.data?.balance ?? null)
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-6 lg:px-8 lg:py-8">

    <!-- ── Left / Main column ─────────────────────────────── -->
    <div class="space-y-4">

      <!-- Next Session hero -->
      <section>
        <h2 class="mb-3 text-small font-semibold text-text-muted uppercase tracking-wide">
          Next Session
        </h2>

        <!-- Loading -->
        <BaseCard v-if="bookingStore.upcoming.status === 'loading'" :padding="true">
          <div class="flex items-center gap-4">
            <Skeleton variant="avatar" />
            <div class="flex-1 space-y-2">
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="35%" />
            </div>
            <Skeleton variant="text" width="80px" />
          </div>
        </BaseCard>

        <!-- Has session -->
        <BaseCard
          v-else-if="nextSession"
          :padding="true"
          class="border border-border"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar :name="nextSession.coachName" :size="48" class="shrink-0" />

            <div class="flex-1 min-w-0">
              <p class="text-body font-semibold text-text truncate">
                {{ nextSession.coachName }}
              </p>
              <p class="text-small text-text-muted">
                {{ formatSessionDate(nextSession.start, nextSession.timezone) }} ·
                {{ formatSessionTime(nextSession.start, nextSession.timezone) }}
              </p>
              <p v-if="nextSession.level" class="text-caption text-text-muted">
                {{ nextSession.level }}
              </p>
            </div>

            <!-- Countdown + Join -->
            <div class="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <div class="flex items-center gap-1.5 text-caption font-semibold text-primary">
                <Clock :size="13" />
                <span>{{ countdown }}</span>
              </div>
              <a
                v-if="nextSession.joinUrl && canJoin"
                :href="nextSession.joinUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BaseButton variant="primary" size="md">
                  <Video :size="16" class="mr-1.5" /> Join
                </BaseButton>
              </a>
              <BaseButton v-else variant="secondary" size="md" :disabled="true">
                <Video :size="16" class="mr-1.5" /> Join
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- No session -->
        <BaseCard v-else-if="bookingStore.upcoming.status === 'success'" :padding="true" class="border border-dashed border-border">
          <EmptyState
            :icon="CalendarPlus"
            title="No upcoming sessions"
            message="Book a coach to schedule your next session."
            cta-label="Book A Coach"
            @cta="$router.push('/book')"
          />
        </BaseCard>
      </section>

      <!-- Weekly Points chart -->
      <section>
        <h2 class="mb-3 text-small font-semibold text-text-muted uppercase tracking-wide">
          Last 4 Weeks
        </h2>

        <BaseCard :padding="true">
          <!-- Loading -->
          <div v-if="recordsStore.state.status === 'loading'" class="flex items-end gap-3 h-32">
            <div v-for="i in 4" :key="i" class="flex flex-1 flex-col items-center gap-2">
              <Skeleton variant="text" width="100%" :height="`${40 + i * 12}px`" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>

          <!-- Empty -->
          <div
            v-else-if="weeklyPoints.length === 0"
            class="flex h-32 items-center justify-center text-small text-text-muted"
          >
            No weekly data yet
          </div>

          <!-- Chart -->
          <div v-else class="flex items-end gap-3" style="height: 128px">
            <div
              v-for="week in weeklyPoints"
              :key="week.weekLabel"
              class="flex flex-1 flex-col items-center justify-end gap-1"
            >
              <span class="text-caption font-semibold text-text">{{ week.points }}</span>
              <div
                class="w-full rounded-t-md bg-primary transition-[height] duration-500"
                :style="{ height: `${Math.round((week.points / maxPoints) * 88)}px` }"
              />
              <span class="text-[10px] text-text-muted leading-none text-center">
                {{ week.weekLabel }}
              </span>
            </div>
          </div>
        </BaseCard>
      </section>
    </div>

    <!-- ── Right rail ─────────────────────────────────────── -->
    <div class="mt-4 space-y-4 lg:mt-0">

      <!-- Token balance -->
      <section>
        <h2 class="mb-3 text-small font-semibold text-text-muted uppercase tracking-wide">
          Token Balance
        </h2>
        <BaseCard :padding="true">
          <div
            v-if="tokensStore.summary.status === 'loading'"
            class="flex items-center gap-3"
          >
            <Skeleton variant="avatar" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div v-else class="flex items-center gap-3">
            <span class="flex size-10 items-center justify-center rounded-full bg-primary-soft">
              <Coins :size="20" class="text-primary" />
            </span>
            <div>
              <p class="text-stat font-bold text-text leading-none">
                {{ formatStat(tokenBalance) }}
              </p>
              <p class="text-caption text-text-muted">tokens available</p>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Progress summary -->
      <section>
        <h2 class="mb-3 text-small font-semibold text-text-muted uppercase tracking-wide">
          Progress
        </h2>
        <BaseCard :padding="true">
          <div
            v-if="recordsStore.state.status === 'loading'"
            class="space-y-3"
          >
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="line" />
            <Skeleton variant="text" width="40%" />
          </div>
          <template v-else-if="recordsStore.state.data">
            <p class="text-small text-text-muted mb-1">
              {{ recordsStore.state.data.currentCourse ?? '—' }}
            </p>
            <div class="flex items-center gap-2 mb-3">
              <div class="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  class="h-full rounded-full bg-primary transition-[width] duration-500"
                  :style="{ width: `${recordsStore.state.data.progressToCertificate ?? 0}%` }"
                />
              </div>
              <span class="text-caption font-semibold text-text shrink-0">
                {{ recordsStore.state.data.progressToCertificate ?? 0 }}%
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-small text-text-muted">
              <TrendingUp :size="14" />
              <span>{{ formatStat(recordsStore.state.data.pointsEarned) }} pts earned</span>
            </div>
          </template>
          <div v-else class="text-small text-text-muted">No data</div>
        </BaseCard>
      </section>

      <!-- CTA -->
      <RouterLink to="/book" class="block">
        <BaseButton variant="primary" block>
          <CalendarPlus :size="16" class="mr-2" />
          Book A Coach
        </BaseButton>
      </RouterLink>
    </div>

  </div>
</template>
