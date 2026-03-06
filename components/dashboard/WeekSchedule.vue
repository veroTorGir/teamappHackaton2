<template>
  <div class="bg-white/[0.07] border border-white/10 rounded-2xl p-5 mb-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white font-semibold text-base">Esta semana</h3>
      <span class="text-white/40 text-xs">{{ weekRange }}</span>
    </div>

    <!-- Days row -->
    <div class="flex gap-2 overflow-x-auto pb-1">
      <div
        v-for="day in dayCards"
        :key="day.key"
        class="flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-3 w-[68px] transition-all"
        :class="day.isWorkDay ? 'bg-white/10' : 'bg-white/[0.03]'"
        :style="day.isToday ? { boxShadow: `0 0 0 1.5px ${primaryColor}` } : {}"
      >
        <!-- Day label -->
        <span
          class="text-[11px] font-medium tracking-wide mb-1.5"
          :class="day.isWorkDay ? 'text-white/60' : 'text-white/25'"
        >
          {{ day.label }}
        </span>

        <!-- Date number -->
        <span
          class="text-xl font-semibold leading-none mb-2"
          :class="[day.isToday || day.isWorkDay ? 'text-white' : 'text-white/25']"
        >
          {{ day.dateNum }}
        </span>

        <!-- Work day dot -->
        <div
          class="w-1.5 h-1.5 rounded-full mb-2"
          :style="day.isWorkDay ? { backgroundColor: primaryColor } : { backgroundColor: 'transparent' }"
        />

        <!-- Room -->
        <span
          class="text-[10px] text-center leading-tight"
          :class="day.isWorkDay ? 'text-white/50' : 'text-white/20'"
        >
          {{ day.schedule.room.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Collaborator } from '~/types/collaborator'

const props = defineProps<{
  collaborator: Collaborator
}>()

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

const DAY_KEYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

const today = new Date().toISOString().split('T')[0]
const primaryColor = computed(() => props.collaborator.company[0]?.primary_color ?? '#753BBD')

const dayCards = computed(() =>
  DAY_KEYS.map((key, i) => {
    const schedule = props.collaborator.schedule[key]
    return {
      key,
      label: DAY_LABELS[i],
      isWorkDay: props.collaborator[key] as boolean,
      schedule,
      dateNum: parseInt(schedule.day.split('-')[2]),
      isToday: schedule.day === today,
    }
  })
)

const weekRange = computed(() => {
  const start = new Date(props.collaborator.schedule.first_day_of_week + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
  return `${fmt(start)} – ${fmt(end)}`
})
</script>
