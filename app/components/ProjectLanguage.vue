<script setup lang="ts">
import type { Language } from '~~/github'

defineProps<{ language: Language }>()
</script>

<template>
  <div
    class="rounded-sm px-2 py-1"
    :style="{ backgroundColor: language.color || '#ff1493' }"
  >
    <p class="text-sm font-medium text-black/70 dark:text-white/80">
      {{ language.name }}
    </p>
  </div>
</template>
