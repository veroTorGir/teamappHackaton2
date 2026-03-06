import type { StorePage, StockItem } from '~/types/store'

interface PurchasePayload {
  user: number
  stock_quantity: { id: number; quantity: number }[]
}

export const useStoreApi = () => {
  const api = useApi()
  const config = useRuntimeConfig()

  return {
    getPage: (page = 1): Promise<StorePage> =>
      api.get(`${config.public.baseURL}/api/store/?page=${page}`),

    getStock: (storeId: number): Promise<StockItem[]> =>
      api.get(`${config.public.baseURL}/api/store/stock/?store=${storeId}`),

    purchase: (payload: PurchasePayload): Promise<void> =>
      api.post(`${config.public.baseURL}/api/store/stock/trust_purchase/`, payload),
  }
}
