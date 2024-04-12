import { ref, watch } from "vue"

export const useToggleCalendar = (props) => {

  const showCalendar = props.alwaysVisible ? ref(true) : ref(false)
  const calendarRef = ref(null)
  const ignoreOutsideClick = ref(false)

  const handleClickOutside = (event) => {
    const ignoredElement = calendarRef.value

    if (showCalendar.value && !ignoreOutsideClick.value) {
      if (ignoredElement) {
        const target = event.target
        const isIgnoredElementClicked = ignoredElement.contains(target)

        if (!isIgnoredElementClicked) {
          showCalendar.value = false
        }
      }
    } else {
      ignoreOutsideClick.value = false
    }
  }

  const addClickOusideListener = () => {
    if (props.alwaysVisible === false) {
      document.addEventListener("click", handleClickOutside, false)
    }
  }

  const removeClickOusideListener = () => {
    if (props.alwaysVisible === false) {
      document.removeEventListener("click", handleClickOutside)
    }
  }

  const openCalendar = () => {
    ignoreOutsideClick.value = true
    showCalendar.value = true
  }
  
  const closeCalendar = () => {
    if (props.alwaysVisible === false) {
      ignoreOutsideClick.value = true
      showCalendar.value = false
    }
  }

  const toggleCalendar = () => {
    ignoreOutsideClick.value = true
    showCalendar.value = !showCalendar.value
  }

  watch(() => props.alwaysVisible,(newVal) => {
      if (newVal) {
        removeClickOusideListener()
        openCalendar()
      } else {
        addClickOusideListener()
      }
  })

  return {
    addClickOusideListener,
    calendarRef,
    closeCalendar,
    openCalendar,
    removeClickOusideListener,
    showCalendar,
    toggleCalendar
  }
}
