<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { User, Settings, LogOut, X } from 'lucide-vue-next'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useFocusTrap } from '@/composables/useOverlay'
import Avatar from '@/components/ui/Avatar.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const menuRef = ref<HTMLElement | null>(null)
const { isDesktop } = useBreakpoint()
const { trapKeydown } = useFocusTrap(menuRef)

watch(
  () => props.open,
  (val) => {
    if (val) {
      nextTick(() => menuRef.value?.focus())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

const menuItems = [
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/settings', icon: Settings },
]
</script>

<template>
  <Teleport to="body">
    <Transition :name="isDesktop ? 'dropdown' : 'sheet'">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex"
        :class="isDesktop ? 'items-start justify-end pt-16 pr-4' : 'flex-col justify-end'"
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
        @keydown.esc="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[rgba(20,27,46,0.45)]" @click="emit('close')" />

        <!-- Menu panel -->
        <div
          ref="menuRef"
          tabindex="-1"
          class="relative w-full bg-card outline-none lg:w-56 lg:rounded-2xl lg:shadow-e2"
          :class="!isDesktop && 'rounded-t-[20px]'"
          @keydown="trapKeydown"
        >
          <!-- Handle (mobile only) -->
          <div v-if="!isDesktop" class="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-neutral-200" />

          <!-- Profile header (mobile only) -->
          <div v-if="!isDesktop" class="flex items-center gap-3 border-b border-border px-5 py-4">
            <Avatar name="User" :size="44" />
            <div>
              <p class="text-body font-semibold text-text">My Account</p>
              <p class="text-caption text-text-muted">Signed in</p>
            </div>
            <button
              class="ml-auto flex size-8 items-center justify-center rounded-full text-text-muted hover:bg-neutral-100"
              aria-label="Close"
              @click="emit('close')"
            >
              <X :size="18" />
            </button>
          </div>

          <!-- Links -->
          <div class="py-2">
            <RouterLink
              v-for="item in menuItems"
              :key="item.to"
              :to="item.to"
              class="flex min-h-11 items-center gap-3 px-4 text-body text-text transition-colors hover:bg-neutral-50"
              @click="emit('close')"
            >
              <component :is="item.icon" :size="18" :stroke-width="1.8" class="text-text-muted" />
              {{ item.label }}
            </RouterLink>

            <hr class="my-1 border-border" />

            <!-- Logout -->
            <button
              class="flex min-h-11 w-full items-center gap-3 px-4 text-body text-danger transition-colors hover:bg-danger-soft"
              @click="emit('close')"
            >
              <LogOut :size="18" :stroke-width="1.8" />
              Log out
            </button>
          </div>

          <!-- Safe area (mobile) -->
          <div v-if="!isDesktop" class="h-4" />
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

.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 150ms ease; }
.dropdown-enter-active .relative,
.dropdown-leave-active .relative { transition: transform 180ms cubic-bezier(0.16,1,0.3,1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; }
.dropdown-enter-from .relative, .dropdown-leave-to .relative { transform: translateY(-6px) scale(0.97); }
</style>
