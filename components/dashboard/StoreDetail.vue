<template>
  <div class="px-5 pt-7" :class="itemCount > 0 ? 'pb-44' : 'pb-32'">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.08] active:bg-white/[0.15] transition-colors flex-shrink-0"
        @click="$emit('back')"
      >
        <ChevronLeft :size="20" class="text-white" />
      </button>
      <h1 class="text-white text-2xl font-semibold">{{ storeName }}</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <UIKitLoader size="32px" :color="primaryColor" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex justify-center py-16">
      <p class="text-white/40 text-sm text-center">No se pudo cargar los productos.</p>
    </div>

    <!-- Empty -->
    <div v-else-if="items.length === 0" class="flex justify-center py-16">
      <p class="text-white/40 text-sm text-center">Sin productos disponibles.</p>
    </div>

    <!-- List -->
    <div v-else class="flex flex-col gap-2">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.06] border border-white/10"
      >
        <!-- Thumbnail -->
        <div class="w-16 h-16 rounded-xl overflow-hidden bg-white/[0.04] flex-shrink-0">
          <img
            :src="item.product.picture"
            :alt="item.product.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-white font-semibold text-sm leading-tight line-clamp-1">{{ item.product.name }}</p>
          <p v-if="item.product.description" class="text-white/40 text-xs mt-0.5 line-clamp-1">{{ item.product.description }}</p>
          <div class="flex items-center gap-2 mt-1">
            <p class="text-white/80 text-sm font-semibold">{{ formatPrice(item.value) }}</p>
            <span
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              :class="item.quantity <= 2 ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.07] text-white/40'"
            >{{ item.quantity }} uds</span>
          </div>
        </div>

        <!-- Qty controls / Add button -->
        <div class="flex-shrink-0">
          <!-- Not in cart -->
          <button
            v-if="getItemQty(storeId, item.id) === 0"
            class="w-8 h-8 rounded-full flex items-center justify-center active:opacity-60 transition-opacity"
            :style="{ backgroundColor: primaryColor }"
            @click="addItem(storeId, item)"
          >
            <Plus :size="16" :class="isLightPrimary ? 'text-gray-900' : 'text-white'" />
          </button>

          <!-- In cart -->
          <div v-else class="flex items-center gap-2">
            <button
              class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center active:opacity-60 transition-opacity"
              @click="decreaseItem(storeId, item.id)"
            >
              <Minus :size="14" class="text-white" />
            </button>
            <span class="text-white font-bold text-sm w-4 text-center">{{ getItemQty(storeId, item.id) }}</span>
            <button
              class="w-7 h-7 rounded-full flex items-center justify-center active:opacity-60 transition-opacity"
              :style="{ backgroundColor: primaryColor }"
              :disabled="getItemQty(storeId, item.id) >= item.quantity"
              @click="addItem(storeId, item)"
            >
              <Plus :size="14" :class="isLightPrimary ? 'text-gray-900' : 'text-white'" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cart bar -->
  <Transition name="cart-bar">
    <div
      v-if="itemCount > 0"
      class="fixed bottom-32 left-5 right-5 z-40"
    >
      <button
        class="w-full flex items-center justify-between px-5 py-4 rounded-2xl active:opacity-80 transition-opacity"
        :style="{ backgroundColor: primaryColor }"
        @click="cartOpen = true"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center"
            :class="isLightPrimary ? 'bg-black/15' : 'bg-white/20'"
          >
            <span class="text-xs font-bold" :class="isLightPrimary ? 'text-gray-900' : 'text-white'">{{ itemCount }}</span>
          </div>
          <span class="font-semibold text-sm" :class="isLightPrimary ? 'text-gray-900' : 'text-white'">Ver carrito de {{ storeName }}</span>
        </div>
        <span class="font-bold text-sm" :class="isLightPrimary ? 'text-gray-900' : 'text-white'">{{ formatPrice(cartTotal) }}</span>
      </button>
    </div>
  </Transition>

  <!-- Cart sheet -->
  <UIKitModalBottomSheet v-model="cartOpen" title="Tu pedido">
    <div class="flex flex-col gap-3">
      <!-- Cart items -->
      <div
        v-for="cartItem in cart"
        :key="cartItem.stockItemId"
        class="flex items-center gap-3"
      >
        <div class="w-12 h-12 rounded-xl overflow-hidden bg-white/[0.04] flex-shrink-0">
          <img :src="cartItem.picture" :alt="cartItem.name" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white text-sm font-semibold line-clamp-1">{{ cartItem.name }}</p>
          <p class="text-white/40 text-xs mt-0.5">{{ formatPrice(cartItem.unitPrice * cartItem.quantity) }}</p>
        </div>
        <!-- Qty controls -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center active:opacity-60 transition-opacity"
            @click="decreaseItem(storeId, cartItem.stockItemId)"
          >
            <Minus :size="14" class="text-white" />
          </button>
          <span class="text-white font-bold text-sm w-4 text-center">{{ cartItem.quantity }}</span>
          <button
            class="w-7 h-7 rounded-full flex items-center justify-center active:opacity-60 transition-opacity"
            :style="{ backgroundColor: primaryColor }"
            :disabled="cartItem.quantity >= cartItem.maxQuantity"
            @click="increaseItem(storeId, cartItem.stockItemId)"
          >
            <Plus :size="14" :class="isLightPrimary ? 'text-gray-900' : 'text-white'" />
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px bg-white/10 my-1" />

      <!-- Total -->
      <div class="flex items-center justify-between">
        <span class="text-white/60 text-sm">Total</span>
        <span class="text-white font-bold text-lg">{{ formatPrice(cartTotal) }}</span>
      </div>

      <!-- CTA -->
      <button
        class="w-full py-3.5 rounded-2xl font-semibold text-sm mt-2 transition-opacity flex items-center justify-center gap-2"
        :class="[isLightPrimary ? 'text-gray-900' : 'text-white', purchasing ? 'opacity-60' : 'active:opacity-70']"
        :style="{ backgroundColor: primaryColor }"
        :disabled="purchasing"
        @click="confirmPurchase"
      >
        <UIKitLoader v-if="purchasing" size="16px" :color="isLightPrimary ? '#1a1a1a' : 'white'" />
        {{ purchasing ? 'Procesando...' : 'Confirmar pedido' }}
      </button>

      <!-- Clear -->
      <button
        class="w-full py-3 text-white/40 text-sm active:opacity-60 transition-opacity"
        @click="clearCart(storeId); cartOpen = false"
      >
        Vaciar carrito
      </button>
    </div>
  </UIKitModalBottomSheet>
