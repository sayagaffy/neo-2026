<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { Award } from 'lucide-vue-next'
import { useRecordsStore } from '@/stores/useRecordsStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { formatStat, formatStudyTime, formatPercent, formatCertDate } from '@/utils/format'

const store = useRecordsStore()

onMounted(() => {
  if (store.state.status === 'idle') store.loadRecords()
})

const metrics = computed(() => store.state.data)
const weeklyPoints = computed(() => metrics.value?.weeklyPoints ?? [])
const maxPoints = computed(() => Math.max(...weeklyPoints.value.map((w) => w.points), 1))

const metricCards = computed(() => [
  {
    label: 'Points Earned',
    value: formatStat(metrics.value?.pointsEarned),
    sub: metrics.value?.pointsToComplete
      ? `of ${metrics.value.pointsToComplete} to complete`
      : undefined,
  },
  { label: 'Study Time', value: formatStudyTime(metrics.value?.studyTimeMinutes) },
  { label: 'Mastery Tests', value: formatStat(metrics.value?.masteryTests) },
  { label: 'Coaching Sessions', value: formatStat(metrics.value?.coachingSessions) },
])
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">
    <h1 class="mb-6 text-h1 font-semibold text-text">My Records</h1>

    <!-- Error -->
    <ErrorState
      v-if="store.state.status === 'error'"
      :message="store.state.error ?? undefined"
      @retry="store.loadRecords()"
    />

    <template v-else>

      <!-- Metric cards: 2-col mobile, 4-col desktop -->
      <div class="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <template v-if="store.state.status === 'loading'">
          <BaseCard v-for="i in 4" :key="i" :padding="true">
            <Skeleton variant="metric" />
          </BaseCard>
        </template>
        <template v-else>
          <BaseCard
            v-for="card in metricCards"
            :key="card.label"
            :padding="true"
          >
            <p class="text-caption text-text-muted mb-1">{{ card.label }}</p>
            <p class="text-stat font-bold text-text leading-none">{{ card.value }}</p>
            <p v-if="card.sub" class="mt-1 text-caption text-text-muted">{{ card.sub }}</p>
          </BaseCard>
        </template>
      </div>

      <!-- Progress bar -->
      <BaseCard v-if="store.state.status !== 'loading'" :padding="true" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <p class="text-small font-semibold text-text">
              {{ metrics?.currentCourse ?? '—' }}
            </p>
            <p class="text-caption text-text-muted">
              Goal: {{ metrics?.currentLevelGoal ?? '—' }}
            </p>
          </div>
          <span class="text-body font-bold text-primary">
            {{ formatPercent(metrics?.progressToCertificate) }}
          </span>
        </div>
        <div class="h-2.5 w-full rounded-full bg-neutral-200 overflow-hidden">
          <div
            class="h-full rounded-full bg-primary transition-[width] duration-500"
            :style="{ width: `${metrics?.progressToCertificate ?? 0}%` }"
          />
        </div>
      </BaseCard>

      <!-- Weekly chart -->
      <BaseCard :padding="true" class="mb-4">
        <h2 class="mb-4 text-small font-semibold text-text">Last 4 Weeks</h2>

        <!-- Loading -->
        <div v-if="store.state.status === 'loading'" class="flex items-end gap-3 h-40">
          <div v-for="i in 4" :key="i" class="flex flex-1 flex-col items-center gap-2">
            <Skeleton variant="text" />
            <div class="w-full rounded-t-md bg-neutral-200" :style="{ height: `${30 + i * 20}px` }" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>

        <!-- Empty -->
        <div
          v-else-if="weeklyPoints.length === 0"
          class="flex h-40 items-center justify-center"
        >
          <EmptyState title="No data yet" message="Complete sessions to track weekly points." />
        </div>

        <!-- Bars -->
        <div v-else class="flex items-end gap-4 px-2" style="height: 160px">
          <div
            v-for="week in weeklyPoints"
            :key="week.weekLabel"
            class="flex flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span class="text-caption font-semibold text-primary">{{ week.points }}</span>
            <div
              class="w-full rounded-t-lg bg-primary transition-[width] duration-500"
              :style="{ height: `${Math.round((week.points / maxPoints) * 110)}px` }"
            />
            <span class="text-[10px] text-text-muted text-center leading-tight">
              {{ week.weekLabel }}
            </span>
          </div>
        </div>
      </BaseCard>

      <!-- Certificates -->
      <BaseCard :padding="true">
        <h2 class="mb-4 text-small font-semibold text-text">Certificates</h2>

        <!-- Loading -->
        <div v-if="store.state.status === 'loading'" class="space-y-3">
          <Skeleton v-for="i in 2" :key="i" variant="line" />
        </div>

        <!-- Empty -->
        <EmptyState
          v-else-if="(metrics?.certificates ?? []).length === 0"
          :icon="Award"
          title="No certificates yet"
          message="Complete your current course to earn a certificate."
        />

        <!-- List -->
        <ul v-else class="divide-y divide-border">
          <li
            v-for="cert in metrics!.certificates"
            :key="cert.id"
            class="flex items-center gap-3 py-3"
          >
            <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-success-soft">
              <Award :size="18" class="text-success" />
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-small font-semibold text-text truncate">{{ cert.title }}</p>
              <p class="text-caption text-text-muted">
                {{ cert.awardedAt ? formatCertDate(cert.awardedAt) : 'Pending' }}
              </p>
            </div>
          </li>
        </ul>
      </BaseCard>

    </template>
  </div>
</template>
