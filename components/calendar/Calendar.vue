<style lang="scss" scoped>
.datepicker {
  position: absolute;
  display: none;
  z-index: 199;
}
.datepicker[show=true] {
  display: block;
}
.add-new-fab {
  position: fixed;
  right: 1.5em;
  bottom: 1em;
  z-index: 100;
  color: #ffffff;
}
</style>


<template>
  <CalendarWrapper>
    <ReAuth></ReAuth>
    <v-row class="filterbox" no-gutters style="flex: none">
      <v-col cols="12" sm="3">
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
      <v-col cols="12" sm="3" style="text-align: center;">
        <v-text-field
        label="Suche"
        @input="delayInput($event, 300)" />
      </v-col>
      <v-col cols="12" sm="3" style="text-align: center;">
        <v-btn-toggle mandatory v-model="filter_group" >
          <v-btn value="all">Alle</v-btn>
          <v-btn value="construction">Montage</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" sm="3" style="text-align: right;">
        <v-btn @click="$refs.CalendarGrid.reload()">Refresh</v-btn>
        <v-btn-toggle mandatory v-model="calendar_type" >
          <v-btn value="day">Tag</v-btn>
          <v-btn value="week">Woche</v-btn>
          <v-btn value="month">Monat</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <CalendarGrid
      ref="CalendarGrid"
      class="calendar-main-grid"
      data-app
      :searchPhrase="search_phrase"
      :currentDate="currentDate"
      :type="calendar_type"
      :filterGroup="filter_group"
      @addNewEventBySelection="openNewTask"
      @storeItem="storeItem"
      @deleteItem="deleteItem" />
    <v-btn @click="$refs.CalendarGrid.startSelectionNewEvent()" class="add-new-fab" fab color="#1976D2">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <NewEventDialog ref="newEventDialog" :item="newItem" @storeItem="storeItem" />
  </CalendarWrapper>
</template>



<script>
import NewEventDialog from './NewEventDialog'
import CalendarWrapper from './CalendarWrapper.vue'
import CalendarGrid from './CalendarGrid.vue'
import ReAuth from '~/components/auth/ReAuth.vue'
import {convertToLocalISOString} from './date_column_convertion'

export default {
  components: {
    CalendarWrapper,
    CalendarGrid,
    ReAuth,
    NewEventDialog
  },

  data() {
    return {
      show: false,
      showNewEventDialog: false,
      currentDate: new Date().toISOString().substr(0, 10),
      calendar_type: "week",
      filter_group: "construction",
      search_phrase: "",
      newItem: {"user": {}, "task":{"members": []}}
    }
  },

  computed: {
    currentDateLabel(){
      if(!this.currentDate || this.currentDate === undefined) return ""
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
    },
    delayInput(e, delay, search_phrase){
      if(this.timeout){
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.search_phrase = e
      }, 300)
    },
    openNewTask(data){
      this.newItem = data
      this.$refs.newEventDialog.show()
    },
    storeItem(data){
      const postData = JSON.parse(JSON.stringify(data))
      postData["item"]["begin"] = convertToLocalISOString(data.item.begin)
      postData["item"]["end"] = convertToLocalISOString(data.item.end)
      console.log(postData)
      if(data.item.id > 0){
        return this.$axios
          .put(`/calendar/${data.item.id}`, postData["item"]).then(response => {
            this.loading = false
            this.$refs.CalendarGrid.reload()
          }).catch(response=>{
            this.loading = false
          })
      }else{
        return this.$axios
          .post(`/calendar/`, postData["item"]).then(response => {
            this.loading = false
            this.$refs.CalendarGrid.reload()
          }).catch(response=>{
            this.loading = false
          })
      }
    },
    deleteItem(data){
      if(data.item.id > 0){
        return this.$axios
          .delete(`/calendar/${data.item.id}`).then(response => {
            this.loading = false
            this.$refs.CalendarGrid.reload()
          }).catch(response=>{
            this.loading = false
          })
      }
    }
  }
}
</script>
