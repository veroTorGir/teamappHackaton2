<template>
  <!-- Store detail -->
  <DashboardStoreDetail
    v-if="selected"
    :store-id="selected.id"
    :store-name="selected.name"
    @back="selected = null"
  />

  <!-- Store list -->
  <div v-else class="px-5 pb-32 pt-7">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <UIKitLoader size="32px" :color="primaryColor" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex justify-center py-16">
      <p class="text-white/40 text-sm text-center">No se pudo cargar la tienda.</p>
    </div>

    <!-- List -->
    <div v-else class="flex flex-col gap-3">
      <button
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.06] border border-white/10 active:bg-white/[0.10] transition-colors text-left"
        @click="selected = item"
      >
        <!-- Image -->
        <div class="w-20 h-20 rounded-xl overflow-hidden bg-white/[0.04] flex-shrink-0">
          <img
            :src="item.picture"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Text -->
        <div class="flex-1 min-w-0">
          <p class="text-white font-semibold text-lg">{{ item.name }}</p>
          <p v-if="item.description" class="text-white/40 text-xs mt-1 line-clamp-2">{{ item.description }}</p>
        </div>

        <!-- Arrow -->
        <ChevronRight :size="18" class="text-white/30 flex-shrink-0" />
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { StoreItem } from '~/types/store'

const storeApi = useStoreApi()
const { primaryColor } = useCompanyTheme()

const items = ref<StoreItem[]>([])
const loading = ref(true)
const error = ref(false)
const selected = ref<StoreItem | null>(null)

onMounted(async () => {
  try {
    const page = await storeApi.getPage(1)
    items.value = page.results
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
