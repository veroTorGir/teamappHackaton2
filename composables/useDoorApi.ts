import type { Door } from '~/types/door'

export const useDoorApi = () => {
  const api = useApi()
  const config = useRuntimeConfig()

  return {
    getMe: (userId: number): Promise<Door[]> =>
      api.get(`${config.public.baseURL}/api/colaborator/doors/?colaborator_id=${userId}`),
    open: (doorId: string): Promise<void> =>
      api.get(`${config.public.baseURL}/api/colaborator/open_door/?door_id=${doorId}`),
  }
}
