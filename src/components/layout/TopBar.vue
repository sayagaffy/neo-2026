<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, BellDot } from 'lucide-vue-next'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useNavigation } from '@/composables/useNavigation'
import Avatar from '@/components/ui/Avatar.vue'
import neoLogoWhite from '@/assets/neo-logo-white.svg'

const props = withDefaults(
  defineProps<{ unreadCount?: number }>(),
  { unreadCount: 0 },
)
const emit = defineEmits<{ openNotif: []; openAccount: [] }>()

const route = useRoute()
const { isDesktop } = useBreakpoint()
const { allItems } = useNavigation()

const pageTitle = computed(() => {
  const item = allItems.find((n) => n.name === route.name)
  return item?.label ?? String(route.name ?? '')
})
</script>

<template>
  <header
    :class="[
      'flex h-14 items-center justify-between px-4',
      isDesktop
        ? 'border-b border-border bg-card px-6'
        : 'bg-gradient-to-b from-indigo-700 to-indigo-600',
    ]"
  >
    <!-- Left: logo (mobile) or page title (desktop) -->
    <div>
      <img v-if="!isDesktop" :src="neoLogoWhite" alt="neo" class="h-7 w-auto" />
      <h1 v-else class="text-title font-bold text-text">{{ pageTitle }}</h1>
    </div>

    <!-- Right: bell + avatar -->
    <div class="flex items-center gap-3">
      <!-- Notifications bell -->
      <button
        class="relative flex size-10 items-center justify-center rounded-full transition-colors"
        :class="isDesktop ? 'text-text-muted hover:bg-neutral-100' : 'text-white hover:bg-white/10'"
        aria-label="Notifications"
        @click="emit('openNotif')"
      >
        <BellDot v-if="unreadCount > 0" :size="22" :stroke-width="1.8" />
        <Bell v-else :size="22" :stroke-width="1.8" />
        <span
          v-if="unreadCount > 0"
          class="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <!-- Account avatar -->
      <button
        class="rounded-full ring-2 transition-opacity hover:opacity-90"
        :class="isDesktop ? 'ring-border' : 'ring-white/30'"
        aria-label="Account menu"
        @click="emit('openAccount')"
      >
        <Avatar name="User" :size="36" />
      </button>
    </div>
  </header>
</template>
