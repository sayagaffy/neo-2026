<script setup lang="ts">
const props = defineProps<{
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  label: string
}>()

const colorMap: Record<typeof props.tone, string> = {
  success: 'bg-green-50 text-success',
  warning: 'bg-amber-50 text-warning',
  danger: 'bg-red-50 text-danger',
  info: 'bg-primary-soft text-primary',
  neutral: 'bg-neutral-100 text-text-muted',
}
</script>

<template>
  <span
    :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium', colorMap[tone]]"
  >
    {{ label }}
  </span>
</template>
