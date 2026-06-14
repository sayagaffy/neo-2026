<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    modelValue?: string
    options: { label: string; value: string }[]
    label?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { placeholder: 'Select…' },
)

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-caption font-medium text-text">{{ label }}</label>
    <div class="relative">
      <select
        :value="modelValue"
        :disabled="disabled"
        :class="[
          'h-12 w-full appearance-none rounded-input border border-border bg-card px-4 pr-10 text-body text-text',
          'transition-colors focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none',
          !modelValue && 'text-text-muted',
          disabled && 'cursor-not-allowed opacity-50',
        ]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <ChevronDown
        class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted"
        :size="16"
        :stroke-width="2"
      />
    </div>
  </div>
</template>
