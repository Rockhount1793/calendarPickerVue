import { format, formatDateUtc } from "../../plugins/day"
import { addDays } from "../helpers"

import { isDateBeforeOrEqual, validateDateBetweenTwoDates } from "../helpers"

const validateDateBeforeDate = (fromDate,givenDate) => {
  return isDateBeforeOrEqual(givenDate, fromDate)
}

const useGetNextBookingDate = (bookingDates,date) => {
  if (bookingDates.value.length > 0) {
    const nextDateFormatted = format(addDays(date, 1), "YYYY-MM-DD");
    const nextBooking = bookingDates.value.find(
      (booking) =>
        validateDateBeforeDate(booking.checkInDate, nextDateFormatted) ||
        validateDateBetweenTwoDates(
          booking.checkInDate,
          booking.checkOutDate,
          nextDateFormatted,
        ),
    )

    if (nextBooking && nextBooking.checkInDate){
      return formatDateUtc(nextBooking.checkInDate)
    }
  }

  return null
}

export { useGetNextBookingDate }
