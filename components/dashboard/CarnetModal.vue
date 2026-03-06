<template>
  <UIKitModalBottomSheet v-model="model">
    <div v-if="collaborator" class="flex flex-col gap-4">

      <!-- ── ID Card ──────────────────────────────────────── -->
      <div
        class="relative rounded-3xl overflow-hidden"
        :style="{ background: `linear-gradient(145deg, ${primaryColor} 0%, ${cardSecondary} 100%)` }"
      >
        <!-- Gloss shine -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/[0.13] via-transparent to-transparent pointer-events-none" />

        <!-- Decorative blobs -->
        <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div class="absolute right-4 top-20 w-28 h-28 rounded-full bg-white/[0.06] pointer-events-none" />
        <div class="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-black/20 pointer-events-none" />

        <!-- Card content -->
        <div class="relative z-10 p-6">

          <!-- Top row: label + logo -->
          <div class="flex items-start justify-between mb-3">
            <span
              class="text-[10px] font-medium uppercase tracking-[0.2em]"
              :class="isLightPrimary ? 'text-black/50' : 'text-white/40'"
            >TeamApp ID</span>
            <img
              v-if="companyLogo"
              :src="companyLogo"
              :alt="companyName"
              class="h-7 w-auto object-contain"
            />
          </div>

          <!-- Photo -->
          <div class="flex justify-center mb-5">
            <div
              class="w-40 h-40 rounded-full bg-white p-0.5 flex-shrink-0"
              style="box-shadow: 0 0 0 3px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.4)"
            >
              <UIKitAvatar
                :src="collaborator.profile_picture"
                :name="fullName"
                :size="156"
              />
            </div>
          </div>

          <!-- Name & position -->
          <div class="text-center mb-6">
            <h2 class="text-white font-semibold text-xl leading-tight">{{ fullName }}</h2>
            <p class="text-white/60 text-sm mt-1">{{ positionName }}</p>
          </div>

          <!-- Divider -->
          <div class="h-px bg-white/15 mb-4" />

          <!-- Clock -->
          <div class="flex items-center justify-center gap-3">
            <img src="/peepo_ramen.gif" alt="" class="w-12 h-12 object-contain mb-4" />
            <p class="card-clock" :class="isLightPrimary ? 'text-black/80' : 'text-white'">
              <span
                v-for="(char, i) in currentTime.split('')"
                :key="i"
                class="card-clock-char"
                :class="char === ':' ? 'card-clock-sep' : ''"
              >{{ char }}</span>
            </p>
            <img src="/peepo_pizza.gif" alt="" class="w-12 h-12 object-contain mb-4 transform scale-x-[-1]" />
          </div>

          <!-- Footer info -->
          <div class="flex items-end justify-between">
            <div>
              <p class="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Empresa</p>
              <p class="text-white text-sm font-medium">{{ companyName }}</p>
            </div>
            <div class="text-right">
              <p class="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Ciudad</p>
              <p class="text-white text-sm font-medium">{{ city }}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Meal Pass ──────────────────────────────────────── -->
      <div>
        <!-- Loading -->
        <div v-if="loadingFood" class="flex justify-center py-10">
          <UIKitLoader :color="primaryColor" />
        </div>

        <!-- Outside meal hours -->
        <div v-else-if="!meal.period" class="meal-pass meal-pass--off">
          <Moon :size="38" class="text-white/20 mb-3" />
          <p class="pass-label pass-label--off">Fuera de horario</p>
          <p class="pass-sub">Sin servicio de comida en este momento</p>
        </div>

        <!-- Active meal -->
        <div v-else-if="meal.active" class="meal-pass meal-pass--on" :class="{ 'meal-pass--vegan': meal.isVegan }">
          <!-- Radial glow from top -->
          <div class="pass-glow" />

          <div class="relative z-10 flex flex-row items-center w-full gap-5">
            <!-- Left: icon ring with pulse -->
            <div class="flex-shrink-0">
              <div class="pass-icon-ring">
                <component :is="meal.icon" :size="34" :style="{ color: meal.isVegan ? '#2dd4bf' : '#4ade80' }" />
              </div>
            </div>

            <!-- Right: text -->
            <div>
              <p class="pass-period-label">{{ meal.periodLabel }}</p>
              <p class="pass-status pass-status--on">ACTIVO</p>
              <div class="flex gap-2 mt-2">
                <span v-if="meal.isVegan" class="pass-badge pass-badge--vegan">Vegetariano</span>
              </div>
            </div>
          </div>
        </div>

        <!-- No meal this period -->
        <div v-else class="meal-pass meal-pass--off">
          <div class="relative z-10 flex flex-row items-center w-full gap-5">
            <div class="pass-icon-ring pass-icon-ring--off flex-shrink-0">
              <component :is="meal.icon" :size="34" class="text-white/20" />
            </div>
            <div>
              <p class="pass-period-label pass-period-label--off">{{ meal.periodLabel }}</p>
              <p class="pass-status pass-status--off">INACTIVO</p>
              <p class="pass-sub mt-1">Aún no has pedido</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </UIKitModalBottomSheet>
