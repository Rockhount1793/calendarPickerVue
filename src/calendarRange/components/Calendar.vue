<template>
  <div ref="calendarRef" :class="['vue-calendar w-full relative select-none', disabled ? 'vue-calendar--disabled':'']">
    <!-- input -->
    <CalendarInput
      v-if="showInputCalendar"
      :placeholder="placeholder"
      :check-in="checkIn"
      :check-out="checkOut"
      :day-format="dayFormat"
      @open-calendar="openCalendar"
      @clear-dates="clearDates"
    />

    <!-- body -->
    <div v-if="showCalendar" class="z-20 p-1 right-0 absolute mt-1 border border-gray-300 rounded-md bg-white left-auto">

      <!--<button
        @click="paginateToTodayDesktop(today)"
      >
          {{ t("today") }}
      </button>-->
      <div class="flex justify-between">

        <div class="w-[360px]">

          <CalendarHeader
            :active-index="activeIndex"
            :months="months"
            @paginate="paginate"
          />

          <div class="grid grid-cols-2 gap-2">
            <div v-for="month in slicedMonths" 
              :key="month.monthKey" class="calendar_wrap_month"
              @mouseleave="()=>hoveringDay = null "
            >

              <!-- header -->
              <CalendarDays :locale="locale" />

              <!-- body -->
              <div class="grid grid-cols-7">
                <div 
                  v-for="day in month.days" 
                  :key="day.formatDay"
                  :class="['calendar_day-wrap relative h-6 w-6', inDisabledDay(day) ? 'calendar_day-wrap--disabled':'']"
                  @mouseenter="defineHoveringData(day)"
                >

                  <button
                    v-if="day.belongsToThisMonth"
                    type="button"
                    :style="day.style"
                    :class="[
                      // Basic style
                      'calendar_day w-full left-0 right-0 h-full ring-1 ring-white absolute focus:outline-none overflow-hidden flex items-center z-5',
                      // Today
                      (formatToday === day.formatDay) ? 'calendar_day--today':'',
                      // CheckIn
                      (format(checkIn, formattingFormat) === format(day.date, formattingFormat)) ? 'calendar_day--checkIn':'',
                      // CheckOut
                      (format(checkOut, formattingFormat) === format(day.date, formattingFormat)) ? 'calendar_day--checkOut':'',

                      // Booking date
                      isInBookingDates(day) ? 'calendar_day--booking':'',

                      // resaltado entre selección 
                      hoveringDates.includes(day.formatDay) ? 'calendar_day--hovering':'',
                      // resaltado entre selección actual
                      getDatesBetweenTwoDatesDiff(checkIn, checkOut) >= 2 && datesBetweenCheckInCheckOutDates.includes(day.formatDay) ? 'calendar_day_between--checkIn-checkOut':'',
                      // hover en actual selección día
                      (hoveringDay && hoveringDay.date === day.date) ? 'calendar_day--hovering-checkIn':'',

                    ]"
                    :data-testid="`day-${format(day.date, formattingFormat)}`"
                    @click="dayClicked(day, $event)"
                  >
                    <!-- día CheckIn -->
                    <CalendarHalfDay
                      v-if="format(checkIn, formattingFormat) === format(day.date, formattingFormat)"
                      :day="day"
                      is-check-in
                    />

                    <!-- día CheckOut -->
                    <CalendarHalfDay
                      v-if="format(checkOut, formattingFormat) === format(day.date, formattingFormat)"
                      :day="day"
                      is-check-out
                    />

                    <!-- día Booking in-->
                    <CalendarHalfDay
                      v-if="isInFlattenBookingDates(day) && isInCheckinHalfDayAndCheckin(day)"
                      :booking-style="bookingStyle"
                      :day="day"
                      is-check-in
                    />

                    <!-- día Booking out-->
                    <CalendarHalfDay
                      v-if="isInFlattenBookingDates(day) && isInCheckoutHalfDay(day)"
                      :booking-style="bookingStyle"
                      :day="day"
                      is-check-out
                    />

                    <p class="calendar_day--day-number absolute text-center w-full text-ui-gray-strong font-light text-xs">
                      {{ day.dayNumber }}
                    </p>
                  </button>

                </div>
              </div>

            </div>
          </div>

        </div>
        
        <slot name="customT" ></slot>
        
      </div>

    </div>
  </div>
</template>

<script setup lang="js">

import { computed, ref, onBeforeMount, onUnmounted, provide, watch, watchEffect, toRef } from "vue"
import { dayjs, format, formatUtc, getMonth, getYear } from "../plugins/day"

