<template>
  <div class="pl-5 flex items-end">

    <button
      class="px-4 py-3 bg-red-200"
      @click="toggleCalendar"
    >
      Mostrar Calendario 1
    </button>

    <div class="flex-1">
      <p>inicio : {{ checkIn }}</p>
      <p>finalización : {{ checkOut }}</p>
    </div>

    <div class="w-auto flex items-center">
      <calendar
        ref="calendarRef"
        v-model:checkIn="checkIn"
        v-model:checkOut="checkOut"
        :booking-color="bookingColor"
        :booking-dates="bookingDates"
        :placeholder="placeholder"
        @select-booking-date="selectBookingDate"
        @toggle-calendar="toggleCalendar"
        format-date="DD-MM-YYYY"
        position="right"
      >
        <template #customT >
          <div class="px-2">
            <div class="border-l py-1 border-ui-gray-secondary w-24 px-1 text-sm font-medium text-ui-gray-strong">
              <ul>
                <li v-for="(range,index) in rangesDates">
                  <h5 class="leading-4 flex-none">
                    {{ range.text }}
                  </h5>
                  <hr v-if="index === 3" />
                </li>
              </ul>
            </div>
          </div>
        </template>
      </calendar>

    </div>
    
  </div>
</template>

<script lang="js">
import { defineComponent, ref } from 'vue'
import { Calendar } from './calendarRange/index'

export default defineComponent({
  name:"testdefault",
  components:{ Calendar },
  setup(){

    const calendarRef = ref(null)

    const bookingColor = ref({
      type1: "#BFD3D9",
      type2: "#ACBA77",
      type3: "#ACB2EE",
      type4: "#E1BB84",
      type5: "#D8BFD9",
      type6: "#BFB380",
      type7: "#DC9898",
    })

    const bookingDates = ref([
      {
        checkInDate: "2023-07-01",
        checkOutDate: "2023-07-10",
        type: "type1",
      },
      {
        checkInDate: "2023-07-10",
        checkOutDate: "2023-07-20",
        type: "type2",
      },
      {
        checkInDate: "2023-07-20",
        checkOutDate: "2023-07-30",
        type: "type3",
      },
      {
        checkInDate: "2023-08-01",
        checkOutDate: "2023-08-20",
        type: "type4",
      },
      {
        checkInDate: "2023-10-01",
        checkOutDate: "2023-10-20",
        type: "type5",
      },
      {
        checkInDate: "2023-10-20",
        checkOutDate: "2023-10-30",
        type: "type6",
      },
      {
        checkInDate: "2023-11-01",
        checkOutDate: "2023-11-12",
        type: "type7",
      },
    ])

    const checkIn = ref("2024-03-10")
    const checkOut = ref("2024-03-28")

    const placeholder = {
      checkIn: "Inicio",
      checkOut: "Fin",
    }

    const toggleCalendar = () => {
      calendarRef.value?.toggleCalendar()
    }
    
    const selectBookingDate = (day, booking) => {
      console.log("select range mod",day, booking)
    }
    
    const rangesDates = [
      {'id':1,'enable':false,'text':'Ult. Día', 'callback': ()=>{}},
      {'id':2,'enable':false,'text':'Ult. Semana', 'callback': ()=>{}},
      {'id':3,'enable':false,'text':'Ult. Mes', 'callback': ()=>{}},
      {'id':4,'enable':false,'text':'Ult. Trimestre', 'callback': ()=>{}},
      {'id':5,'enable':false,'text':'Q1. Ene-Mar', 'callback': ()=>{}},
      {'id':6,'enable':false,'text':'Q2. Abr-Jun', 'callback': ()=>{}},
      {'id':7,'enable':false,'text':'Q3. Jul-Sep', 'callback': ()=>{}},
      {'id':8,'enable':false,'text':'Q4. Oct-Dic', 'callback': ()=>{}}
    ] 

    return{
      Calendar,
      rangesDates,
      bookingColor,
      calendarRef,
      bookingDates,
      checkIn,
      checkOut,
      placeholder,
      toggleCalendar,
      selectBookingDate
    }

  }
})

</script>

