<template>
  <div
    class="rounded-2xl p-6 mb-4 relative overflow-hidden"
    :style="{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }"
  >
    <!-- Decorative circles -->
    <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
    <div class="absolute -right-2 top-14 w-24 h-24 rounded-full bg-white/[0.06] pointer-events-none" />

    <!-- Content -->
    <div class="relative z-10">
      <p
        class="text-xs font-medium uppercase tracking-widest mb-3"
        :class="isLightPrimary ? 'text-black/50' : 'text-white/60'"
      >Saldo total</p>

      <div class="flex flex-row gap-2">
        <p class="text-white text-4xl font-semibold tracking-tight leading-none">
            {{ formattedBalance }}
        </p>
        <p class="text-white/40 mt-[13px]">COP</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Collaborator } from '~/types/collaborator'
import type { Balance } from '~/composables/useBalanceApi'

const props = defineProps<{
  collaborator: Collaborator
  balance: Balance
}>()

const primaryColor = computed(() => props.collaborator.company[0]?.primary_color ?? '#753BBD')
const secondaryColor = computed(() => props.collaborator.company[0]?.secondary_color ?? '#2C2039')

const isLightPrimary = computed(() => isLightColor(primaryColor.value))

const formattedBalance = computed(() =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
  }).format(props.balance.value / 100)
)
</script>
