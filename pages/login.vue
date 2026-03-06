<template>
  <Login />
</template>

<script setup lang="ts">
  import Login from '@/components/accounts/Login.vue';

  definePageMeta({ auth: false })
</script>