import type { StockItem } from '~/types/store'

export interface CartItem {
  stockItemId: number
  productId: number
  name: string
  picture: string
  unitPrice: number   // centavos
  quantity: number
  maxQuantity: number
}

export const useCart = () => {
  const carts = useState<Record<number, CartItem[]>>('cart', () => ({}))

  const getCart = (storeId: number): CartItem[] =>
    carts.value[storeId] ?? []

  const getItemCount = (storeId: number) =>
    getCart(storeId).reduce((sum, i) => sum + i.quantity, 0)

  const getTotal = (storeId: number) =>
    getCart(storeId).reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const getItemQty = (storeId: number, stockItemId: number) =>
    getCart(storeId).find(i => i.stockItemId === stockItemId)?.quantity ?? 0

  const addItem = (storeId: number, item: StockItem) => {
    if (!carts.value[storeId]) carts.value[storeId] = []
    const existing = carts.value[storeId].find(i => i.stockItemId === item.id)
    if (existing) {
      if (existing.quantity < item.quantity) existing.quantity++
    } else {
      carts.value[storeId].push({
        stockItemId: item.id,
        productId: item.product.id,
        name: item.product.name,
        picture: item.product.picture,
        unitPrice: item.value,
        quantity: 1,
        maxQuantity: item.quantity,
      })
    }
  }

  const increaseItem = (storeId: number, stockItemId: number) => {
    if (!carts.value[storeId]) return
    const item = carts.value[storeId].find(i => i.stockItemId === stockItemId)
    if (item && item.quantity < item.maxQuantity) item.quantity++
  }

  const decreaseItem = (storeId: number, stockItemId: number) => {
    if (!carts.value[storeId]) return
    const idx = carts.value[storeId].findIndex(i => i.stockItemId === stockItemId)
    if (idx === -1) return
    if (carts.value[storeId][idx].quantity <= 1) {
      carts.value[storeId].splice(idx, 1)
    } else {
      carts.value[storeId][idx].quantity--
    }
  }

  const clearCart = (storeId: number) => {
    carts.value[storeId] = []
  }

  return { getCart, getItemCount, getTotal, getItemQty, addItem, increaseItem, decreaseItem, clearCart }
}
