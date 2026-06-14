<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import {
  Camera,
  Mic,
  Volume2,
  Wifi,
  CheckCircle,
  XCircle,
  Loader,
  Circle,
  ShieldAlert,
} from 'lucide-vue-next'
import type { PrecallTest, PrecallStatus } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const ICONS: Record<PrecallTest['id'], typeof Camera> = {
  camera: Camera,
  microphone: Mic,
  speaker: Volume2,
  network: Wifi,
}

const tests = ref<PrecallTest[]>([
  { id: 'camera', label: 'Camera', status: 'not-tested' },
  { id: 'microphone', label: 'Microphone', status: 'not-tested' },
  { id: 'speaker', label: 'Speaker', status: 'not-tested' },
  { id: 'network', label: 'Network', status: 'not-tested' },
])

const running = ref(false)
const done = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
const cameraStream = ref<MediaStream | null>(null)
const cameraError = ref<string | null>(null)

const readyCount = computed(() => tests.value.filter((t) => t.status === 'ok').length)

function statusTone(s: PrecallStatus): 'success' | 'danger' | 'info' | 'neutral' {
  if (s === 'ok') return 'success'
  if (s === 'failed') return 'danger'
  if (s === 'running') return 'info'
  return 'neutral'
}

function statusLabel(s: PrecallStatus): string {
  if (s === 'ok') return 'OK'
  if (s === 'failed') return 'Failed'
  if (s === 'running') return 'Testing…'
  return 'Not tested'
}

async function startCamera() {
  cameraError.value = null
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    cameraStream.value = stream
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (e) {
    cameraError.value =
      e instanceof DOMException && e.name === 'NotAllowedError'
        ? 'Camera permission blocked. Please allow access in your browser settings.'
        : 'Camera not available or not connected.'
  }
}

async function runTests() {
  running.value = true
  done.value = false

  // Reset
  tests.value.forEach((t) => (t.status = 'not-tested'))

  // Simulate sequential tests
  for (const test of tests.value) {
    test.status = 'running'
    await new Promise((r) => setTimeout(r, 900))
    // Camera passes only if we have a stream
    if (test.id === 'camera') {
      test.status = cameraStream.value ? 'ok' : 'failed'
    } else {
      test.status = 'ok'
    }
  }

  running.value = false
  done.value = true
}

function reset() {
  tests.value.forEach((t) => (t.status = 'not-tested'))
  done.value = false
}

onUnmounted(() => {
  cameraStream.value?.getTracks().forEach((t) => t.stop())
})
</script>

<template>
  <div class="mx-auto w-full max-w-[1000px] px-4 py-6 lg:px-8 lg:py-8">
    <h1 class="mb-2 text-h1 font-semibold text-text">Precall Test</h1>
    <p class="mb-6 text-small text-text-muted">
      Run this test before your session to make sure your equipment works.
    </p>

    <div class="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">

      <!-- ── Left: Camera preview ───────────────────────── -->
      <div>
        <BaseCard :padding="false" class="overflow-hidden">
          <!-- Video -->
          <div
            class="relative flex aspect-video w-full items-center justify-center bg-neutral-900"
          >
            <video
              v-show="cameraStream"
              ref="videoRef"
              autoplay
              muted
              playsinline
              class="h-full w-full object-cover"
            />
            <!-- No signal state -->
            <div
              v-if="!cameraStream"
              class="flex flex-col items-center gap-3 text-center px-6"
            >
              <ShieldAlert :size="36" class="text-neutral-500" />
              <p class="text-small text-neutral-400">
                {{ cameraError ?? 'No signal — camera not started' }}
              </p>
              <button
                v-if="!cameraError"
                class="mt-1 text-caption font-semibold text-primary hover:underline"
                @click="startCamera"
              >
                Enable camera
              </button>
            </div>
          </div>

          <!-- Camera permission error action -->
          <div v-if="cameraError" class="px-4 py-3 bg-danger-soft">
            <p class="text-caption text-danger-text">{{ cameraError }}</p>
          </div>
        </BaseCard>

        <!-- Enable camera button -->
        <BaseButton
          v-if="!cameraStream && !cameraError"
          variant="secondary"
          block
          class="mt-3"
          @click="startCamera"
        >
          <Camera :size="16" class="mr-2" />
          Enable Camera
        </BaseButton>
      </div>

      <!-- ── Right: Tests + results ─────────────────────── -->
      <div class="space-y-3">

        <!-- Test items -->
        <BaseCard
          v-for="test in tests"
          :key="test.id"
          :padding="true"
        >
          <div class="flex items-center gap-3">
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full"
              :class="test.status === 'ok' ? 'bg-success-soft' : 'bg-neutral-100'"
            >
              <component
                :is="ICONS[test.id]"
                :size="18"
                :class="test.status === 'ok' ? 'text-success' : 'text-text-muted'"
              />
            </span>

            <div class="flex-1">
              <p class="text-body font-medium text-text">{{ test.label }}</p>
            </div>

            <!-- Status indicator -->
            <div class="shrink-0">
              <Loader
                v-if="test.status === 'running'"
                :size="18"
                class="animate-spin text-primary"
              />
              <CheckCircle
                v-else-if="test.status === 'ok'"
                :size="18"
                class="text-success"
              />
              <XCircle
                v-else-if="test.status === 'failed'"
                :size="18"
                class="text-danger"
              />
              <Circle
                v-else
                :size="18"
                class="text-neutral-300"
              />
            </div>
          </div>
        </BaseCard>

        <!-- Readiness summary -->
        <BaseCard
          v-if="done"
          :padding="true"
          :class="readyCount === 4 ? 'border border-success/30 bg-success-soft' : 'border border-warning/30 bg-warning-soft'"
        >
          <div class="flex items-center gap-3">
            <CheckCircle
              :size="22"
              :class="readyCount === 4 ? 'text-success' : 'text-warning'"
            />
            <div>
              <p class="text-body font-semibold text-text">
                Readiness {{ readyCount }}/4
              </p>
              <p class="text-caption text-text-muted">
                {{
                  readyCount === 4
                    ? 'All systems ready. You\'re good to go!'
                    : 'Some checks failed. Review issues above.'
                }}
              </p>
            </div>
          </div>
        </BaseCard>

        <!-- Actions -->
        <div class="flex gap-3">
          <BaseButton
            variant="primary"
            block
            :loading="running"
            :disabled="running"
            @click="runTests"
          >
            {{ done ? 'Run Again' : 'Start Test' }}
          </BaseButton>
          <BaseButton
            v-if="done"
            variant="secondary"
            @click="reset"
          >
            Reset
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
