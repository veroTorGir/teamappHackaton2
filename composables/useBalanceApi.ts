export interface Balance {
  id: number
  last_updated: string
  value: number
  user: number | null
  colaborator: number
}

export const useBalanceApi = () => {
  const api = useApi()
  const config = useRuntimeConfig()

  return {
    getMe: (userId: number): Promise<Balance> =>
      api.get(`${config.public.baseURL}/api/colaborator/${userId}/balance/`),
  }
}
