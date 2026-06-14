<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'rounded-button',
      size === 'lg' ? 'h-12 px-6 text-body' : 'h-11 px-4 text-small',
      block && 'w-full',
      variant === 'primary' && 'bg-primary text-white hover:brightness-110 disabled:opacity-50',
      variant === 'secondary' &&
        'border border-border bg-card text-text hover:bg-neutral-50 disabled:opacity-50',
      variant === 'danger' && 'bg-danger text-white hover:brightness-110 disabled:opacity-50',
      variant === 'ghost' && 'text-primary hover:bg-primary-soft disabled:opacity-50',
      (disabled || loading) && 'cursor-not-allowed',
    ]"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
