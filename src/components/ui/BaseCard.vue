<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
    padding?: boolean
    interactive?: boolean
  }>(),
  { as: 'div', padding: true, interactive: false },
)

const emit = defineEmits<{ click: [event: MouseEvent | KeyboardEvent] }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('click', e)
  }
}
</script>

<template>
  <component
    :is="as"
    :class="[
      'rounded-card bg-card shadow-e1',
      padding && 'p-4',
      interactive && 'cursor-pointer transition-shadow hover:shadow-e2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    ]"
    v-bind="interactive && as !== 'button' ? { role: 'button', tabindex: 0 } : {}"
    @keydown="interactive && as !== 'button' ? onKey($event) : undefined"
  >
    <slot />
  </component>
</template>
