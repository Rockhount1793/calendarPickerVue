import { ref } from "vue"

import {
  getDayDiff,
  getDatesBetweenTwoDates,
  sortDates,
  sortDatesObj,
} from "../helpers"

const createHalfDayDatesWithBookedDates = (dates)=> {

  const checkIncheckOutHalfDay = ref({})
  const bookedDates = ref(sortDates([...dates]))

  for(let i = 0; i < bookedDates.value.length; i++){
    const newDate = bookedDates.value[i]
    const newDateIncrementOne = bookedDates.value[i + 1]

    if (i === 0) {
      checkIncheckOutHalfDay.value[newDate] = { checkIn: true }
    }

    if (!checkIncheckOutHalfDay.value[newDate] && bookedDates.value[i + 1] && getDayDiff(newDate, newDateIncrementOne) > 1 ) {
      checkIncheckOutHalfDay.value[newDate] = {
        checkOut: true,
      }

      checkIncheckOutHalfDay.value[newDateIncrementOne] = {
        checkIn: true,
      }
    }

    if (i === bookedDates.value.length - 1){ checkIncheckOutHalfDay.value[newDate] = { checkOut: true } }
  }

  return {bookedDates,checkIncheckOutHalfDay}
}

const createBookingDatesWithHalfDayDates = (checkIncheckOutHalfDay,bookingDatesProps)=> {
  const bookingDates = new Set()
  let increment = 0
  const booking = {}
  Object.keys(checkIncheckOutHalfDay.value).forEach((date, i) => {
      increment = i
      if (checkIncheckOutHalfDay.value[date].checkIn) booking.checkInDate = date
      if (checkIncheckOutHalfDay.value[date].checkOut) booking.checkOutDate = date
      if (increment % 2 === 1) {
        bookingDates.add({
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
        })
      }
    }
  )
  return sortDatesObj([...bookingDatesProps, ...bookingDates])
}

export const useCreateHalfDayDates = (bookingDates,bookedDatesProps,bookingColor,formattingFormat) => {
  const disabledDates = ref([])
  // Set DisabledDates to []
  const flatBookingDates = ref([])
  // Field DisabledDates whith BookingDates
  const bookingTypeAndDates = {}

  // Create halfDay dates with booked dates
  const bookedDates = createHalfDayDatesWithBookedDates(bookedDatesProps).bookedDates;
  const checkIncheckOutHalfDay = createHalfDayDatesWithBookedDates(bookedDatesProps).checkIncheckOutHalfDay;

  // Create bookingDates with halfDay
  const newBookingDates = createBookingDatesWithHalfDayDates(
    checkIncheckOutHalfDay,
    bookingDates,
  )

  bookingDates.forEach((booking) => {
    
    checkIncheckOutHalfDay.value[booking.checkInDate] = {
      checkIn: true,
    }

    checkIncheckOutHalfDay.value[booking.checkOutDate] = {
      checkOut: true,
    }

    const flatBookingDatesString = ref(
      getDatesBetweenTwoDates(
        booking.checkInDate,
        booking.checkOutDate,
        formattingFormat.value
      )
    )

    if (booking.type) {
      if (bookingTypeAndDates[booking.type]) {
        bookingTypeAndDates[booking.type].push(...flatBookingDatesString.value)
      } else {
        bookingTypeAndDates[booking.type] = flatBookingDatesString.value
      }
    }
  })

  const objectArray = Object.entries(bookingTypeAndDates)
  objectArray.forEach(([key, value]) => {
    flatBookingDates.value.push({
      color: bookingColor[key] || "#000000",
      key,
      value,
    })
  })

  // Field DisabledDates whith BookedDates
  disabledDates.value = flatBookingDates.value.map((b) => b.value).flat()
  disabledDates.value.push(...bookedDates.value)
  disabledDates.value = sortDates(disabledDates.value)

  return {
    flatBookingDates,
    checkIncheckOutHalfDay,
    disabledDates,
    newBookingDates,
  }

}
