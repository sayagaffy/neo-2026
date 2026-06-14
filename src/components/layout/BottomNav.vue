<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useNavigation, MORE_ITEM } from '@/composables/useNavigation'

const emit = defineEmits<{ openMore: [] }>()

const route = useRoute()
const { bottomNavItems } = useNavigation()

// Insert MORE_ITEM at the end; Book ('center') stays in natural position
const items = [...bottomNavItems, MORE_ITEM]

function isActive(name: string) {
  return route.name === name
}
</script>

<template>
  <nav
    class="flex h-16 items-stretch bg-card"
    style="box-shadow: 0 -2px 14px rgba(31,42,68,.06)"
    aria-label="Main navigation"
  >
    <template v-for="item in items" :key="item.name">
      <!-- Center "Book" button -->
      <div v-if="item.placement.bottomNav === 'center'" class="flex flex-1 items-center justify-center">
        <RouterLink
          :to="item.to"
          class="flex -translate-y-3 flex-col items-center gap-0.5"
          :aria-label="item.label"
          :aria-current="isActive(item.name) ? 'page' : undefined"
        >
          <span
            class="flex size-14 items-center justify-center rounded-full bg-primary text-white"
            style="box-shadow: 0 6px 16px rgba(11,170,244,.28)"
          >
            <component :is="item.icon" :size="24" :stroke-width="2" />
          </span>
          <span
            class="text-[10px] font-semibold"
            :class="isActive(item.name) ? 'text-primary' : 'text-text-muted'"
          >
            Book
          </span>
        </RouterLink>
      </div>

      <!-- "More" trigger (not a route) -->
      <button
        v-else-if="item.name === 'more'"
        class="flex flex-1 flex-col items-center justify-center gap-1 text-text-muted transition-colors hover:text-text"
        :aria-label="item.label"
        @click="emit('openMore')"
      >
        <component :is="item.icon" :size="20" :stroke-width="1.8" />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </button>

      <!-- Regular nav item -->
      <RouterLink
        v-else
        :to="item.to"
        class="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
        :class="isActive(item.name) ? 'text-primary' : 'text-text-muted hover:text-text'"
        :aria-current="isActive(item.name) ? 'page' : undefined"
        :aria-label="item.label"
      >
        <component :is="item.icon" :size="20" :stroke-width="isActive(item.name) ? 2 : 1.8" />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </RouterLink>
    </template>
  </nav>
</template>
