<template>
  <nav
    class="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pb-4 pt-3 rounded-b-3xl"
    :style="{ backgroundColor: primaryColor }"
  >
    <!-- Company logo -->
    <img
      :src="company.logo"
      :alt="company.name"
      class="h-10 w-auto object-contain"
    />

    <!-- Version + Logout -->
    <div class="flex items-center gap-2">
      <span
        class="text-[10px]"
        :class="isLightPrimary ? 'text-black/30' : 'text-white/30'"
      >v{{ version }}</span>
      <button
        class="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
        :class="isLightPrimary ? 'bg-black/10 active:bg-black/20' : 'bg-white/10 active:bg-white/30'"
        @click="showConfirm = true"
      >
        <LogOut :size="16" :class="isLightPrimary ? 'text-gray-900' : 'text-white'" />
      </button>
    </div>
  </nav>

  <!-- Confirm dialog -->
  <UIKitModalBottomSheet v-model="showConfirm">
    <LogOut :size="28" class="mx-auto mb-4 text-white/40" />
    <h3 class="text-white font-semibold text-lg text-center mb-1">¿Cerrar sesión?</h3>
    <p class="text-white/40 text-sm text-center mb-8">Tendrás que volver a iniciar sesión para acceder</p>

    <div class="flex flex-col gap-3">
      <button
        class="w-full py-3.5 rounded-2xl font-semibold text-sm transition-opacity active:opacity-70"
        :class="isLightPrimary ? 'text-gray-900' : 'text-white'"
        :style="{ backgroundColor: primaryColor }"
        :disabled="loading"
        @click="handleLogout"
      >
        <div v-if="loading" class="flex items-center justify-center">
          <UIKitLoader size="20px" :color="isLightPrimary ? '#1A1A1A' : 'white'" />
        </div>
        <span v-else>Sí, cerrar sesión</span>
      </button>
      <button
        class="w-full py-3.5 rounded-2xl font-semibold text-sm text-white/60 bg-white/[0.06] transition-opacity active:opacity-70"
        @click="showConfirm = false"
      >
        Cancelar
      </button>
    </div>
  </UIKitModalBottomSheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { LogOut } from 'lucide-vue-next'
import type { Collaborator } from '@/types/collaborator'

const props = defineProps<{
  collaborator: Collaborator
}>()

const showConfirm = ref(false)
const loading     = ref(false)
const { public: { version } } = useRuntimeConfig()

async function handleLogout() {
  loading.value = true
  const accessToken = useCookie('token.access')
  const refreshToken = useCookie('token.refresh')
  accessToken.value = null
  refreshToken.value = null
  await navigateTo('/login', { replace: true })
}

const company      = computed(() => props.collaborator.company[0])
const primaryColor = computed(() => company.value?.primary_color ?? '#753BBD')

const isLightPrimary = computed(() => isLightColor(primaryColor.value))
</script>
