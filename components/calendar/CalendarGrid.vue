<template>
  <div :class="'calendar-type-' + this.type">
    <div class="maingrid maingrid--header">
      <div class="team__header">{{ selectionLabel }}</div>
      <div class="swimlane swimlane--header" :style="`grid-template-columns: repeat(${maxColumn}, 1fr);`">
        <span
          v-for="n in maxColumn"
          :key="'h' + n"
          :style="`grid-column: ${n}; grid-row: 1/1;`"
          class="swimlane__header__content"><div style="position: absolute">{{ columnLabel(n) }}</div></span>
        <div
          v-for="n in maxColumn"
          :key="'hh' + n"
          :style="'grid-column: ' + n"
          :class="'swimlane__column ' + columnClass(n)">&nbsp;</div>
      </div>
    </div>
    <div class="maingrid" v-for="team in teams" :key="team.label">
      <div class="team__header">{{ team.label }}</div>
      <div class="swimlane swimlane--group-header" :style="`grid-template-columns: repeat(${maxColumn}, 1fr);`">
        <div
          v-for="n in maxColumn"
          :key="team.label + n"
          :style="'grid-column: ' + n"
          :class="'swimlane__column ' + columnClass(n)">&nbsp;</div>
      </div>
      <div class="maingrid" v-for="member in team.members" :key="team.label + member.id">
        <div class="team__member">{{ member.name }}</div>
        <div class="swimlane" :style="`grid-template-columns: repeat(${maxColumn}, 1fr); grid-template-rows: repeat(${member.max_rows}, 3.2em);`">
          <CalendarItem
            class="calendar-item"
            :maxColumn="maxColumn"
            :type="type"
            :boundary="boundary"
            v-for="item in member.events"
            :key="team.label + member.id + '-' + item.id"
            :item="item"
            :team="team"
            :member="member"
            :ref="'CalendarItem-' + team.label + member.id + '-' + item.id"
            :dragoverIndex="dragoverIndex"
            @dragover="ignoreDrag" />
          <div
            v-for="n in maxColumn"
            :key="team.label + member.id + n"
            :style="'grid-column: ' + n"
            :class="'swimlane__column ' + columnClass(n)"
            @dragover="dragover($event, n)"
            @drop="drop($event, n)">&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>

import CalendarItem from '~/components/calendar/CalendarItem.vue'
import axios from 'axios'

export default {

  components: {
    CalendarItem
  },

  props: ['currentDate', 'type', 'filterGroup', 'searchPhrase'],

  data() {
    return {
      teams: [],
      boundary: {},
      dragoverIndex: undefined
    }
  },
  computed: {
    typeDate(){
      return this.type + this.currentDate + this.filterGroup + ' ' + this.searchPhrase
    },
    selectionLabel(){
      if (!this.type) return ""
      if (!this.currentDate) return ""
      const currentDate = new Date(this.currentDate);
      switch(this.type) {
        case 'day':
          return currentDate.toLocaleDateString('de-DE', {
            weekday: "long",
            year: 'numeric',
            month: 'long',
            day: 'numeric' })
        case 'week':
          return "KW " + this.getWeekNumber()
        case 'month':
          return currentDate.toLocaleDateString('de-DE', {
            weekday: undefined,
            year: 'numeric',
            month: 'long',
            day: undefined })
      }
    },
    maxColumn() {
      if (!this.type) return 0
      switch(this.type) {
        case 'day': return 57;
        case 'week': return 7;
        case 'month':
          if (!this.boundary.begin || this.boundary.begin === undefined) return 0
          const begin = new Date(this.boundary.begin);
          let last_day = new Date(begin.getFullYear() + "-" + ("00" + (begin.getMonth() + 2)).slice(-2) + "-01")
          last_day.setDate(0)
          return last_day.getDate()
      }
    }
  },
  watch: {
    typeDate: {
      immediate: true,
      handler() {
        this.teams = []
        this.boundary = {}
        this.$axios
          .get(`/calendar/?filter_group=${this.filterGroup}&type=${this.type}&date=${this.currentDate}&search_phrase=${this.searchPhrase}`)
          .then(response => {
            this.teams = response["data"]["data"]
            if(response["data"]["boundary"]["begin"] !== undefined){
              response["data"]["boundary"]["begin"] = response["data"]["boundary"]["begin"].replace(" ", "T")
            }
            if(response["data"]["boundary"]["end"] !== undefined){
              response["data"]["boundary"]["end"] = response["data"]["boundary"]["end"].replace(" ", "T")
            }
            this.boundary = {
              "begin": new Date(response["data"]["boundary"]["begin"]),
              "end": new Date(response["data"]["boundary"]["end"])
            }
          })
      }
    }
  },
  methods: {
    ignoreDrag(e){
      return true
    },
    dragover(e, index){
      if(index != this.dragoverIndex){
        this.dragoverIndex = index
      }
      e.preventDefault()
    },
    drop(e, index){
    },
    columnLabel(index) {
      if (!this.type) return ""
      switch(this.type) {
        case 'day':
          if((index-1) % 4 == 0){
            return (((index - 1) / 4) + 6) + ":00"
          }
          return "";
        case 'week':
          if (!this.boundary.begin || this.boundary.begin === undefined) return ""
          const currentDate = new Date(this.boundary.begin);
          currentDate.setDate(currentDate.getDate() + index - 1)
          const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
          return currentDate.toLocaleDateString('de-DE', options)


          const weekdays = ["", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa.", "So."]
          const begin = new Date(this.boundary.begin);
          begin.setDate(begin.getDate() + index - 1)
          return weekdays[index] + " " + ('0' + begin.getDate()).slice(-2) + '.' +
            ('0' + (begin.getMonth() + 1)).slice(-2) +
            "." + begin.getFullYear()
        case 'month': return index
      }
    },
    columnClass(index){
      const activeClass = "swimlane__column--bordered"
      const weekendClass = "swimlane__column--weekend"
      if (!this.type) return ""
      switch(this.type) {
        case 'day':
          if((index-1) % 4 == 0){
            return activeClass
          }
          return "";
        case 'week':
          let cssClass = activeClass
          if(index >= 6){
            cssClass = cssClass + " " + weekendClass
          }
          return cssClass
        case 'month':
          if(!this.currentDate) return ""
          var d = new Date(this.currentDate);
          var currentDay = new Date(d.getUTCFullYear(), d.getMonth(), index);
          if(currentDay.getDay() == 1){
            return activeClass
          }
          if(currentDay.getDay() == 0 || currentDay.getDay() == 6){
            return weekendClass
          }
          return "";
      }
    },
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
