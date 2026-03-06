<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 bg-[#1E1E1E]">
    <img src="/icon.png" alt="TeamApp" class="w-16 h-16 rounded-2xl mb-6 object-contain" />

    <h1 class="text-white text-2xl font-semibold mb-1">Completa tu perfil</h1>
    <p class="text-white/50 text-sm mb-8">Necesitamos algunos datos para continuar</p>

    <div class="w-full max-w-sm flex flex-col gap-4">
      <Field
        label="Número de documento"
        icon="CreditCard"
        hintText="Ej: 123456789"
        type="text"
        v-model="documentNumber"
        width="100%"
      />

      <!-- Ciudad -->
      <div class="w-full">
        <label class="flex text-base font-medium text-white mb-1">Ciudad</label>
        <div class="flex items-center gap-3 border-2 border-white rounded-xl px-3 py-4 bg-transparent">
          <MapPin :size="24" class="flex-shrink-0 text-white" />
          <select
            v-model="selectedCity"
            class="flex-1 bg-transparent text-white outline-none appearance-none"
            :class="selectedCity ? 'text-white' : 'text-gray-400'"
          >
            <option value="" disabled class="bg-[#1E1E1E] text-white">Selecciona tu ciudad</option>
            <option
              v-for="city in cities"
              :key="city.id"
              :value="city.id"
              class="bg-[#1E1E1E] text-white"
            >
              {{ city.name }} - {{ city.department.name }}
            </option>
          </select>
        </div>
      </div>

      <Field
        label="Clave pública (opcional)"
        icon="Key"
        hintText="Opcional"
        type="text"
        v-model="publicKey"
        width="100%"
      />

      <Button
        text="Crear perfil"
        :isLoading="loading"
        class="mt-2"
        @pressed="handleSubmit"
      />
    </div>

    <UIKitToast />
  </div>
</template>

<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import Field from '@/components/UIKit/Input/Field.vue'
import Button from '@/components/UIKit/Button/Button.vue'

definePageMeta({ auth: true })

interface City {
  id: number
  name: string
  department: { name: string }
}

const config = useRuntimeConfig()
const { error: showError, success: showSuccess } = useToast()

const documentNumber = ref('')
const selectedCity = ref<number | ''>('')
const publicKey = ref('')
const loading = ref(false)
const cities = ref<City[]>([])

onMounted(async () => {
  try {
    const token = useCookie('token.access')
    const data = await $fetch<City[]>('/api/cities/', {
      baseURL: config.public.baseURL,
      headers: { Authorization: `Bearer ${token.value}` },
    })
    cities.value = data
  } catch {
    showError('No se pudieron cargar las ciudades')
  }
})

const handleSubmit = async () => {
  if (!documentNumber.value.trim()) {
    showError('El número de documento es obligatorio')
    return
  }

  loading.value = true
  try {
    const payload: Record<string, unknown> = {
      document_number: documentNumber.value.trim(),
    }
    if (selectedCity.value) payload.place = selectedCity.value
    if (publicKey.value.trim()) payload.public_key = publicKey.value.trim()

    const token = useCookie('token.access')
    await $fetch('/api/colaborator/create_basic_profile/', {
      method: 'POST',
      baseURL: config.public.baseURL,
      headers: { Authorization: `Bearer ${token.value}` },
      body: payload,
    })

    showSuccess('¡Perfil creado! Inicia sesión para continuar.')

    // Limpiar sesión y redirigir al login
    await new Promise(resolve => setTimeout(resolve, 1500))
    useCookie('token.access').value = null
    useCookie('token.refresh').value = null
    await navigateTo('/login', { replace: true })
  } catch (error: any) {
    const data = error?.data
    let message = 'No se pudo crear el perfil'
    if (data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0]
      if (firstKey && Array.isArray(data[firstKey])) {
        message = data[firstKey][0]
      } else if (data.detail) {
        message = data.detail
      } else if (data.message) {
        message = data.message
      }
    }
    showError(message)
  } finally {
    loading.value = false
  }
}
</script>
