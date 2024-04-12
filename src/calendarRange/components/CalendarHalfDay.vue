<template>
  <i
    :style="setHalfDayStyle(day.formatDay)"
    :class="[
      'w-[200%] h-[200%] absolute transform rotate-45',
      isCheckIn ? 'calendar_day_haldDay--checkIn':'',
      isCheckOut ? 'calendar_day_haldDay--checkOut':''
    ]"
  />
</template>

<script setup lang="js">

const props = defineProps({
  bookingStyle: {
    type: Object,
    default: null
  },
  day: {
    type: Object,
    required: true
  },
  isCheckIn: {
    type: Boolean,
    required: false
  },
  isCheckOut: {
    type: Boolean,
    required: false
  }
})

const setHalfDayStyle = (formatDay) => {

  const key = props.isCheckIn ? "checkIn" : "checkOut"

  if (props.bookingStyle) {
    const bookingColor = props.bookingStyle.value[formatDay]

    if (
      bookingColor &&
      typeof bookingColor === "object" &&
      (bookingColor.checkIn || bookingColor.checkOut)
    ) {
      return {
        background: bookingColor[key],
        border: "1px solid white",
      }
    } else if (typeof bookingColor === "string") {
      return {
        background: bookingColor,
        border: "",
      }
    }
  }

  return {
    background: "",
    border: "",
  }
}

</script>

<style scoped>
/* Half day */
.vue-calendar .calendar_day_haldDay--checkIn {
  top: 0px;
  right: -140%;
  background: var(--day-disabled);
}
.vue-calendar .calendar_day_haldDay--checkOut {
  top: -140%;
  right: 0;
  background: var(--day-disabled);
}
.vue-calendar .calendar_day--checkIn .calendar_day_haldDay--checkIn {
  background: var(--day-checkIn-checkOut);
}
.vue-calendar .calendar_day--checkOut .calendar_day_haldDay--checkOut {
  background: var(--day-checkIn-checkOut);
}
</style>
