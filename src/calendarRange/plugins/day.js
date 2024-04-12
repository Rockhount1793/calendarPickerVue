import { default as dayjs } from "dayjs"
import { default as isBetween } from "dayjs/plugin/isBetween"
import { default as isSameOrAfter } from "dayjs/plugin/isSameOrAfter"
import { default as isSameOrBefore } from "dayjs/plugin/isSameOrBefore"
import { default as timezone } from "dayjs/plugin/timezone"
import { default as weekday } from "dayjs/plugin/weekday"
import { default as utc } from "dayjs/plugin/utc"

import "dayjs/locale/es"

dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)
dayjs.extend(weekday)
dayjs.extend(timezone)

// Format DayJs
const format = (date,format) => {
  const d = dayjs(date)
  return d.format(format)
}

const getMonth = (date) =>dayjs(date).month()
const getYear = (date) => dayjs(date).year()
const formatUtc = (date) =>dayjs(date).format()
const formatDateUtc = (date) => dayjs(date).toDate()

const isAfter = (time1,time2) => {
  const d1 = dayjs(time1)
  const d2 = dayjs(time2)
  return d1.isAfter(d2,"day")
}

const isAfterOrEqual = (time1,time2) => {
  const d1 = dayjs(time1)
  const d2 = dayjs(time2)
  // return d1 => d2;
  return d1.isSameOrAfter(d2,"day")
}

const isBefore = (time1, time2) => {
  const d1 = dayjs(time1)
  const d2 = dayjs(time2)
  return d1.isBefore(d2, "day")
}

const isBeforeOrEqual = (time1,time2) => {
  const d1 = dayjs(time1)
  const d2 = dayjs(time2)
  return d1.isSameOrBefore(d2,"day")
}

const getDateDiff = (time1,time2,type) => {
  const d1 = dayjs(time1)
  const d2 = dayjs(time2)
  return Math.abs(d1.diff(d2, type))
}

const isBetweenDate = (fromDate,toDate,givenDate,orEqual = false,) => {
  const d1 = dayjs(fromDate)
  const d2 = dayjs(toDate)
  const d3 = dayjs(givenDate)
  if (orEqual) {
    return dayjs(d3).isBetween(d1,d2,"day","[)")
  }
  return dayjs(d3).isBetween(d1,d2,"day")
}

const addDate = (date,quantity,type,) => {
  const d = dayjs(date)
  return d.add(quantity, type).toDate()
}

const subtractDate = (date,quantity,type)=> {
  const d = dayjs(date)
  return d.subtract(quantity, type).toDate()
}

const getNextDate = (date, index) => {
  const d = dayjs(date)
  if (d.day() >= index) {
    return d.add(7, "day").day(index).toDate()
  }
  return d.day(index).toDate()
}

const getDatesBetweenTwoDatesDiff = (startDate,endDate,) => {
  const d1 = dayjs(startDate)
  const d2 = dayjs(endDate)
  return getDateDiff(d1.toDate(), d2.toDate(),"day")
}

const getDatesBetweenTwoDates = (startDate,endDate,formattingFormat) =>{
  const d1 = dayjs(startDate)
  const d2 = dayjs(endDate)
  const lenghDifference = getDateDiff(d1.toDate(), d2.toDate(),"day")
  const arr = []
  for (let index = 0; index < lenghDifference + 1; index++){
    const day = d1.add(index, "day").format(formattingFormat)
    arr.push(day)
  }
  return arr
}

// Month
const getFirstDayOfMonth = (date) =>dayjs(date).startOf("month").toDate()
const getFirstDayOfFirstWeekOfMonth = (date) =>dayjs(date).startOf("month").weekday(0).format("YYYY-MM-DD");
const getNextMonth = (date) =>dayjs(date).add(1, "month").startOf("month").toDate()

// Add days
const getDaysArray = (start,end)=> {
  const d1 = dayjs(start)
  const d2 = dayjs(end)
  const lenghDifference = getDateDiff(d1.toDate(),d2.toDate(),"day")
  const arr = []
  for (let index = 0; index < lenghDifference + 1;index++){
    const day = d1.add(index, "day").toDate()
    arr.push(day)
  }
  return arr
}

export {
  addDate,
  dayjs,
  format,
  formatDateUtc,
  formatUtc,
  getDateDiff,
  getDatesBetweenTwoDates,
  getDatesBetweenTwoDatesDiff,
  getDaysArray,
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
  getMonth,
  getNextDate,
  getNextMonth,
  getYear,
  isAfter,
  isAfterOrEqual,
  isBefore,
  isBeforeOrEqual,
  isBetweenDate,
  subtractDate,
}
