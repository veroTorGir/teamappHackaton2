<template>
  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/[0.08]">
    <component
      v-if="icon"
      :is="icon"
      :size="11"
      class="text-white/40 flex-shrink-0"
    />
    <span class="text-white/50 text-xs leading-none">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  icon?: Component
}>()
</script>
