<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    variant?: 'soft' | 'outline'
    tone?: 'primary' | 'neutral'
  }>(),
  { variant: 'soft', tone: 'primary' },
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-3 py-1 text-caption font-medium',
      variant === 'soft' && tone === 'primary' && 'bg-primary-soft text-primary',
      variant === 'soft' && tone === 'neutral' && 'bg-neutral-100 text-text-muted',
      variant === 'outline' && tone === 'primary' && 'border border-primary text-primary',
      variant === 'outline' && tone === 'neutral' && 'border border-border text-text-muted',
    ]"
  >
    {{ label }}
  </span>
</template>
