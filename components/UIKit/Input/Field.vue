<template>
  <div :style="{ width: width }" :class="{ 'w-full': !width }">
    <!-- Label -->
    <label class="flex text-base font-medium text-white mb-1">
      {{ label }}
    </label>

    <!-- Container con border -->
    <div class="relative flex items-center gap-3 border-2 border-white rounded-xl px-3 py-4 bg-transparent">
      <!-- Icon a la izquierda -->
      <component
        v-if="iconComponent"
        :is="iconComponent"
        :size="24"
        class="flex-shrink-0 text-white"
      />

      <!-- Input con hint text como placeholder -->
      <input
        v-model="inputValue"
        :type="currentInputType"
        :placeholder="hintText"
        class="flex-1 bg-transparent text-white placeholder:text-gray-400 outline-none"
        :class="type === 'password' ? 'pr-8' : ''"
        @input="handleInput"
      />

      <!-- Toggle password visibility -->
      <button
        v-if="type === 'password'"
        @click="togglePasswordVisibility"
        type="button"
        class="absolute right-3 text-white/60 hover:text-white transition-colors"
      >
        <component
          :is="showPassword ? LucideIcons.Eye : LucideIcons.EyeClosed"
          :size="20"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps<{
  label: string
  icon?: string
  hintText: string
  type?: string
  modelValue?: string
  width?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = ref(props.modelValue || '')
const showPassword = ref(false)

const iconComponent = computed(() => {
  if (!props.icon) return null
  return (LucideIcons as any)[props.icon] || null
})

const currentInputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type || 'text'
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  emit('update:modelValue', target.value)
}
</script>
