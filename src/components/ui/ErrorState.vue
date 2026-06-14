<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    message?: string
    retrying?: boolean
  }>(),
  { message: 'Something went wrong. Please try again.' },
)

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-12 text-center">
    <AlertCircle :size="40" :stroke-width="1.5" class="text-danger" />
    <p class="text-body text-text-muted">{{ message }}</p>
    <BaseButton variant="secondary" :loading="retrying" @click="$emit('retry')">
      Try again
    </BaseButton>
  </div>
</template>
