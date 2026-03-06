<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 px-5 pb-10">
    <div
      class="flex items-center justify-around px-4 py-1"
      style="
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.11);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.13);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
      "
    >
      <!-- Home -->
      <button class="nav-item" :class="{ active: tab === 'home' }" @click="tab = 'home'">
        <div class="icon-wrap" :style="tab === 'home' ? { backgroundColor: indicatorBg } : {}">
          <Home :size="26" />
        </div>
      </button>

      <!-- Puertas -->
      <button class="nav-item" @click="$emit('doors')">
        <div class="icon-wrap">
          <KeyRound :size="26" />
        </div>
      </button>

      <!-- Comida -->
      <button class="nav-item" :class="{ active: tab === 'food' }" @click="tab = 'food'">
        <div class="icon-wrap" :style="tab === 'food' ? { backgroundColor: indicatorBg } : {}">
          <UtensilsCrossed :size="26" />
        </div>
      </button>

      <!-- Tienda -->
      <button class="nav-item" :class="{ active: tab === 'store' }" @click="tab = 'store'">
        <div class="icon-wrap" :style="tab === 'store' ? { backgroundColor: indicatorBg } : {}">
          <ShoppingBag :size="26" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home, KeyRound, ShoppingBag, UtensilsCrossed } from 'lucide-vue-next'

defineEmits<{ doors: [] }>()

const { primaryColor } = useCompanyTheme()
const { tab } = useDashboardTab()

const indicatorBg = computed(() => `${primaryColor.value}40`)
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  color: rgba(255, 255, 255);
  transition: opacity 150ms;
}
.nav-item:active {
  opacity: 0.6;
}
.nav-item.active {
  color: white;
}
.icon-wrap {
  width: 60px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 300ms ease;
}
</style>
