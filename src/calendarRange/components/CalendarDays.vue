<template>
  <ul class="grid grid-cols-7 py-0.5">
    <li v-for="day in days" :key="day.key" class="text-xs text-ui-gray-strong text-center">
      {{ t(`days.${day.name}`) }}
    </li>
  </ul>
</template>

<script setup lang="js">
import { computed, ref, inject } from "vue"

const props = defineProps({
  locale: { type: String, required: true}
})

const t = inject("t",(key) => ({}))

const days = [
  { key: 1, name: "monday" },
  { key: 2, name: "tuesday" },
  { key: 3, name: "wednesday" },
  { key: 4, name: "thursday" },
  { key: 5, name: "friday" },
  { key: 6, name: "saturday" },
  { key: 0, name: "sunday" }
]

</script>
