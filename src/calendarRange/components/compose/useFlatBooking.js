import { ref } from "vue"
import { getDatesBetweenTwoDates } from "../helpers"

export const useFlatBooking = (bookingDates,bookingColor,formattingFormat) => {
  const flatBookingDates = ref([])
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

  objectArray.forEach(([key, value]) => {
    flatBookingDates.value.push({
      color: bookingColor[key] || "#000000",
      key,
      value,
    })
  })

  return flatBookingDates
}
