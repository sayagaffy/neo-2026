<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    value: number | null
    max?: number
    readonly?: boolean
  }>(),
  { max: 5, readonly: true },
)

const filled = computed(() => (props.value !== null ? Math.round(props.value) : 0))
</script>

<template>
  <div v-if="value !== null" class="flex items-center gap-0.5" :aria-label="`${value} out of ${max} stars`">
    <Star
      v-for="i in max"
      :key="i"
      :size="16"
      :stroke-width="1.5"
      :class="i <= filled ? 'fill-rating text-rating' : 'fill-neutral-200 text-neutral-200'"
    />
  </div>
</template>
