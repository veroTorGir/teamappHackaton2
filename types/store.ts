export interface StoreItem {
  id: number
  name: string
  is_active: boolean
  last_updated: string
  description: string
  picture: string
}

export interface StorePage {
  count: number
  next: string | null
  previous: string | null
  results: StoreItem[]
}

export interface StockProduct {
  id: number
  metadata: unknown
  variants: unknown[]
  name: string
  last_updated: string
  description: string
  picture: string
}

export interface StockItem {
  id: number
  product: StockProduct
  last_updated: string
  update: boolean
  active: boolean
  quantity: number
  cost: number
  value: number
  store: number
}
