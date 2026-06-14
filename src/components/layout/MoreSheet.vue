<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { X } from 'lucide-vue-next'
import { useFocusTrap } from '@/composables/useOverlay'
import { useNavigation } from '@/composables/useNavigation'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const sheetRef = ref<HTMLElement | null>(null)
const { trapKeydown } = useFocusTrap(sheetRef)
const { moreSheetItems } = useNavigation()

watch(
  () => props.open,
  (val) => {
    if (val) {
      nextTick(() => sheetRef.value?.focus())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="More options"
        @keydown.esc="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[rgba(20,27,46,0.45)]" @click="emit('close')" />

        <!-- Sheet panel -->
        <div
          ref="sheetRef"
          tabindex="-1"
          class="relative rounded-t-[20px] bg-card outline-none"
          @keydown="trapKeydown"
        >
          <!-- Handle -->
          <div class="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-neutral-200" />

          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3">
            <span class="text-body font-semibold text-text">More</span>
            <button
              class="flex size-8 items-center justify-center rounded-full text-text-muted hover:bg-neutral-100"
              aria-label="Close"
              @click="emit('close')"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Nav items -->
          <div class="divide-y divide-border">
            <RouterLink
              v-for="item in moreSheetItems"
              :key="item.name"
              :to="item.to"
              class="flex min-h-[56px] items-center gap-4 px-6 text-body text-text transition-colors hover:bg-neutral-50 active:bg-neutral-100"
              @click="emit('close')"
            >
              <component
                :is="item.icon"
                :size="22"
                :stroke-width="1.6"
                class="shrink-0 text-text-muted"
              />
              <span>{{ item.label }}</span>
            </RouterLink>
          </div>

          <!-- Safe area bottom -->
          <div class="h-6" />
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
</style>
