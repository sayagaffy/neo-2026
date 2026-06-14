<script setup lang="ts">
import type { Component } from 'vue'
import { Inbox } from 'lucide-vue-next'
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    title: string
    message?: string
    icon?: Component
    ctaLabel?: string
  }>(),
  { icon: Inbox },
)

defineEmits<{ cta: [] }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-12 text-center">
    <component :is="icon" :size="40" :stroke-width="1.5" class="text-neutral-300" />
    <div class="space-y-1">
      <p class="text-body font-semibold text-text">{{ title }}</p>
      <p v-if="message" class="text-small text-text-muted">{{ message }}</p>
    </div>
    <BaseButton v-if="ctaLabel" variant="secondary" @click="$emit('cta')">
      {{ ctaLabel }}
    </BaseButton>
    <slot />
  </div>
</template>
