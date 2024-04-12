<template>
  <div class="flow-root text-ui-primary h-5">
    <div class="float-left h-5 flex items-center">
      <button
        type="button"
        :disabled="activeIndex === 0"
        class="calendar_header-left-button"
        @click="paginate('-')"
      >
        <base-icon name="chevronLeft" />
      </button>

      <p class="text-xs font-semibold leading-5 px-2 capitalize">{{ prevMonth }}</p>
    </div>

    <div class="float-right h-5 flex items-center">
      <p class="text-xs font-semibold px-2 capitalize">{{ nextMonth }}</p>

      <button
        type="button"
        :disabled="activeIndex >= months.length - 2"
        class="calendar_header-right-button"
        @click="paginate('+')"
      >
        <base-icon name="chevronRight" />
      </button>
    </div>
  </div>
</template>

<script setup lang="js">

import { computed } from "vue"
import BaseIcon from "./BaseIcon.vue"
const emit = defineEmits(["paginate"])

const props = defineProps({
  activeIndex: {type: Number,default:0},
  months: { type: Array, default:()=>{ return []}}
})

const prevMonth = computed(() => {
  if (props.months[props.activeIndex]?.monthName) {
    return props.months[props.activeIndex].monthName
  }

  throw new Error(
    `Month name not found with index: ${
      props.activeIndex
    } and month: ${JSON.stringify(props.months)}`,
  )
})

const nextMonth = computed(() => {
  return props.months[props.activeIndex + 1].monthName
})

const paginate = (operator) => emit("paginate",operator)

</script>
