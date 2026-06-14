<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg">
    <p class="text-h2 font-semibold text-text">404</p>
    <p class="text-body text-text-muted">Page not found.</p>
    <RouterLink to="/" class="text-small font-medium text-primary underline">Go home</RouterLink>
  </div>
</template>
