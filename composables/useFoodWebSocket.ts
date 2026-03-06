import type { FoodSchedule } from '~/types/food'

type MealPeriod = 'breakfast' | 'lunch' | 'dinner'

interface WSMessage {
  initial: boolean
  message_type: string
  data: FoodSchedule | Record<string, never>
  errors: Record<string, string[]>
}

export const useFoodWebSocket = () => {
  const token = useCookie('token.access')
  const config = useRuntimeConfig()
  const { error: showError } = useToast()

  const food = ref<FoodSchedule | null>(null)
  const loading = ref(true)
  const requesting = ref(false)
  const requestingPeriod = ref<string | null>(null)

  let ws: WebSocket | null = null

  const connect = () => {
    if (!token.value) {
      loading.value = false
      return
    }

    const wsBase = config.public.baseURL
      .replace('https://', 'wss://')
      .replace('http://', 'ws://')

    ws = new WebSocket(`${wsBase}/ws/restaurant/?token=${token.value}`)

    ws.onmessage = (event: MessageEvent) => {
      const msg: WSMessage = JSON.parse(event.data as string)

      if (Object.keys(msg.errors).length > 0) {
        showError('No puedes pedir en este horario')
        requesting.value = false
        requestingPeriod.value = null
        return
      }

      if (msg.data && 'id' in msg.data) {
        food.value = msg.data as FoodSchedule
        loading.value = false
      }

      requesting.value = false
      requestingPeriod.value = null
    }

    ws.onerror = () => {
      loading.value = false
    }
  }

  const disconnect = () => {
    ws?.close()
    ws = null
  }

  const toggle = (period: MealPeriod, vegan = false) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !food.value || requesting.value) return

    const key = (vegan ? `${period}_vegan` : period) as keyof FoodSchedule
    const confirmedKey = `${vegan ? `${period}_vegan` : period}_confirmed` as keyof FoodSchedule

    if (food.value[confirmedKey]) return

    requesting.value = true
    requestingPeriod.value = period
    ws.send(JSON.stringify({ ...food.value, [key]: !food.value[key] }))
  }

  return { food, loading, requesting, requestingPeriod, connect, disconnect, toggle }
}
