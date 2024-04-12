import { createMultipleMonth, getNextMonth } from "../generateMonth"
import { formatDateUtc } from "../../plugins/day"

export const useCreateMultipleMonths = (date, max) => {
  let nextMonth = formatDateUtc(date)
  const dates = []

  for (let countMonth = 0; countMonth < max; countMonth++) {
    const tempNextMonth = getNextMonth(nextMonth)

    dates.push(tempNextMonth)
    nextMonth = tempNextMonth
  }

  return createMultipleMonth(dates)
}
