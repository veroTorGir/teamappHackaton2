<template>
  <Teleport to="body">
    <Transition name="sheet" :duration="{ enter: 420, leave: 300 }">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-end justify-center"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        />

        <!-- Sheet -->
        <div
          class="relative bg-[#1E1E1E] border border-white/10 rounded-t-3xl w-full max-w-lg p-6 pb-10"
          :style="dragStyle"
        >
          <!-- Drag handle — área grande para facilitar el toque en móvil -->
          <div
            class="flex justify-center items-center py-3 -mx-6 -mt-6 mb-2 cursor-grab active:cursor-grabbing select-none"
            style="touch-action: none;"
            @mousedown="onDragStart"
            @touchstart="onDragStart"
          >
            <div class="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          <!-- Title -->
          <h2 v-if="title" class="text-white font-semibold text-lg text-center mb-5">{{ title }}</h2>

          <!-- Content slot -->
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// ── Bloquear scroll del body cuando el modal está abierto ────────────────────
watch(() => props.modelValue, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
}, { immediate: true })

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})

// ── Drag to close ────────────────────────────────────────────────────────────

const dragY       = ref(0)
const dragging    = ref(false)
const dragClosing = ref(false)
const dragSnap    = ref(false)
const startY      = ref(0)

const CLOSE_THRESHOLD = 100

const dragStyle = computed(() => {
  // Animando hacia abajo para cerrar
  if (dragClosing.value) {
    return {
      transform:  'translateY(110%)',
      transition: 'transform 260ms cubic-bezier(0.4, 0, 1, 1)',
    }
  }
  // Volviendo a posición original con spring
  if (dragSnap.value) {
    return {
      transform:  'translateY(0)',
      transition: 'transform 450ms cubic-bezier(0.32, 0.72, 0, 1)',
    }
  }
  // Arrastrando activamente
  if (dragging.value) {
    return {
      transform:  `translateY(${Math.max(0, dragY.value)}px)`,
      transition: 'none',
      opacity:    String(Math.max(0.5, 1 - dragY.value / 300)),
    }
  }
  return {}
})

function getY(e: MouseEvent | TouchEvent) {
  return 'touches' in e ? e.touches[0].clientY : e.clientY
}

function onDragStart(e: MouseEvent | TouchEvent) {
  dragging.value = true
  startY.value   = getY(e)
  dragY.value    = 0

  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('touchmove', onDragMove as EventListener, { passive: false })
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchend', onDragEnd)
}

function onDragMove(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  dragY.value = getY(e) - startY.value
}

function onDragEnd() {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('touchmove', onDragMove as EventListener)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchend', onDragEnd)

  if (dragY.value >= CLOSE_THRESHOLD) {
    // Animar el sheet hasta abajo y luego cerrar
    dragging.value    = false
    dragClosing.value = true
    setTimeout(() => {
      emit('update:modelValue', false)
      dragClosing.value = false
      dragY.value       = 0
    }, 260)
  } else {
    // Animar de vuelta a posición original con spring
    dragging.value = false
    dragSnap.value = true
    setTimeout(() => {
      dragSnap.value = false
      dragY.value    = 0
    }, 450)
  }
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('touchmove', onDragMove as EventListener)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchend', onDragEnd)
})
</script>

<style scoped>
/* ── Backdrop ───────────────────────────────────────────── */
.sheet-enter-active > div:first-child,
.sheet-leave-active > div:first-child {
  transition: opacity 300ms ease;
}
.sheet-enter-from > div:first-child,
.sheet-leave-to > div:first-child {
  opacity: 0;
}

/* ── Sheet panel ────────────────────────────────────────── */
/* Apertura: spring suave estilo iOS */
.sheet-enter-active > div:last-child {
  transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
}
/* Cierre: rápido y directo */
.sheet-leave-active > div:last-child {
  transition: transform 260ms cubic-bezier(0.4, 0, 1, 1);
}
.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
