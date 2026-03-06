<template>
  <div class="px-5 pb-32 pt-7">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <UIKitLoader size="32px" :color="primaryColor" />
    </div>

    <template v-else>
      <!-- Meal cards -->
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="meal in meals"
          :key="meal.period"
          class="flex flex-col items-center rounded-2xl p-3 border transition-all duration-200"
          :class="[
            meal.confirmed || meal.active
              ? meal.isVegan
                ? 'bg-teal-500/10 border-teal-400/20 active:scale-95'
                : 'bg-green-500/10 border-green-500/20 active:scale-95'
              : 'bg-white/[0.05] border-white/[0.08] active:scale-95',
            requesting ? 'opacity-60 pointer-events-none' : '',
          ]"
          :disabled="requesting || meal.confirmed"
          @click="handleMealClick(meal)"
        >
          <!-- Icon ring -->
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center mt-1 mb-2"
            :class="meal.active
              ? meal.isVegan
                ? 'bg-teal-400/15 border border-teal-400/25'
                : 'bg-green-500/15 border border-green-500/25'
              : 'bg-white/[0.06] border border-white/10'"
          >
            <UIKitLoader
              v-if="requesting && requestingPeriod === meal.period"
              size="20px"
              :color="meal.active ? (meal.isVegan ? '#2dd4bf' : '#4ade80') : '#ffffff40'"
            />
            <component
              v-else
              :is="meal.icon"
              :size="22"
              :class="meal.active ? (meal.isVegan ? 'text-teal-400' : 'text-green-400') : 'text-white/25'"
            />
          </div>

          <!-- Period name -->
          <p
            class="text-[11px] font-semibold uppercase tracking-wide"
            :class="meal.active ? (meal.isVegan ? 'text-teal-400/80' : 'text-green-400/80') : 'text-white/30'"
          >{{ meal.label }}</p>

          <!-- Status -->
          <p
            class="text-[10px] tracking-wider"
            :class="meal.active ? (meal.isVegan ? 'text-teal-400' : 'text-green-400') : 'text-white/20'"
          >
            {{ meal.confirmed ? 'Confirmado' : meal.active ? (meal.isVegan ? 'Vegetariano' : 'Activo') : 'Inactivo' }}
          </p>
        </button>
      </div>
    </template>
  </div>

  <!-- Carnet FAB -->
  <button
    class="fixed bottom-[120px] right-5 z-40 flex items-center gap-2.5 px-5 py-5 rounded-full active:scale-95 transition-transform"
    :style="{ backgroundColor: primaryColor }"
    @click="carnetOpen = true"
  >
    <IdCardLanyard :size="26" :class="isLightPrimary ? 'text-gray-900' : 'text-white'" />
  </button>

  <!-- Meal type picker (inactive → order) -->
  <UIKitModalBottomSheet v-model="mealPickerOpen">
    <p class="text-white/50 text-sm text-center mb-1 uppercase tracking-widest">{{ selectedMeal?.label }}</p>
    <p class="text-white font-semibold text-lg text-center mb-7">¿Cómo lo quieres?</p>

    <div class="flex flex-col gap-3">
      <button
        class="w-full py-3.5 rounded-2xl font-semibold text-sm transition-opacity active:opacity-70 flex items-center justify-center gap-2"
        :class="isLightPrimary ? 'text-gray-900' : 'text-white'"
        :style="{ backgroundColor: primaryColor }"
        @click="confirmMeal(false)"
      >
        <component :is="selectedMeal?.icon" :size="18" />
        Con carne
      </button>
      <button
        class="w-full py-3.5 rounded-2xl font-semibold text-sm text-green-400 bg-green-500/10 border border-green-500/20 transition-opacity active:opacity-70 flex items-center justify-center gap-2"
        @click="confirmMeal(true)"
      >
        <Leaf :size="18" />
        Vegetariano
      </button>
    </div>
  </UIKitModalBottomSheet>

  <!-- Cancel confirm (active → cancel) -->
  <UIKitModalBottomSheet v-model="cancelPickerOpen">
    <component :is="selectedMeal?.icon" :size="28" class="mx-auto mb-4 text-white/40" />
    <p class="text-white/50 text-sm text-center mb-1 uppercase tracking-widest">{{ selectedMeal?.label }}</p>
    <p class="text-white font-semibold text-lg text-center mb-2">¿Cancelar pedido?</p>
    <p class="text-white/40 text-sm text-center mb-8">Se eliminará tu solicitud de {{ selectedMeal?.label.toLowerCase() }}</p>

    <div class="flex flex-col gap-3">
      <button
        class="w-full py-3.5 rounded-2xl font-semibold text-sm text-red-400 bg-red-500/10 border border-red-500/20 transition-opacity active:opacity-70"
        @click="cancelMeal"
      >
        Sí, cancelar
      </button>
      <button
        class="w-full py-3.5 rounded-2xl font-semibold text-sm text-white/60 bg-white/[0.06] transition-opacity active:opacity-70"
        @click="cancelPickerOpen = false"
      >
        Mantener pedido
      </button>
    </div>
  </UIKitModalBottomSheet>

  <!-- Carnet modal -->
  <DashboardCarnetModal v-model="carnetOpen" :food="food" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Coffee, Utensils, UtensilsCrossed, Leaf, IdCardLanyard } from 'lucide-vue-next'