import CalendarDays from "./CalendarDays.vue"
import CalendarHalfDay from "./CalendarHalfDay.vue"
import CalendarHeader from "./CalendarHeader.vue"
import CalendarInput from "./CalendarInput.vue"

import {
  addDays,
  convertHexToRGBA,
  getDatesBetweenTwoDates,
  getDatesBetweenTwoDatesDiff,
  getMonthDiff,
  isDateAfter,
  isDateBefore,
  substractDays,
  validateDateBetweenTwoDates,
} from "./helpers"

import {
  useBookingStyle,
  useCheckIncheckOutHalfDay,
  useCreateHalfDayDates,
  useCreateMonth,
  useCreateMultipleMonths,
  useFlatBooking,
  useToggleCalendar,
} from "./compose"

const props = defineProps({
  alwaysVisible: { type: Boolean,default: false },
  bookedDates: { type: Array, default: () => [] },
  bookingColor: { type: Object, default: () => ({}) },
  bookingDates: { type: Array,default: () => [] },
  checkIn: { type: [Date, String],default: null },
  checkOut: { type: [Date, String],default: null },
  disabled: { type: Boolean,default: false },
  endDate: { type: Date, default: new Date(new Date().getFullYear(),11,1) },
  formatDate: { type: String, default: "YYYY-MM-DD" },
  locale: { type: String, default: "es" },
  placeholder: { type: Object, default: () => ({ checkIn: "inicio",checkOut: "fin"}) },
  position: { type: String, default: "left" },
  showInputCalendar: { type: Boolean, default: true },
  startDate: { type: Date, default: new Date(new Date().getFullYear()-1, 0, 1) },
  translations: {
    type: Object,
    default: () => ({
      es: {
        days: {
          monday: "Lu",
          tuesday: "Ma",
          wednesday: "Mi",
          thursday: "Ju",
          friday: "Vi",
          saturday: "Sa",
          sunday: "Do"
        }
      }
    })
  },  
  timezone: { type: String, default: "America/Bogota" }
})

dayjs.tz.setDefault(props.timezone)
dayjs.locale(props.locale)

const t = (key, minimumDuration = null) => {

  const translation = props.translations[props.locale]
  if (key.includes(".")) {
    const a = key.split(".")
    const translationValue = translation[a[0]][a[1]]

    if (translationValue.includes("||")) {
      const translationPlurial = translationValue.split("||")

      if (minimumDuration === 1) {
        return translationPlurial[0].replace(
          "%{minimumDuration}",
          minimumDuration,
        )
      }

      return translationPlurial[1].replace(
        "%{minimumDuration}",
        minimumDuration,
      )
    }

    if (translationValue.includes("%{minimumDuration}")) {
      return translationValue.replace("%{minimumDuration}", minimumDuration)
    }

    return translationValue
  } else {
    return translation[key]
  }
}

provide("t",t)

const emits = defineEmits([
  "clear-dates",
  "close-date-picker",
  "render-next-date",
  "render-previous-date",
  "select-booking-date",
  "update:checkIn",
  "update:checkOut"
])

const activeIndex = ref(0)
const formattingFormat = ref("YYYY-MM-DD")
const hoveringDates = ref([])
const hoveringDay = ref(null)
const months = ref([])
const nextDisableBookingDate = ref(null)
const today = ref(new Date())

const calculIndex = (date) => {
  const todayMonth = getMonth(date)
  const currentYear = getYear(date)
  const startYear = getYear(props.startDate)
  const numberOfYears = currentYear - startYear > 0 ? currentYear - startYear : 0

  const numberOfMonth = numberOfYears * 12 + todayMonth
  return numberOfMonth
}

// ir a fecha de actual selección
const paginateToTodayDesktop = (date) => {
  const numberOfMonth = calculIndex(new Date(date))
  activeIndex.value = numberOfMonth
}

if (props.checkIn && props.checkOut) {
  paginateToTodayDesktop(props.checkIn)
} else {
  paginateToTodayDesktop(today.value)
}

// Current month of the current day
months.value.push(useCreateMonth(props.startDate))

// Next 12 month after the current day
const multipleMonths = useCreateMultipleMonths(props.startDate, getMonthDiff(props.startDate, props.endDate))

months.value.push(...multipleMonths)

const {
  addClickOusideListener,
  calendarRef,
  closeCalendar,
  openCalendar,
  removeClickOusideListener,
  showCalendar,
  toggleCalendar,
} = useToggleCalendar(props)

