<template>
  <div :class="'calendar-type-' + this.type + ' dragmode-' + (this.dragmode ? 'on' : 'off') + ' extentionmode-' + (this.extentionmode ? 'on' : 'off')">
    <div :class="'loading-indicator ' + (this.loading ? 'active':'')">
      <v-progress-circular
        indeterminate
        color="#1976D2"
        ></v-progress-circular>
    </div>
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
            @extendStartBefore="startExtention"
            @extendStartAfter="startExtention"
            @startMove="startMoveItem"
            @storeItem="storeItem" />
          <div
            v-for="n in maxColumn"
            :key="team.label + member.id + n"
            :style="'grid-column: ' + n"
            :class="'swimlane__column ' + columnClass(n) + ' ' + columnSelection(team.label + member.id, n)"
            @mousedown="startSelection($event, team.label + member.id, n, team.label, member)"
            @mouseenter="extendSelection($event, team.label + member.id, n)"
            @mouseup="stopSelection($event, team.label + member.id, n)">&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>

import CalendarItem from '~/components/calendar/CalendarItem.vue'
import {convertColumnToDate, convertEventToColumns} from './date_column_convertion'
import axios from 'axios'

export default {

  components: {
    CalendarItem
  },

  props: ['currentDate', 'type', 'filterGroup', 'searchPhrase'],

  data() {
    return {
      loading: false,
      teams: [],
      boundary: {},
      dragoverIndex: undefined,
      extentionmode: false,
      dragmode: false,
      currentSelection: {
        "group": "",
        "drag_start": undefined,
        "from": undefined,
        "to": undefined
      },
      currentExtention: {
        "group": "",
        "drag_start": undefined,
        "item": undefined
      }
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
        this.reload()
      }
    }
  },
  methods: {
    reload(){
      this.loading = true
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
          this.loading = false
          for(let i=0;i<this.teams.length; i++){
            for(let j=0;j<this.teams[i].members.length; j++){
              this.updateRowIndex(this.teams[i].members[j])
            }
          }
        }).catch(response=>{
          this.loading = false
        })
    },
    storeItem(data){
      this.$emit('storeItem', data)
    },
    updateRowIndex(member){
      if (!member.events){
        member.max_rows = 1
        return;
      }
      member.row_maximums = [0]
      for(let j=0;j<member.events.length;j++){
        if(member.events[j].beginColumn === undefined){
          let columns = convertEventToColumns(member.events[j], this.type, this.boundary, this.maxColumn)
          member.events[j].beginColumn = columns[0]
          member.events[j].endColumn = columns[1]
        }
        for(let i=0;i<member.row_maximums.length;i++){
          if(member.events[j].beginColumn >= member.row_maximums[i]){
            member.row_maximums[i] = member.events[j].endColumn
            member.events[j].rowIndex = i
            break
          }
        }
        if(member.events[j].rowIndex === undefined){
          member.events[j].rowIndex = member.row_maximums.length
          member.row_maximums.push(member.events[j].endColumn)
        }
      }
      member.max_rows = member.row_maximums.length
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
    maxRowsMember(row_maximums){
      if(row_maximums !== undefined){
        return row_maximums.length
      }
      return 1
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
    columnSelection(group, index){
      if(this.currentSelection.group === group){
        if(this.currentSelection.from !== undefined){
          if(this.currentSelection.from <= index && index <= this.currentSelection.to){
            return "selection-active";
          }
        }
      }
      return "";
    },
    startSelectionNewEvent(){
      this.currentSelection.item = "new"
      this.dragmode = true;
    },
    startMoveItem(data){
      this.dragmode = true;
      this.currentSelection.item = data.item
      this.currentSelection.element = data.element
    },
    startSelection(e, group, index, team_label, member){
      if(this.dragmode){
        this.currentSelection.group = group
        this.currentSelection.drag_start = index
        this.currentSelection.from = index
        this.currentSelection.to = index
        this.currentSelection.team_label = team_label
        this.currentSelection.member = member
      }
    },
    extendSelection(e, group, index){
      if(this.dragmode){
        if(index > this.currentSelection.drag_start){
          this.currentSelection.to = index
        }
        if(index <= this.currentSelection.drag_start){
          this.currentSelection.to = this.currentSelection.drag_start
          this.currentSelection.from = index
        }
      }
      if(this.extentionmode){
        if(index > this.currentExtention.drag_start){
          this.currentExtention.item.end = convertColumnToDate(index, this.type, this.currentExtention.item.end)
        }
        if(index <= this.currentExtention.drag_start){
          this.currentExtention.item.end = new Date(this.currentExtention.drag_start_date)
          if(this.type === "day"){
            index = index - 1
          }
          this.currentExtention.item.begin = convertColumnToDate(index, this.type, this.currentExtention.drag_start_date)
        }
      }
    },
    stopSelection(e, group, index){
      if(this.dragmode){
        if(this.currentSelection.item){
          if(this.currentSelection.item === "new"){
            const begin_date = new Date(this.boundary.begin)
            const end_date = new Date(this.boundary.begin)
            if(this.type !== "day"){
              begin_date.setHours(9)
              end_date.setHours(18)
            }
            let begin_date_converted = convertColumnToDate(this.currentSelection.from, this.type, begin_date)
            if(this.type === "day"){
              begin_date_converted = new Date(begin_date_converted.getTime() - 900000)
            }
            this.$emit('addNewEventBySelection', {
              "user": this.currentSelection.member,
              "task": {"members": []},
              "begin": begin_date_converted,
              "end": convertColumnToDate(this.currentSelection.to, this.type, end_date),
            })
          }else{
            if(this.currentSelection.from === this.currentSelection.to){
              const beginDate = new Date(this.currentSelection.item.begin)
              let endDate = new Date(this.currentSelection.item.end)
              const delta = endDate - beginDate
              if(this.type === "day") {
                this.currentSelection.from = this.currentSelection.from - 1
              }
              this.currentSelection.item.begin = convertColumnToDate(this.currentSelection.from, this.type, this.currentSelection.item.begin)
              endDate = new Date(this.currentSelection.item.begin).getTime() + delta
              this.currentSelection.item.end = new Date(endDate)
            }else{
              this.currentSelection.item.begin = convertColumnToDate(this.currentSelection.from, this.type, this.currentSelection.item.begin)
              this.currentSelection.item.end = convertColumnToDate(this.currentSelection.to, this.type, this.currentSelection.item.end)
            }
            if(this.currentSelection.item.user_id !== this.currentSelection.member.id){
              this.currentSelection.item.user_id = this.currentSelection.member.id
            }
            this.$emit('storeItem', {
              "item": this.currentSelection.item
            })
          }
        }
        if(this.currentSelection.element){
          this.currentSelection.element.isDragged = false
        }
        this.currentSelection.group = ""
        this.currentSelection.to = undefined
        this.currentSelection.from = undefined
        this.currentSelection.item = undefined
        this.currentSelection.element = undefined
        this.dragmode = false
      }
      if(this.extentionmode){
        this.$emit('storeItem', {
          "item": this.currentExtention.item
        })
        this.extentionmode = false
        this.currentExtention.element.isDragged = false
        this.currentExtention.group = undefined
        this.currentExtention.drag_start = undefined
        this.currentExtention.item = undefined
        this.currentExtention.element = undefined
        // TODO Save changes
      }
    },
    startExtention(e){
      this.extentionmode = true
      this.currentExtention.group = e.group
      this.currentExtention.drag_start = e.drag_start
      this.currentExtention.drag_start_date = e.drag_start_date
      this.currentExtention.item = e.item
      this.currentExtention.element = e.element
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
