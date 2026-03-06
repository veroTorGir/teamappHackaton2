<template>
  <div class="bg-white/[0.07] border border-white/10 rounded-2xl p-5 mb-4">
    <div class="flex items-center gap-4">
      <!-- Avatar with primary color ring -->
      <div
        class="w-16 h-16 rounded-full flex-shrink-0"
        :style="{ boxShadow: `0 0 0 2.5px ${primaryColor}` }"
      >
        <UIKitAvatar
          :src="collaborator.profile_picture"
          :name="fullName"
          :size="64"
        />
      </div>

      <!-- User info -->
      <div class="flex-1 min-w-0">
        <h2 class="text-white font-semibold text-lg leading-tight truncate">{{ fullName }}</h2>
        <p class="text-white/60 text-sm truncate mt-0.5">{{ positionName }}</p>
        <p class="text-white/40 text-xs mt-1">{{ location }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Collaborator } from '~/types/collaborator'

const props = defineProps<{
  collaborator: Collaborator
}>()

const primaryColor = computed(() => props.collaborator.company[0]?.primary_color ?? '#753BBD')
const fullName = computed(() => `${props.collaborator.user.first_name} ${props.collaborator.user.last_name}`)
const positionName = computed(() => props.collaborator.position[0]?.name ?? '')
const location = computed(() => {
  const { name, department } = props.collaborator.place
  return `${name}, ${department.country.name}`
})
</script>