const bookingDatesT = toRef(props,"bookingDates")
const bookedDatesT = toRef(props,"bookedDates")
const bookingColorT = toRef(props,"bookingColor")

const disabledDates = computed(() => {
  return useCreateHalfDayDates(
    bookingDatesT.value,
    bookedDatesT.value,
    bookingColorT.value,
    formattingFormat,
  ).disabledDates
})

const flatBookingDates = computed(() => {
  return useFlatBooking(
    bookingDatesT.value,
    bookingColorT.value,
    formattingFormat,
  )
})

let checkIncheckOutHalfDay = ref({})
  
checkIncheckOutHalfDay = useCheckIncheckOutHalfDay(
  bookingDatesT.value,
  bookedDatesT.value,
)

const bookingStyle = computed(() => {
  return useBookingStyle(
    bookingDatesT.value,
    bookingColorT.value,
    formattingFormat,
    checkIncheckOutHalfDay,
  )
})

const currentYear = computed(() => {
  return months.value[activeIndex.value].yearKey
})

const paginate = (operator) => {
  const count = 1

  if (activeIndex.value > 0 && operator === "-"){
    activeIndex.value -= count
    emits("render-previous-date", currentYear.value)
  }
  if (operator === "+"){
    activeIndex.value += count
    emits("render-next-date", currentYear.value)
  }
}

const datesBetweenCheckInCheckOutDates = computed(() => {
  if (props.checkIn && props.checkOut) {
    return getDatesBetweenTwoDates(
      addDays(props.checkIn, 1),
      substractDays(props.checkOut, 1),
      formattingFormat.value,
    )
  }

  return []
})

// Watch checkIn and checkOut props dates
const checkInDate = toRef(props,"checkIn")
const checkOutDate = toRef(props,"checkOut")

watch([checkInDate, checkOutDate], () => {
  if (!checkInDate.value && !checkOutDate.value){
    hoveringDates.value = []
    hoveringDay.value = null
    nextDisableBookingDate.value = null
  }
})

const slicedMonths = computed(() => {
  return months.value.slice(activeIndex.value, 2 + activeIndex.value)
})

const formatToday = computed(() => {
  return format(today.value, formattingFormat.value)
})

// Methods

const dayFormat = (date) => {
  return format(date,props.formatDate)
}

const inDisabledDay = (day) => {
  return (
    (props.checkIn && !props.checkOut && isDateBefore(day.date, props.checkIn)) ||
    (disabledDates.value.value.includes(day.formatDay) && !checkIncheckOutHalfDay.value[day.formatDay]) ||
    (props.checkIn && nextDisableBookingDate.value && isDateAfter(day.date, nextDisableBookingDate.value))
  )
}

// Hovering data
const defineHoveringData = (day) => {
  hoveringDay.value = day

  if (props.checkIn && !props.checkOut) {
      hoveringDates.value = getDatesBetweenTwoDates(
      props.checkIn,
      hoveringDay.value.date,
      formattingFormat.value,
    )
  }
}

const setCheckIn = (day) => {
    emits("update:checkIn", day.formatDay)
    hoveringDates.value = []
}

const setCheckOut = (day) => {
  emits("update:checkOut", day.formatDay)
  hoveringDates.value = []
}

// Trigger each time the click on day is triggered
const dayClicked = (day,e) => {
  if (getSelectedBooking(day)) {
    emits("select-booking-date",day,getSelectedBooking(day))
  }

  if (isInBookingDates(day)) return

  if((props.checkIn && !props.checkOut) || (isInBookingDates(day) && isInCheckinHalfDayAndCheckin(day) && props.checkIn)){
    // CheckIn + !ChecKout
    setCheckOut(day)
    nextDisableBookingDate.value = null
    hoveringDay.value = null
    closeCalendar()
  } else if (!props.checkIn) {
    // CheckIn
    setCheckIn(day)
  } else {
    // CheckIn + CheckOut
    setCheckIn(day)
    emits("update:checkOut", null)
  }
  
}

const isInFlattenBookingDates = (day) => {
  return flatBookingDates.value.value.some((x) => x.value.includes(day.formatDay))
}

const isInBookingDates = (day) => {
  return ( day.belongsToThisMonth && isInFlattenBookingDates(day) && !isInCheckoutHalfDay(day))
}

const isInCheckinHalfDayAndCheckin = (day) => {
  return (
    Boolean(props.checkIn) &&
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn)
  )
}

const isInCheckoutHalfDay = (day) => Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkOut)

