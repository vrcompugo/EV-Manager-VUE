<style lang="scss" scoped>
.datepicker {
  position: absolute;
  display: none;
  z-index: 199;
}
.datepicker[show=true] {
  display: block;
}
</style>


<template>
  <CalendarWrapper>
    <v-row class="filterbox" no-gutters style="flex: none">
      <v-col cols="12" sm="6">
        <v-btn @click="show = !show">{{ currentDateLabel }}</v-btn>
        <v-date-picker
          class="datepicker"
          :show="show"
          v-model="currentDate"
          show-week
          color="#1976D2"
          locale="de-de"
          first-day-of-week=1
          reactive
          @input="show = !show"
        ></v-date-picker>
      </v-col>
      <v-col cols="12" sm="6" style="text-align: right;">
        <v-btn-toggle mandatory v-model="calendar_type" >
          <v-btn value="day">Tag</v-btn>
          <v-btn value="week">Woche</v-btn>
          <v-btn value="month">Monat</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <CalendarGrid class="calendar-main-grid" data-app :currentDate="currentDate" :type="calendar_type" :filterGroup="filter_group" />
  </CalendarWrapper>
</template>



<script>
import CalendarWrapper from '~/components/calendar/CalendarWrapper.vue'
import CalendarGrid from '~/components/calendar/CalendarGrid.vue'

export default {
  auth: false,

  components: {
    CalendarWrapper,
    CalendarGrid
  },

  data() {
    return {
      show: false,
      currentDate: new Date().toISOString().substr(0, 10),
      calendar_type: "week",
      filter_group: "all"
    }
  },

  computed: {
    currentDateLabel(){
      if(!this.currentDate) return ""
      const currentDate = new Date(this.currentDate)
      const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      return "KW " + this.getWeekNumber() + " - " + currentDate.toLocaleDateString('de-DE', options)
    }
  },

  methods: {
    getWeekNumber(){
      if(!this.currentDate) return ""
      var d = new Date(this.currentDate);
      var dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    }
  }
}
</script>
