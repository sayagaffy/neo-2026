<script setup lang="ts">
withDefaults(
  defineProps<{
    variant: 'text' | 'card' | 'metric' | 'avatar' | 'line'
    lines?: number
    width?: string
    height?: string
  }>(),
  { lines: 3 },
)
</script>

<template>
  <div aria-busy="true" aria-label="Loading…">
    <!-- avatar -->
    <div
      v-if="variant === 'avatar'"
      class="shimmer rounded-full"
      :style="{ width: height ?? '40px', height: height ?? '40px' }"
    />
    <!-- card -->
    <div
      v-else-if="variant === 'card'"
      class="shimmer rounded-card"
      :style="{ height: height ?? '128px' }"
    />
    <!-- metric -->
    <div
      v-else-if="variant === 'metric'"
      class="shimmer rounded-card"
      :style="{ height: height ?? '80px' }"
    />
    <!-- text block -->
    <div v-else-if="variant === 'text'" class="space-y-2">
      <div
        v-for="i in lines"
        :key="i"
        class="shimmer h-4 rounded"
        :style="{ width: i === lines ? '60%' : width ?? '100%' }"
      />
    </div>
    <!-- single line -->
    <div
      v-else
      class="shimmer h-4 rounded"
      :style="width ? { width } : {}"
    />
  </div>
</template>

<style scoped>
.shimmer {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 25%,
    var(--color-neutral-50) 50%,
    var(--color-neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep 1.5s infinite linear;
}

@keyframes shimmer-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
