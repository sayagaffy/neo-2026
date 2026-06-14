<script setup lang="ts">
import { ref, computed } from 'vue'
import { getInitials, getAvatarColor } from '@/utils/avatar'

const props = withDefaults(
  defineProps<{
    src?: string | null
    name: string
    size?: number
  }>(),
  { size: 40 },
)

const hasError = ref(false)
const showImage = computed(() => !!props.src && !hasError.value)
const initials = computed(() => getInitials(props.name))
const bgColor = computed(() => getAvatarColor(props.name))
</script>

<template>
  <div
    :style="{ width: size + 'px', height: size + 'px' }"
    class="shrink-0 overflow-hidden rounded-full"
    :aria-label="name"
    role="img"
  >
    <img
      v-if="showImage"
      :src="src!"
      :alt="name"
      class="size-full object-cover"
      @error="hasError = true"
    />
    <div
      v-else
      class="flex size-full items-center justify-center font-semibold text-white"
      :style="{ backgroundColor: bgColor, fontSize: size * 0.38 + 'px' }"
      aria-hidden="true"
    >
      {{ initials }}
    </div>
  </div>
</template>