const getSelectedBooking = (day) => {
  // If day is between checkInDate and checkOutDate of a Booking
  if (bookingDatesT.value.some((d) => validateDateBetweenTwoDates(d.checkInDate, d.checkOutDate, day.formatDay))){
    return {
      ...bookingDatesT.value.find((d) =>
        validateDateBetweenTwoDates(
          d.checkInDate,
          d.checkOutDate,
          day.formatDay,
        )
      ),
      ...getBooking(day)
    }
  }

  return null
}

const getBooking = (day) => {
  if ( flatBookingDates.value.value.some((b) => b.value.includes(day.formatDay)) && day.belongsToThisMonth){
    const flatBooking = flatBookingDates.value.value.find((b) => b.value.includes(day.formatDay))
    if (flatBooking) { return flatBooking }
  }
  return null
}

const closeDatePicker = () => {
  closeCalendar()
  emits("close-date-picker")
}

const clearDates = () => {
  emits("update:checkIn",null)
  emits("update:checkOut",null)
  emits("clear-dates")
}

onBeforeMount(() => {
  addClickOusideListener()
})

onUnmounted(() => {
  removeClickOusideListener()
})

defineExpose({
  activeIndex,
  clearDates,
  closeCalendar,
  closeDatePicker,
  openCalendar,
  showCalendar,
  toggleCalendar,
})

watchEffect(() => {
  months.value.forEach((m) => {
    m.days.forEach((day) => {
      const bookingColor = bookingStyle.value.value[day.formatDay]
      day.style = {
        background: !checkIncheckOutHalfDay.value[day.formatDay] ? convertHexToRGBA(bookingColor,50) : "",
      }
    })
  })
})

watch(showCalendar,(newValue,oldValue)=>{
  if (newValue && props.checkIn && props.checkOut) {
    paginateToTodayDesktop(props.checkIn) 
  }
})

</script>

<style>
.vue-calendar {
  --calendar-half-day-color: #757575;
  --calendar-text-color: #202020;
  --day-border: #fff;
  --day-disabled: #aaa;
  --day-hovering-with-checkIn: #8ebbbb;
  --day-range-days: #daebeb;
  --day-today: #264646;
  --day-checkIn-checkOut: #8ebbbb;
}

.vue-calendar .calendar_day-wrap--disabled {
  @apply pointer-events-none;
}

.vue-calendar .calendar_day-wrap--disabled .calendar_day--booking {
  @apply pointer-events-auto line-through;
}
/* detalle hoy */
.vue-calendar .calendar_day--today:after {
  content: "";
  @apply block w-1 h-1 rounded-full absolute bottom-0.5 left-0 right-0 mx-auto;
  background-color: var(--day-today);
}

.vue-calendar .calendar_day--hovering:not(.calendar_day--checkIn),
.vue-calendar .calendar_day_between--checkIn-checkOut {
  background-color: var(--day-range-days);
}

.vue-calendar .calendar_day-in-half-day--checkIn .calendar_day--day-number,
.vue-calendar
  .calendar_day-in-half-day--checkOut:not(.calendar_day--checkIn)
  .calendar_day--day-number {
  @apply font-bold;
  color: var(--calendar-half-day-color);
}
.vue-calendar .calendar_day--checkIn--single {
  background-color: var(--day-range-days);
}
.vue-calendar
  .calendar_day--hovering-checkIn:not(.calendar_day-in-half-day--checkIn) {
  background-color: var(--day-hovering-with-checkIn);
}
.vue-calendar
  .calendar_day--hovering-checkIn .calendar_day-in-half-day--checkIn {
  background-color: var(--day-hovering-with-checkIn);
}

.vue-calendar
  .calendar_day-wrap--disabled
  .calendar_day:not(.calendar_day--booking)
  .calendar_day--day-number {
  @apply pointer-events-none line-through;
  color: var(--day-disabled);
}
.vue-calendar
  .calendar_day-wrap--disabled
  .calendar_day.calendar_day--booking
  .calendar_day--day-number {
  @apply pointer-events-none ;
}

.vue-calendar .calendar_day--in-period .calendar_day--day-number {
  @apply pointer-events-none;
  color: var(--day-disabled);
}

/* detalle linea media */
.vue-calendar .calendar_wrap_month:first-child {
  @apply relative
  after:h-[calc(100%+1.5rem)]
  after:w-px
  after:bg-gray-200
  after:absolute
  after:bottom-0
  after:left-[calc(100%+0.2rem)]
}
</style>