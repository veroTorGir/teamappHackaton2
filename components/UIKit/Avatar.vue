<template>
  <div class="w-full h-full rounded-full overflow-hidden">
    <img
      v-if="validSrc"
      :src="src!"
      :alt="name"
      class="w-full h-full object-cover"
      @error="imgFailed = true"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center font-semibold select-none"
      :style="{
        backgroundColor: `${primaryColor}28`,
        color: primaryColor,
        fontSize: `${size * 0.35}px`,
      }"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  src?: string | null
  name: string
  size: number
}>()

const { primaryColor } = useCompanyTheme()
const imgFailed = ref(false)

const validSrc = computed(() => !imgFailed.value && !!props.src)

const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
)
</script>
