<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useNavigation } from '@/composables/useNavigation'
import neoLogoWhite from '@/assets/neo-logo-white.svg'

const route = useRoute()
const { sidebarItems } = useNavigation()

function isActive(name: string) {
  return route.name === name
}
</script>

<template>
  <nav
    class="flex h-full w-60 flex-col bg-gradient-to-b from-indigo-700 to-indigo-600"
    aria-label="Sidebar navigation"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center px-6">
      <RouterLink to="/dashboard">
        <img :src="neoLogoWhite" alt="neo" class="h-8 w-auto" />
      </RouterLink>
    </div>

    <!-- Nav items -->
    <div class="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
      <RouterLink
        v-for="item in sidebarItems"
        :key="item.name"
        :to="item.to"
        :aria-current="isActive(item.name) ? 'page' : undefined"
        :class="[
          'flex min-h-11 items-center gap-3 rounded-xl px-4 text-small font-medium transition-colors',
          isActive(item.name)
            ? 'bg-white/15 text-white'
            : 'text-white/70 hover:bg-white/8 hover:text-white',
        ]"
      >
        <component
          :is="item.icon"
          :size="20"
          :stroke-width="isActive(item.name) ? 2 : 1.6"
          class="shrink-0"
        />
        {{ item.label }}
      </RouterLink>
    </div>
  </nav>
</template>
