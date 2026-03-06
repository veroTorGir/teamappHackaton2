<template>
  <div 
    class="w-[62px] h-[62px] rounded-[20%] border-2 rotate-45 flex items-center justify-center overflow-hidden bg-transparent"
    :style="{ borderColor: color }"
  >
    <img 
      :src="imagePath" 
      alt="Enterprise icon"
      class="object-contain -rotate-45"
      :style="[{width: width}, {height: height}]"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  imagePath: string
  color: string
  height?: string
  width?: string
}>()
</script>