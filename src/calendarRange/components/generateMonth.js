import {
  format,
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
  getNextMonth,
} from "../plugins/day"

import { useCreateMonth } from "./compose/useCreateMonth"

const getMonthName = (day) => {
  const currentMonth = format(day, "MMMM")
  const currentYear = format(day, " YYYY")
  return `${currentMonth} ${currentYear}`
}

const createMultipleMonth = (dates) => {
  const months = []
  for (let d = 0; d < dates.length; d++) {
    const currentDate = dates[d]
    months.push(useCreateMonth(currentDate))
  }

  return months
}

export {
  createMultipleMonth,
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
  getMonthName,
  getNextMonth,
}
