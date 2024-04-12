import { isBetweenDate } from "../../plugins/day"

export const useGetPeriod = (periodDates,date)=> {
  if (periodDates.value.length > 0) {
    return periodDates.value.find((p) => {
      return isBetweenDate(p.startAt, p.endAt, date, true)
    })
  }

  return undefined
}
