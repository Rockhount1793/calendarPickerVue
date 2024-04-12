import { getDatesBetweenTwoDates } from "../helpers"

export const useGetFlattenedPeriods = (periodDates,period,formattingFormat) => {
  if (
    periodDates.value.length > 0 && periodDates.value.some((p) => p.periodType === period)) {
    return [
      ...new Set(
        periodDates.value
          .filter((p) => p.periodType === period)
          .map((p) => {
            return getDatesBetweenTwoDates( p.startAt,p.endAt,formattingFormat)
          })
          .flat()
      ),
    ]
  }

  return []
}
