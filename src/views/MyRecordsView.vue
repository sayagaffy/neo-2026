<script setup lang="ts">
import { onMounted, computed } from 'vue'
import {
  Star,
  Crosshair,
  Clock,
  ClipboardCheck,
  Video,
  BookOpen,
  Flag,
  TrendingUp,
  Award,
  Printer,
} from 'lucide-vue-next'
import { useRecordsStore } from '@/stores/useRecordsStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { formatStudyTime, formatCertDate } from '@/utils/format'
import type { Component } from 'vue'

const store = useRecordsStore()

// Fire load synchronously so first render already sees 'loading' state (avoids idle→loading DOM swap)
if (store.state.status === 'idle') store.loadRecords()

onMounted(() => {
  if (store.state.status === 'idle') store.loadRecords()
})

const m = computed(() => store.state.data)
const loading = computed(() => store.state.status === 'loading' || store.state.status === 'idle')

interface MetricCard { label: string; value: string; unit: string; icon: Component }

const metricCards = computed<MetricCard[]>(() => [
  {
    label: 'Points earned',
    value: m.value?.pointsEarned != null ? `${m.value.pointsEarned}` : '—',
    unit: m.value?.pointsEarned != null ? 'pts' : '',
    icon: Star,
  },
  {
    label: 'Points to complete',
    value: m.value?.pointsToComplete != null ? `${m.value.pointsToComplete}` : '—',
    unit: m.value?.pointsToComplete != null ? 'pts' : '',
    icon: Crosshair,
  },
  {
    label: 'Study time',
    value: formatStudyTime(m.value?.studyTimeMinutes),
    unit: '',
    icon: Clock,
  },
  {
    label: 'Mastery tests',
    value: m.value?.masteryTests != null ? `${m.value.masteryTests}` : '—',
    unit: '',
    icon: ClipboardCheck,
  },
  {
    label: 'Coaching sessions',
    value: m.value?.coachingSessions != null ? `${m.value.coachingSessions}` : '—',
    unit: '',
    icon: Video,
  },
  {
    label: 'Current course',
    value: m.value?.currentCourse ?? '—',
    unit: '',
    icon: BookOpen,
  },
  {
    label: 'Level goal',
    value: m.value?.currentLevelGoal ?? '—',
    unit: '',
    icon: Flag,
  },
  {
    label: 'Progress to cert',
    value: m.value?.progressToCertificate != null ? `${m.value.progressToCertificate}` : '—',
    unit: m.value?.progressToCertificate != null ? '%' : '',
    icon: TrendingUp,
  },
])

const weeklyPoints = computed(() => m.value?.weeklyPoints ?? [])
const maxPoints = computed(() => Math.max(...weeklyPoints.value.map((w) => w.points), 1))

const certs = computed(() => m.value?.certificates ?? [])
const earnedCount = computed(() => certs.value.filter((c) => c.awardedAt).length)

function printPage() {
  window.print()
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 py-6 lg:px-8 lg:py-8">

    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-h1 font-semibold text-text">My records</h1>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 rounded-button border border-border bg-card px-3 py-2 text-small text-text">
          <span>{{ m?.currentCourse ?? 'General English' }}</span>
          <span class="text-text-muted">▾</span>
        </div>
        <button
          class="flex items-center gap-1.5 rounded-button border border-border bg-card px-3 py-2 text-small text-text-muted hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          @click="printPage"
        >
          <Printer :size="14" />
          Print
        </button>
      </div>
    </div>

    <!-- Error -->
    <ErrorState
      v-if="store.state.status === 'error'"
      :message="store.state.error ?? undefined"
      @retry="store.loadRecords()"
    />

    <template v-else>

      <!-- 8 Metric cards — grid always mounted; loading handled INSIDE each card -->
      <div class="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <BaseCard
          v-for="card in metricCards"
          :key="card.label"
          :padding="true"
        >
          <!-- Loading state inside the card -->
          <Skeleton v-if="loading" variant="metric" />
          <!-- Data state inside the card -->
          <template v-else>
            <div class="flex items-start justify-between gap-2">
              <p class="text-caption text-text-muted">{{ card.label }}</p>
              <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                <component :is="card.icon" :size="14" class="text-primary" />
              </span>
            </div>
            <p class="mt-2 text-stat font-bold text-text leading-none">
              {{ card.value }}<span v-if="card.unit" class="ml-1 text-small font-semibold text-text-muted">{{ card.unit }}</span>
            </p>
          </template>
        </BaseCard>
      </div>

      <!-- Bottom: chart + certs -->
      <div class="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">

        <!-- Bar chart -->
        <BaseCard :padding="true">
          <div class="mb-4">
            <p class="text-small font-semibold text-text">Earned study points</p>
            <p class="text-caption font-semibold uppercase tracking-wider text-text-muted">Last 4 weeks</p>
          </div>

          <div v-if="loading" class="flex items-end gap-4 px-2" style="height: 160px">
            <div v-for="i in 4" :key="i" class="flex flex-1 flex-col items-center gap-2">
              <div class="w-full rounded-t-md bg-neutral-100" :style="{ height: `${30 + i * 20}px` }" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>

          <div
            v-else-if="weeklyPoints.length === 0"
            class="flex items-center justify-center"
            style="height: 160px"
          >
            <EmptyState title="No data yet" message="Complete sessions to track weekly points." />
          </div>

          <div v-else class="flex items-end gap-4 px-2" style="height: 160px">
            <div
              v-for="week in weeklyPoints"
              :key="week.weekLabel"
              class="flex flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span class="text-caption font-semibold text-text">{{ week.points }}</span>
              <div
                class="w-full rounded-t-lg bg-primary transition-[height] duration-500"
                :style="{ height: `${Math.round((week.points / maxPoints) * 110)}px` }"
              />
              <span class="text-center text-[10px] leading-tight text-text-muted">
                {{ week.weekLabel }}
              </span>
            </div>
          </div>
        </BaseCard>

        <!-- Certificates -->
        <BaseCard :padding="true">
          <div class="mb-4 flex items-center justify-between">
            <p class="text-small font-semibold text-text">Certificates awarded</p>
            <span v-if="earnedCount > 0" class="text-caption text-text-muted">
              {{ earnedCount }} earned
            </span>
          </div>

          <div v-if="loading" class="space-y-3">
            <Skeleton v-for="i in 2" :key="i" variant="line" />
          </div>

          <EmptyState
            v-else-if="certs.length === 0"
            :icon="Award"
            title="No certificates yet"
            message="Complete your current course to earn a certificate."
          />

          <ul v-else class="divide-y divide-border">
            <li
              v-for="cert in certs"
              :key="cert.id"
              class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success-soft">
                <Award :size="16" class="text-success" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-small font-semibold text-text">{{ cert.title }}</p>
                <p class="text-caption text-text-muted">
                  {{ cert.awardedAt ? `Awarded ${formatCertDate(cert.awardedAt)}` : 'Pending' }}
                </p>
              </div>
              <StatusBadge
                :tone="cert.awardedAt ? 'success' : 'warning'"
                :label="cert.awardedAt ? 'Earned' : 'Pending'"
              />
            </li>
          </ul>
        </BaseCard>
      </div>

    </template>
  </div>
</template>
