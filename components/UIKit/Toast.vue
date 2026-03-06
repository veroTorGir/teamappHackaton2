<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-4 opacity-0"
    >
      <div
        v-if="toast.visible"
        class="fixed top-5 left-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-xl"
        :class="{
          'bg-red-500/15 border-red-500/25':     toast.type === 'error',
          'bg-green-500/15 border-green-500/25': toast.type === 'success',
          'bg-white/10 border-white/15':         toast.type === 'loading',
        }"
        style="backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
      >
        <!-- Icon -->
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          :class="{
            'bg-red-500/20':   toast.type === 'error',
            'bg-green-500/20': toast.type === 'success',
            'bg-white/10':     toast.type === 'loading',
          }"
        >
          <XCircle     v-if="toast.type === 'error'"            :size="18" class="text-red-400" />
          <CheckCircle v-else-if="toast.type === 'success'"     :size="18" class="text-green-400" />
          <div
            v-else
            class="w-4 h-4 rounded-full border-2 border-t-transparent border-white/70 animate-spin"
          />
        </div>

        <!-- Message -->
        <p
          class="text-sm font-medium flex-1"
          :class="{
            'text-red-300':   toast.type === 'error',
            'text-green-300': toast.type === 'success',
            'text-white/80':  toast.type === 'loading',
          }"
        >{{ toast.message }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XCircle, CheckCircle, X } from 'lucide-vue-next'

const { toast, dismiss } = useToast()
</script>
