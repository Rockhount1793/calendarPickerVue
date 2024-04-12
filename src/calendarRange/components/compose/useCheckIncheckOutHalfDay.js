import { ref } from "vue"
import { getDayDiff, sortDates } from "../helpers"

const createHalfDayDatesWithBookedDates = (dates) => {
  
  const checkIncheckOutHalfDay = ref({})
  const bookedDates = ref(sortDates([...dates]))

  for (let i = 0; i < bookedDates.value.length; i++) {
    const newDate = bookedDates.value[i]
    const newDateIncrementOne = bookedDates.value[i + 1]

    if (i === 0) {
      checkIncheckOutHalfDay.value[newDate] = {
        checkIn: true,
      }
    }

    if (
      !checkIncheckOutHalfDay.value[newDate] &&
      bookedDates.value[i + 1] &&
      getDayDiff(newDate, newDateIncrementOne) > 1
    ){
      checkIncheckOutHalfDay.value[newDate] = {
        checkOut: true,
      }
      checkIncheckOutHalfDay.value[newDateIncrementOne] = {
        checkIn: true,
      }
    }

    if (i === bookedDates.value.length - 1) {
      checkIncheckOutHalfDay.value[newDate] = {
        checkOut: true,
      }
    }
  }

  return {
    bookedDates,
    checkIncheckOutHalfDay,
  }
}

export const useCheckIncheckOutHalfDay = (bookingDates,bookedDatesProps)=>{

  const checkIncheckOutHalfDay = createHalfDayDatesWithBookedDates(bookedDatesProps).checkIncheckOutHalfDay

  const uniqBookings = bookingDates.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.checkInDate === current.checkInDate)) { accumulator.push(current) }
    return accumulator
  },[])

  uniqBookings.forEach((booking) => {
    if (!checkIncheckOutHalfDay.value[booking.checkInDate]) {
      checkIncheckOutHalfDay.value[booking.checkInDate] = { checkIn: true }
    } else {
      checkIncheckOutHalfDay.value[booking.checkInDate] = { checkOut: true, checkIn: true }
    }

    if (!checkIncheckOutHalfDay.value[booking.checkOutDate]) {
      checkIncheckOutHalfDay.value[booking.checkOutDate] = { checkOut: true }
    } else {
      checkIncheckOutHalfDay.value[booking.checkOutDate] = { checkOut: true, checkIn: true }
    }
  })

  return checkIncheckOutHalfDay
}
