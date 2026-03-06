<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 bg-[#1E1E1E]">
    <!-- Loader de callback de Discord -->
    <template v-if="isDiscordLoading">
      <UIKitLoader />
    </template>

    <template v-else>
      <!-- Grid de componentes Enterprise -->
      <div class="grid grid-cols-4 gap-6 mb-1">
        <Enterprise
          imagePath="/icons/Unergy.svg"
          color="#915BD8"
          height="60%"
        />
        <Enterprise
          imagePath="/icons/Solenium.svg"
          color="#1C99CD"
          width="80%"
        />
        <Enterprise
          imagePath="/icons/Suno.png"
          color="#D0FF41"
          width="60%"
        />
        <Enterprise
          imagePath="/icons/Zentrack.png"
          color="#FD9C10"
          width="54%"
        />
      </div>

      <!-- Título TeamApp -->
      <h1 class="text-[55px] font-semibold text-white mb-3 tracking-tight">
        TeamApp
      </h1>

      <div class="mb-10 max-w-sm w-full" @keyup.enter="handleLogin">
        <Field
          :label="'Usuario'"
          :icon="'User'"
          :hintText="'Ingresa tu usuario'"
          :type="'text'"
          v-model="usernameController"
          width="100%"
          :class="'mb-4'"
        />
        <Field
          :label="'Contraseña'"
          :icon="'KeyRound'"
          :hintText="'Ingresa tu contraseña'"
          :type="'password'"
          v-model="passwordController"
          width="100%"
        />
      </div>

      <Button
        :text="'Iniciar Sesión'"
        :class="'mb-3'"
        :isLoading="isLoading"
        @click="handleLogin"
      />
      <!-- Botón de Discord -->
      <LoginDiscord />
    </template>
  </div>

  <UIKitToast />
</template>

<script setup lang="ts">
import Enterprise from '@/components/accounts/Enterprise.vue';
import Button from '@/components/UIKit/Button/Button.vue';
import LoginDiscord from '@/components/accounts/LoginDiscord.vue';
import Field from '@/components/UIKit/Input/Field.vue';

const usernameController = ref('')
const passwordController = ref('')
const isLoading = ref(false)
const isDiscordLoading = ref(false)

const { signIn } = useAuth()
const config = useRuntimeConfig()
const route = useRoute()
const { error: showError } = useToast()

onMounted(async () => {
  const code = route.query.code as string | undefined
  if (!code) return

  isDiscordLoading.value = true
  try {
    const response = await $fetch<Record<string, any>>('/api/accounts/discord/', {
      method: 'POST',
      baseURL: config.public.baseURL,
      body: { code },
    })

    const accessToken = response.access

    if (!accessToken) {
      throw new Error(`Token no encontrado en respuesta: ${JSON.stringify(Object.keys(response))}`)
    }

    // Validar el token y obtener los datos de sesión
    const sessionData = await $fetch('/api/accounts/user/', {
      baseURL: config.public.baseURL,
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    // Setear la cookie del token
    useCookie('token.access', {
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    }).value = accessToken

    // Inyectar el estado de sesión directamente en nuxt-auth
    // para evitar que vuelva a llamar a getSession y limpie el token
    useState('auth:data').value = sessionData

    await navigateTo('/dashboard', { replace: true })
  } catch (error: any) {
    const message = error?.data?.detail || error?.data?.message || 'Error al autenticar con Discord'
    showError(message)
    isDiscordLoading.value = false
  }
})

const handleLogin = async () => {
  try {
    isLoading.value = true

    const credentials = {
      username: usernameController.value,
      password: passwordController.value
    }

    await signIn(credentials, { callbackUrl: '/dashboard' })

    isLoading.value = false
  } catch (error: unknown) {
    const status = (error as { status?: number; statusCode?: number })?.status
      ?? (error as { status?: number; statusCode?: number })?.statusCode

    if (status === 401 || status === 400) {
      showError('Usuario o contraseña incorrectos')
    } else {
      showError('Error al iniciar sesión. Intenta de nuevo.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
