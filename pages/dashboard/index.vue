<template>
  <!-- Loading -->
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <div class="loader" :style="{ '--loader-color': primaryColor }" />
  </div>

  <!-- Error -->
  <div v-else-if="error" class="flex items-center justify-center min-h-screen px-6">
    <p class="text-red-400 text-sm text-center">Error al cargar la información. Intenta de nuevo.</p>
  </div>

  <!-- Dashboard content -->
  <template v-else-if="collaborator">
    <DashboardNavbar :collaborator="collaborator" />
    <div class="pt-16" />

    <!-- Store tab -->
    <DashboardStore v-if="tab === 'store'" />

    <!-- Food tab -->
    <DashboardFood v-else-if="tab === 'food'" />

    <!-- Home tab -->
    <div v-else class="px-5 pb-32">
      <!-- Greeting -->
      <div class="pt-7 pb-6 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <component :is="greetingIcon" class="text-white/50" :size="16" />
            <p class="text-white/50 text-sm">{{ greeting }}</p>
          </div>
          <h1 class="text-white text-3xl font-semibold mt-0.5">{{ collaborator.user.first_name }}</h1>
          <UIKitBadge :label="collaboratorLocation" :icon="MapPin" class="mt-2" />
        </div>
        <div
          class="w-20 h-20 rounded-full flex-shrink-0"
          :style="{ boxShadow: `0 0 0 3px ${primaryColor}` }"
        >
          <UIKitAvatar
            :src="collaborator.profile_picture"
            :name="`${collaborator.user.first_name} ${collaborator.user.last_name}`"
            :size="80"
          />
        </div>
      </div>

      <!-- Balance -->
      <DashboardBalance v-if="balance" :collaborator="collaborator" :balance="balance" />

      <!-- Week schedule -->
      <DashboardWeekSchedule :collaborator="collaborator" />
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Collaborator } from '~/types/collaborator'
import { Sun, CloudSun, Moon, MapPin } from 'lucide-vue-next'
import type { Balance } from '~/composables/useBalanceApi'

definePageMeta({ layout: 'dashboard' })

const collaboratorApi = useCollaboratorApi()
const balanceApi = useBalanceApi()
const theme = useCompanyTheme()
const { collaborator: collaboratorState } = useCollaboratorState()
const { tab } = useDashboardTab()

const collaborator = ref<Collaborator | null>(null)
const balance = ref<Balance | null>(null)
const loading = ref(true)
const error = ref(false)

const primaryColor = computed(() => theme.primaryColor.value)

const collaboratorLocation = computed(() => {
  const place = collaborator.value?.place
  if (!place) return ''
  return `${place.name}, ${place.department.country.name}`
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
})

const greetingIcon = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return Sun
  if (h < 18) return CloudSun
  return Moon
})

onMounted(async () => {
  try {
    const collaboratorResult = await collaboratorApi.getMe()
    collaborator.value = collaboratorResult[0] ?? null
    collaboratorState.value = collaborator.value

    const company = collaborator.value?.company[0]
    if (company) {
      theme.primaryColor.value = company.primary_color
      theme.secondaryColor.value = company.secondary_color
    }

    if (collaborator.value) {
      try {
        balance.value = await balanceApi.getMe(collaborator.value.id)
      } catch {
        balance.value = null
      }
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
    if (!error.value && !collaborator.value) {
      await navigateTo('/setup', { replace: true })
    }
  }
})
</script>

<style scoped>
.loader {
  width: 35px;
  aspect-ratio: 1;
  --_g: no-repeat radial-gradient(farthest-side, var(--loader-color) 94%, #0000);
  background:
    var(--_g) 0    0,
    var(--_g) 100% 0,
    var(--_g) 100% 100%,
    var(--_g) 0    100%;
  background-size: 40% 40%;
  animation: dots-loader 0.5s infinite;
}
@keyframes dots-loader {
  100% { background-position: 100% 0, 100% 100%, 0 100%, 0 0 }
}
</style>