type MealPeriod = 'breakfast' | 'lunch' | 'dinner'
type MealItem = { period: MealPeriod; label: string; icon: unknown; active: boolean; confirmed: boolean; isVegan: boolean; isCurrent: boolean }

const ws = useFoodWebSocket()
const { primaryColor, isLightPrimary } = useCompanyTheme()

const { food, loading, requesting, requestingPeriod } = ws
const carnetOpen = ref(false)
const mealPickerOpen = ref(false)
const cancelPickerOpen = ref(false)
const selectedMeal = ref<MealItem | null>(null)

const currentPeriod = computed<MealPeriod | null>(() => {
  const h = new Date().getHours()
  if (h >= 6  && h < 11) return 'breakfast'
  if (h >= 11 && h < 16) return 'lunch'
  if (h >= 16 && h < 21) return 'dinner'
  return null
})

type MealDef = { period: MealPeriod; label: string; icon: unknown }

const MEALS: MealDef[] = [
  { period: 'breakfast', label: 'Desayuno', icon: Coffee },
  { period: 'lunch',     label: 'Almuerzo', icon: Utensils },
  { period: 'dinner',    label: 'Cena',     icon: UtensilsCrossed },
]

const meals = computed(() =>
  MEALS.map(({ period, label, icon }) => {
    const f = food.value
    const isVegan   = f ? (f[`${period}_vegan` as keyof typeof f] as boolean) : false
    const isOrdered = f ? (f[period as keyof typeof f] as boolean) : false
    const confirmed = f ? (f[`${period}_confirmed` as keyof typeof f] as boolean) : false
    const active    = isOrdered || isVegan
    return {
      period,
      label,
      icon: active && isVegan ? Leaf : icon,
      active,
      confirmed,
      isVegan,
      isCurrent: currentPeriod.value === period,
    } as MealItem
  })
)

const handleMealClick = (meal: MealItem) => {
  if (meal.confirmed || requesting.value) return
  selectedMeal.value = meal
  if (meal.active) {
    cancelPickerOpen.value = true
  } else {
    mealPickerOpen.value = true
  }
}

const confirmMeal = (vegan: boolean) => {
  if (!selectedMeal.value) return
  mealPickerOpen.value = false
  ws.toggle(selectedMeal.value.period, vegan)
}

const cancelMeal = () => {
  if (!selectedMeal.value) return
  cancelPickerOpen.value = false
  ws.toggle(selectedMeal.value.period, selectedMeal.value.isVegan)
}

onMounted(() => ws.connect())
onUnmounted(() => ws.disconnect())
</script>
