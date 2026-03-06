<template>
  <button 
    class="w-full max-w-sm h-16 bg-white text-black font-semibold rounded-full transition-colors duration-200 flex items-center justify-center gap-3"
    :disabled="props.isLoading"
    @click="$emit('pressed')"
  >
    <Loader v-if="props.isLoading" size="24px" color="#000000" />
    <span v-else>{{ props.text }}</span>
  </button>
</template>

<script setup lang="ts">
  import Loader from '../Loader/Loader.vue';
  const emits = defineEmits<{
    pressed: []
  }>()

  const props = defineProps<{
    text: string
    isLoading: boolean
  }>()
</script>