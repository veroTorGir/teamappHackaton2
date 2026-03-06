<template>
  <UIKitModalBottomSheet v-model="model" title="Puertas">
    <!-- Loading list -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIKitLoader :color="primaryColor" />
    </div>

    <!-- Door grid — 3 columns -->
    <div v-else class="grid grid-cols-3 gap-4">
      <button
        v-for="door in doors"
        :key="door.id"
        class="flex flex-col items-center gap-2 transition-transform"
        :class="doorState(door.id) === 'idle' ? 'active:scale-95' : 'scale-95'"
        :disabled="doorState(door.id) !== 'idle'"
        @click="openDoor(door.id, door.company.name, door.picture, door.company.primary_color)"
      >
        <!-- Icon tile -->
        <div
          class="relative w-20 h-20 rounded-2xl flex items-center justify-center p-3 transition-all duration-300"
          :style="{ backgroundColor: door.company.primary_color }"
        >
          <img
            :src="resolveUrl(door.picture)"
            :alt="door.company.name"
            class="w-[80%] h-[80%] object-contain"
          />
        </div>

        <!-- Door name + company -->
        <div class="text-center">
          <p class="text-white text-[14px] font-bold leading-tight">{{ door.company.name }}</p>
          <p class="text-white/40 text-[10px] leading-tight mt-0.5">{{ door.name }}</p>
        </div>
      </button>
    </div>
  </UIKitModalBottomSheet>

  <!-- Door opening overlay -->
  <Teleport to="body">
    <Transition name="door-overlay">
      <div
        v-if="feedbackState !== null"
        class="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
        style="background: rgba(0,0,0,0.80); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);"
      >
        <!-- Ripple rings (only during loading) -->
        <div v-if="feedbackState === 'loading'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="ripple-ring" :style="{ borderColor: primaryColor, animationDelay: '0s' }" />
          <div class="ripple-ring" :style="{ borderColor: primaryColor, animationDelay: '0.6s' }" />
          <div class="ripple-ring" :style="{ borderColor: primaryColor, animationDelay: '1.2s' }" />
        </div>

        <!-- Icon container -->
        <div
          class="relative z-10 w-24 h-24 rounded-2xl flex items-center justify-center mb-6 p-4"
          :class="feedbackState === 'success' ? 'icon-glow' : ''"
          :style="{
            backgroundColor: feedbackState === 'success' ? '#22c55e20' : feedbackSecondaryColor,
            boxShadow: feedbackState === 'success' ? '0 0 0 1px #22c55e40' : 'none',
          }"
        >
          <Transition name="icon-swap" mode="out-in">
            <img
              v-if="feedbackState === 'loading'"
              key="loading"
              :src="feedbackLogo"
              class="w-[80%] h-[80%] object-contain door-logo-pulse"
            />
            <Check
              v-else
              key="success"
              :size="40"
              class="text-green-400 icon-pop"
            />
          </Transition>
        </div>

        <!-- Text -->
        <Transition name="icon-swap" mode="out-in">
          <div v-if="feedbackState === 'loading'" key="loading-text" class="text-center">
            <p class="text-white text-lg font-semibold">Abriendo puerta...</p>
            <p class="text-white/40 text-sm mt-1">{{ feedbackDoorName }}</p>
          </div>
          <div v-else key="success-text" class="text-center">
            <p class="text-green-400 text-lg font-semibold">¡Puerta abierta!</p>
            <p class="text-white/40 text-sm mt-1">{{ feedbackDoorName }}</p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { Door } from '~/types/door'

type DoorState = 'idle' | 'loading' | 'success' | 'error'

const model = defineModel<boolean>({ required: true })

const config = useRuntimeConfig()
const doorApi = useDoorApi()
const { primaryColor } = useCompanyTheme()
const { data: session } = useAuth()

const doors = ref<Door[]>([])
const loading = ref(false)
const states = ref<Record<string, DoorState>>({})
const feedbackState = ref<null | 'loading' | 'success'>(null)
const feedbackDoorName = ref('')
const feedbackLogo = ref('')
const feedbackSecondaryColor = ref('')

const resolveUrl = (path: string) => {
  if (path.startsWith('http')) return path
  return `${config.public.baseURL}${path}`
}

const doorState = (id: string): DoorState => states.value[id] ?? 'idle'

const openDoor = async (doorId: string, doorName: string, logo: string, secondaryColor: string) => {
  if (doorState(doorId) !== 'idle') return
  states.value[doorId] = 'loading'
  feedbackDoorName.value = doorName
  feedbackLogo.value = resolveUrl(logo)
  feedbackSecondaryColor.value = secondaryColor
  feedbackState.value = 'loading'

  try {
    await doorApi.open(doorId)
    states.value[doorId] = 'success'
    feedbackState.value = 'success'
    setTimeout(() => {
      feedbackState.value = null
      states.value[doorId] = 'idle'
    }, 1500)
  } catch {
    states.value[doorId] = 'error'
    feedbackState.value = null
    setTimeout(() => { states.value[doorId] = 'idle' }, 2500)
  }
}

watch(model, async (open) => {
  if (open && doors.value.length === 0) {
    loading.value = true
    try {
      doors.value = await doorApi.getMe(session.value!.pk)
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped>
/* Overlay fade */
.door-overlay-enter-active,
.door-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.door-overlay-enter-from,
.door-overlay-leave-to {
  opacity: 0;
}

/* Icon/text swap */
.icon-swap-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.icon-swap-leave-active {
  transition: all 0.15s ease-in;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

/* Ripple rings */
.ripple-ring {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid;
  opacity: 0;
  animation: ripple 2.4s ease-out infinite;
}

@keyframes ripple {
  0% {
    opacity: 0.6;
    transform: scale(0.8);
  }
  100% {
    opacity: 0;
    transform: scale(3.2);
  }
}

/* Success icon pop */
.icon-pop {
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes pop {
  0%   { transform: scale(0.5); }
  100% { transform: scale(1); }
}

/* Success glow pulse */
.icon-glow {
  animation: glow-pulse 1.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 0 1px #22c55e40, 0 0 20px #22c55e20; }
  50%       { box-shadow: 0 0 0 1px #22c55e60, 0 0 40px #22c55e40; }
}

/* Stop animation so the leave transition can take over */
.icon-swap-leave-active {
  animation: none;
}
</style>
