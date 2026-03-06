import type { FoodSchedule } from '~/types/food'

export const useFoodApi = () => {
  const api = useApi()
  const config = useRuntimeConfig()

  return {
    getMe: (collaboratorId: number): Promise<FoodSchedule> =>
      api.get(`${config.public.baseURL}/api/colaborator/${collaboratorId}/food/`),
  }
}