</template>

<script setup lang="ts">
import { ChevronLeft, Plus, Minus } from 'lucide-vue-next'
import type { StockItem } from '~/types/store'

const props = defineProps<{
  storeId: number
  storeName: string
}>()

defineEmits<{ back: [] }>()

const storeApi = useStoreApi()
const { primaryColor, isLightPrimary } = useCompanyTheme()
const { getCart, getItemCount, getTotal, getItemQty, addItem, increaseItem, decreaseItem, clearCart } = useCart()
const { collaborator } = useCollaboratorState()
const toast = useToast()

const items = ref<StockItem[]>([])
const loading = ref(true)
const error = ref(false)
const cartOpen = ref(false)
const purchasing = ref(false)

const cart = computed(() => getCart(props.storeId))
const itemCount = computed(() => getItemCount(props.storeId))
const cartTotal = computed(() => getTotal(props.storeId))

const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(value / 100)

const confirmPurchase = async () => {
  if (!collaborator.value || purchasing.value) return
  purchasing.value = true
  try {
    await storeApi.purchase({
      user: collaborator.value.user.id,
      stock_quantity: cart.value.map(i => ({ id: i.stockItemId, quantity: i.quantity })),
    })
    clearCart(props.storeId)
    cartOpen.value = false
    toast.success('Pedido realizado con éxito')
  } catch {
    toast.error('No se pudo realizar el pedido')
  } finally {
    purchasing.value = false
  }
}

onMounted(async () => {
  try {
    items.value = await storeApi.getStock(props.storeId)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.cart-bar-enter-active,
.cart-bar-leave-active {
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease;
}
.cart-bar-enter-from,
.cart-bar-leave-to {
  transform: translateY(16px);
  opacity: 0;
}
</style>
