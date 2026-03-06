<template>
  <div class="loader" :style="loaderStyle" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: string
  color?: string
}>(), {
  size: '24px',
  color: '#000000'
})

const loaderStyle = computed(() => {
  const g = `no-repeat radial-gradient(farthest-side, ${props.color} 94%, #0000)`
  return {
    width: props.size,
    height: props.size,
    background: `${g} 0 0, ${g} 100% 0, ${g} 100% 100%, ${g} 0 100%`,
    backgroundSize: '40% 40%',
  }
})
</script>

<style scoped>
.loader {
  animation: dots-loader 0.5s infinite;
}

@keyframes dots-loader {
  100% { background-position: 100% 0, 100% 100%, 0 100%, 0 0 }
}
</style>
