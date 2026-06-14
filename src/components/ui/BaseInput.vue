<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    type?: string
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
  }>(),
  { type: 'text' },
)

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-caption font-medium text-text">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'h-12 w-full rounded-input border bg-card px-4 text-body text-text transition-colors',
        'placeholder:text-text-muted',
        'focus:outline-none focus:ring-4',
        error
          ? 'border-danger focus:border-danger focus:ring-danger/20'
          : 'border-border focus:border-primary focus:ring-primary/20',
        disabled && 'cursor-not-allowed opacity-50',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="text-caption text-danger">{{ error }}</span>
    <span v-else-if="hint" class="text-caption text-text-muted">{{ hint }}</span>
  </div>
</template>
