import { ref } from "vue"
import { getDatesBetweenTwoDates } from "../helpers"

export const useBookingStyle = (bookingDates,bookingColor,formattingFormat,checkIncheckOutHalfDay)=>{
  
  const bookingStyle = ref({})
  const bookingTypeAndDates = {}

  bookingDates.forEach((booking) => {
    
    const flatBookingDatesString = ref(
      getDatesBetweenTwoDates(
        booking.checkInDate,
        booking.checkOutDate,
        formattingFormat.value,
      ),
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

  const setBookingStyle = (key,day) => {
    if (
      checkIncheckOutHalfDay.value[day]?.checkIn &&
      checkIncheckOutHalfDay.value[day]?.checkOut
    ) {
      const checkInType = bookingDates.find((x) => x.checkInDate === day)?.type || ""
      const checkOutType = bookingDates.find((x) => x.checkOutDate === day)?.type || ""

      return {
        checkIn: checkInType in bookingColor ? bookingColor[checkInType] : "#000",
        checkOut: checkInType in bookingColor ? bookingColor[checkOutType] : "#000",
      }

    } else {
      return bookingColor[key] || "#000000"
    }
  }

  objectArray.forEach(([key, value]) => {
    value.forEach((day) => {
      bookingStyle.value[day] = setBookingStyle(key, day)
    })
  })

  return bookingStyle

}
