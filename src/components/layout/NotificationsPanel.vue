<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { X, CheckCheck, Bell } from 'lucide-vue-next'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useFocusTrap } from '@/composables/useOverlay'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps<{ open: boolean; unreadCount?: number }>()
const emit = defineEmits<{ close: [] }>()

const panelRef = ref<HTMLElement | null>(null)
const { isDesktop } = useBreakpoint()
const { trapKeydown } = useFocusTrap(panelRef)

watch(
  () => props.open,
  (val) => {
    if (val) {
      nextTick(() => panelRef.value?.focus())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition :name="isDesktop ? 'panel' : 'sheet'">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex"
        :class="isDesktop ? 'items-start justify-end pt-14 pr-4' : 'flex-col justify-end'"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        @keydown.esc="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[rgba(20,27,46,0.45)]" @click="emit('close')" />

        <!-- Panel -->
        <div
          ref="panelRef"
          tabindex="-1"
          class="relative flex max-h-[80vh] w-full flex-col bg-card outline-none lg:max-h-[600px] lg:w-80 lg:rounded-2xl"
          :class="!isDesktop && 'rounded-t-[20px]'"
          @keydown="trapKeydown"
        >
          <!-- Handle (mobile only) -->
          <div v-if="!isDesktop" class="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-neutral-200" />

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 class="text-title font-semibold text-text">Notifications</h2>
            <div class="flex items-center gap-2">
              <button
                v-if="(unreadCount ?? 0) > 0"
                class="flex items-center gap-1.5 text-caption font-semibold text-primary"
              >
                <CheckCheck :size="14" />
                Mark all read
              </button>
              <button
                class="flex size-8 items-center justify-center rounded-full text-text-muted hover:bg-neutral-100"
                aria-label="Close notifications"
                @click="emit('close')"
              >
                <X :size="18" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <EmptyState
              :icon="Bell"
              title="All caught up"
              message="No new notifications."
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active { transition: opacity 200ms ease; }
.sheet-enter-active .relative,
.sheet-leave-active .relative { transition: transform 280ms cubic-bezier(0.16,1,0.3,1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .relative, .sheet-leave-to .relative { transform: translateY(100%); }

.panel-enter-active,
.panel-leave-active { transition: opacity 150ms ease; }
.panel-enter-active .relative,
.panel-leave-active .relative { transition: transform 200ms cubic-bezier(0.16,1,0.3,1); }
.panel-enter-from, .panel-leave-to { opacity: 0; }
.panel-enter-from .relative, .panel-leave-to .relative { transform: translateY(-8px) scale(0.97); }
</style>
