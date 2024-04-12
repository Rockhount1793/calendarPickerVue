<template>
  <div class="flex justify-between items-center w-auto">
    <button type="button" class="bg-red-200 h-4 flex items-center w-full" @click="openCalendar">

        <div class="flex items-center space-x-2">
          <p class="">
            <span v-if="checkIn">{{ dayFormat(checkIn) }}</span>
            <span v-else>{{ placeholder.checkIn }}</span>
          </p>
          <base-icon
            name="arrowRight"
            :size="1"  
          />
          <p class="">
            <span v-if="checkOut">{{ dayFormat(checkOut) }}</span>
            <span v-else>{{ placeholder.checkOut }}</span>
          </p>
        </div>

    </button>

    <base-icon v-if="checkIn" name="close" :size="1" @click="clearDates" />

  </div>
</template>

<script setup lang="js">
import BaseIcon from "./BaseIcon.vue"
const emit = defineEmits(["clear-dates", "open-calendar"])

defineProps({
  checkIn: {
    type: [Date,String],
    default: null
  },
  checkOut: {
    type: [Date,String],
    default: null
  },
  dayFormat: {
    type: Function,
    required: true
  },
  placeholder: {
    type: Object,
    required: true
  }
})

const openCalendar = () => emit("open-calendar")
const clearDates = () => emit("clear-dates")

</script>

<style>
.vue-calendar .calendar_input {
  background-color: var(--calendar-input-bg);
  border-color: var(--calendar-input-border);
  @apply flex items-center h-[50px] px-4 cursor-pointer border justify-between;
}
.vue-calendar .calendar_input-left-part {
  @apply w-full flex items-center h-full;
}
.vue-calendar .calendar_input-calendar {
  @apply mr-2;
}
.vue-calendar .calendar_input-calendar--checkIn {
  @apply text-gray-700;
}

.vue-calendar .calendar_input-text {
  @apply flex items-center m-0;
}
.vue-calendar .calendar_input-text--hasnt-checkIn,
.vue-calendar .calendar_input-calendar--hasnt-checkIn,
.vue-calendar .calendar_input-arrowRight--hasnt-checkIn {
  color: #aaa;
}
.vue-calendar .calendar_input-text--checkIn {
  @apply text-gray-700;
}

.vue-calendar .calendar_input-arrowRight {
  @apply mx-4;
}
.vue-calendar .calendar_input-arrowRight--checkIn {
  @apply text-gray-700;
}
</style>
