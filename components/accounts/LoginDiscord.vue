<template>
  <button
    class="w-full max-w-sm h-16 bg-transparent border-2 border-white text-white font-semibold rounded-full transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
    :disabled="loading"
    @click="handleDiscordLogin"
  >
    <UIKitLoader v-if="loading" size="sm" />
    <Discord v-else />
    Continuar con Discord
  </button>
</template>

<script setup lang="ts">
import Discord from '@/components/icons/Discord.vue';

const config = useRuntimeConfig()
const { error: showError } = useToast()
const loading = ref(false)

const handleDiscordLogin = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ url: string }>('/api/accounts/discord/make_url/', {
      method: 'POST',
      baseURL: config.public.baseURL,
      body: { state: 'colaborator' },
    })
    window.location.href = response.url
  } catch {
    showError('No se pudo conectar con Discord. Intenta nuevamente.')
    loading.value = false
  }
}
</script>