</template>

<script setup lang="ts">
import { Coffee, Utensils, UtensilsCrossed, Leaf, Moon } from 'lucide-vue-next'
import type { FoodSchedule } from '~/types/food'

const props = defineProps<{
  food?: FoodSchedule | null
}>()

const model = defineModel<boolean>({ required: true })

const { collaborator } = useCollaboratorState()
const { primaryColor, isLightPrimary } = useCompanyTheme()
const foodApi = useFoodApi()

const food = ref<FoodSchedule | null>(props.food ?? null)
const loadingFood = ref(false)

watch(() => props.food, (val) => {
  if (val != null) food.value = val
})

// ── Collaborator info ────────────────────────────────────────────────────────

const config = useRuntimeConfig()
const resolveUrl = (path: string) => path.startsWith('http') ? path : `${config.public.baseURL}${path}`

const fullName     = computed(() => collaborator.value ? `${collaborator.value.user.first_name} ${collaborator.value.user.last_name}` : '')
const positionName = computed(() => collaborator.value?.position[0]?.name ?? '')
const companyName  = computed(() => collaborator.value?.company[0]?.name ?? '')
const city         = computed(() => collaborator.value?.place?.name ?? 'Desconocida')
const cardSecondary = computed(() => collaborator.value?.company[0]?.secondary_color ?? '#1a1a2e')
const companyLogo  = computed(() => {
  const logo = collaborator.value?.company[0]?.logo
  return logo ? resolveUrl(logo) : null
})

// ── Meal logic ───────────────────────────────────────────────────────────────

type Period = 'breakfast' | 'lunch' | 'dinner' | null

const period = computed<Period>(() => {
  const h = new Date().getHours()
  if (h >= 6  && h < 11) return 'breakfast'
  if (h >= 11 && h < 16) return 'lunch'
  if (h >= 16 && h < 21) return 'dinner'
  return 'lunch'
})

