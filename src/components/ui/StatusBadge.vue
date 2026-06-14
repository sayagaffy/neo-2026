<script setup lang="ts">
const props = defineProps<{
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  label: string
}>()

const colorMap: Record<typeof props.tone, string> = {
  success: 'bg-success-soft text-success-text',
  warning: 'bg-warning-soft text-warning-text',
  danger:  'bg-danger-soft text-danger-text',
  info:    'bg-info-soft text-info-text',
  neutral: 'bg-neutral-100 text-text-muted',
}
</script>

<template>
  <span
    :class="['inline-flex items-center rounded-pill px-2.5 py-0.5 text-label font-semibold', colorMap[tone]]"
  >
    {{ label }}
  </span>
</template>
