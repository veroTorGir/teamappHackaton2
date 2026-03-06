<template>
  <div
    class="min-h-screen transition-colors duration-500"
    :style="{ backgroundColor: secondaryColor }"
  >
    <slot />
    <DashboardBottomNav @doors="doorsOpen = true" />

    <!-- Doors modal -->
    <DashboardDoorsModal v-model="doorsOpen" />

    <UIKitToast />
  </div>
</template>

<script setup lang="ts">
const { secondaryColor } = useCompanyTheme()

const doorsOpen = ref(false)

useHead({
  bodyAttrs: {
    style: computed(() => `background-color: ${secondaryColor.value}; transition: background-color 0.5s`),
  },
})
</script>