const meal = computed(() => {
  const p = period.value
  const f = food.value
  const labels: Record<string, string> = { breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena' }
  const icons = { breakfast: Coffee, lunch: Utensils, dinner: UtensilsCrossed }

  if (!p) return { period: null, active: false, confirmed: false, isVegan: false, periodLabel: '', icon: Moon }
  if (!f) return { period: p, active: false, confirmed: false, isVegan: false, periodLabel: labels[p], icon: icons[p] }

  const isVegan     = f[`${p}_vegan`     as keyof FoodSchedule] as boolean
  const isOrdered   = f[p               as keyof FoodSchedule] as boolean
  const isConfirmed = f[`${p}_confirmed` as keyof FoodSchedule] as boolean

  if (!isOrdered && !isVegan) {
    return { period: p, active: false, confirmed: false, isVegan: false, periodLabel: labels[p], icon: icons[p] }
  }
  return { period: p, active: true, confirmed: isConfirmed, isVegan, periodLabel: labels[p], icon: isVegan ? Leaf : icons[p] }
})

// ── Fetch on open ────────────────────────────────────────────────────────────

// ── Clock ─────────────────────────────────────────────────────────────────────

const currentTime = ref('')
let clockInterval: ReturnType<typeof setInterval> | null = null

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

watch(model, async (open) => {
  if (open && !food.value && props.food === undefined) {
    loadingFood.value = true
    try {
      food.value = await foodApi.getMe(collaborator.value!.id)
    } finally {
      loadingFood.value = false
    }
  }
})
</script>

<style scoped>
/* ── Meal pass container ─────────────────────────────────── */
.meal-pass {
  border-radius: 20px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  position: relative;
  overflow: hidden;
}
.meal-pass--on {
  --pc:  74, 222, 128;   /* color principal rgb */
  --pcd: 22, 163, 74;    /* color dim rgb */
  --ps:  #4ade80;        /* color sólido */
  background: rgba(var(--pcd), 0.12);
  border: 1px solid rgba(var(--pc), 0.35);
  animation: pass-glow-pulse 2s ease-in-out infinite;
}
.meal-pass--vegan {
  --pc:  45, 212, 191;
  --pcd: 13, 148, 136;
  --ps:  #2dd4bf;
}

@keyframes pass-glow-pulse {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(var(--pc), 0.2),
      0 0 20px rgba(var(--pc), 0.12),
      0 0 60px rgba(var(--pc), 0.04);
    background: rgba(var(--pcd), 0.10);
  }
  50% {
    box-shadow:
      0 0 0 2px rgba(var(--pc), 0.6),
      0 0 40px rgba(var(--pc), 0.35),
      0 0 80px rgba(var(--pc), 0.15);
    background: rgba(var(--pcd), 0.20);
  }
}
.meal-pass--off {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

/* Luz que recorre el borde */
@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.meal-pass--on::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  background: conic-gradient(
    from var(--border-angle),
    transparent 0%,
    transparent 78%,
    rgba(var(--pc), 0.2) 85%,
    rgba(var(--pc), 0.85) 93%,
    rgba(255, 255, 255, 0.9) 96%,
    rgba(var(--pc), 0.85) 99%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  animation: border-angle-spin 3s linear infinite;
  z-index: 2;
}

@keyframes border-angle-spin {
  to { --border-angle: 360deg; }
}

/* Glow radial superior */
.pass-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% -10%, rgba(var(--pcd), 0.35) 0%, transparent 60%);
  pointer-events: none;
  z-index: 1;
}

/* ── Icon ring ───────────────────────────────────────────── */
.pass-icon-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(var(--pc), 0.15);
  border: 2px solid rgba(var(--pc), 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.pass-icon-ring--off {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: none;
}

/* ── Text ────────────────────────────────────────────────── */
.pass-period-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(var(--pc), 0.65);
  margin-bottom: 6px;
}
.pass-clock {
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: #4ade80;
  line-height: 1;
  margin-bottom: 4px;
}
.card-clock {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  opacity: 0.92;
  display: inline-flex;
  align-items: baseline;
}
.card-clock-char {
  display: inline-block;
  width: 0.62em;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.card-clock-sep {
  width: 0.3em;
  opacity: 1;
}
.pass-period-label--off {
  color: rgba(255, 255, 255, 0.22);
}
.pass-status {
  font-weight: 900;
  letter-spacing: 0.07em;
  line-height: 1;
}
.pass-status--on {
  font-size: 40px;
  color: var(--ps);
}
.pass-status--off {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.14);
  letter-spacing: 0.14em;
}
.pass-label {
  font-size: 16px;
  font-weight: 600;
}
.pass-label--off {
  color: rgba(255, 255, 255, 0.28);
}
.pass-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.28);
}

/* ── Badges ──────────────────────────────────────────────── */
.pass-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  letter-spacing: 0.03em;
}
.pass-badge--vegan {
  background: rgba(74, 222, 128, 0.12);
  color: #86efac;
  border: 1px solid rgba(74, 222, 128, 0.2);
}
.pass-badge--ok {
  background: rgba(74, 222, 128, 0.18);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}
.pass-badge--pending {
  background: rgba(250, 204, 21, 0.1);
  color: rgba(250, 204, 21, 0.7);
  border: 1px solid rgba(250, 204, 21, 0.2);
}
</style>
