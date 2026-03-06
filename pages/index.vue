<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({ auth: false })

const token = useCookie('token.access')
await navigateTo(token.value ? '/dashboard' : '/login', { replace: true })
</script>
