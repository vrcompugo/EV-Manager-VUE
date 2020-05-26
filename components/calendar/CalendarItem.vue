
<style lang="scss" scoped>

.swimlane__item {
  position: relative;
  color: #ffffff;
  display: flex;
}
.swimlane__item__content {
  position: absolute;
  background-color: #757575;
  color: #ffffff;
  top: 0.1em;
  width: 100%;
  padding: 0.1em 0.2em;
}
.swimlane__item__content .boundary {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.swimlane__item__content a {
  color: inherit;
}
.swimlane__item {
  &.item--service .swimlane__item__content { background-color: #43A047;}
  &.item--pv_construction .swimlane__item__content { background-color: #1E88E5;}
  &.item--roof_construction .swimlane__item__content { background-color: #1E88E5;}
  &.item--pv_roof_construction .swimlane__item__content { background-color: #1E88E5;}
  &.item--eeg .swimlane__item__content { background-color: #9C27B0;}
  &.item--electric_construction .swimlane__item__content { background-color: #E53935;}
  &.item--heating_construction .swimlane__item__content { background-color: #FB8C00;}
  &.item--salesstats .swimlane__item__content { background-color: #FFEB3B; color: #333;}
  &.item--interal .swimlane__item__content { background-color: #FFEB3B; color: #333;}
}
.v-toolbar .v-btn a {
  color: #ffffff;
  text-decoration: none;
}
.swimlane__item__content .drag-before {
  content: ' ';
  display: none;
  position: absolute;
  left: -1em;
  top: 0;
  width: 1em;
  background: #9E9E9E;
  height: 100%;
  z-index: 180;
  cursor: w-resize;
}
.swimlane__item__content .drag-after {
  content: ' ';
  display: none;
  position: absolute;
  right: -1em;
  top: 0;
  width: 1em;
  background: #9E9E9E;
  height: 100%;
  z-index: 180;
  cursor: w-resize;
}
.swimlane__item__content .drag-move {
  content: ' ';
  display: none;
  position: absolute;
  left: 0;
  top: -1.4em;
  height: 1.4em;
  width: 1.4em;
  background: #9E9E9E;
  z-index: 180;
  text-align: center;
  cursor: move;
}
.swimlane__item__content:hover .drag-move,
.swimlane__item__content:hover .drag-before,
.swimlane__item__content:hover .drag-after {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
}
.swimlane__item__content svg {
  fill: #ffffff;
  width: 20px;
  height: 20px;
}
</style>


<template>
  <div :class="classDefinition" :style="gridColumns">
    <div class="swimlane__item__content">
      <div class="drag-before" @mousedown="startDragBefore" v-if="withinBoundary('before')">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </div>
      <div class="drag-move" @click="startDragMove">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M15.54 5.54L13.77 7.3 12 5.54 10.23 7.3 8.46 5.54 12 2zm2.92 10l-1.76-1.77L18.46 12l-1.76-1.77 1.76-1.77L22 12zm-10 2.92l1.77-1.76L12 18.46l1.77-1.76 1.77 1.76L12 22zm-2.92-10l1.76 1.77L5.54 12l1.76 1.77-1.76 1.77L2 12z"/><circle cx="12" cy="12" r="3"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </div>
      <div class="boundary" @click="dialog = true">
        <small>
          <span v-if="item.customer">
            {{ item.customer.company }}
            {{ item.customer.firstname }}
            {{ item.customer.lastname }}
            -
          </span>
          {{ item.location }}&nbsp;
        </small>
        <div>
          {{ item.label }}&nbsp;
        </div>
      </div>
      <div class="drag-after" @mousedown="startDragAfter" v-if="withinBoundary('after')">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="600" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="#1976D2">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="color: white;">{{ item.label }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text v-if="item.customer">
              <a :href="`https://keso.bitrix24.de/crm/contact/details/${item.bitrix_contact_id}/`" target="blank">Kunde</a>
            </v-btn>
            <v-btn text v-if="item.order">
              <a :href="`https://keso.bitrix24.de/crm/deal/details/${item.bitrix_order_id}/`" target="blank">Auftrag</a>
            </v-btn>
            <v-btn dark text v-if="item.task && item.task.remote_id">
              <a :href="'https://keso.bitrix24.de/company/personal/user/1/tasks/task/view/' + item.task.remote_id + '/'" target="blank">Aufgabe</a>
            </v-btn>
            <v-btn icon dark @click="enterEditMode()">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <div v-if="!editmode">
            <br>
            <p v-if="item.firstname || item.lastname || item.street">
              <small>Kunde:</small><br>
              <span v-if="item.company">{{ item.company }}<br></span>
              <span v-if="item.firstname || item.lastname">{{ item.firstname }} {{ item.lastname }}<br></span>
              {{ item.street }} {{ item.street_nb }}<br>
              {{ item.zip }} {{ item.city }}<br>
              <br>
            </p>
            <p>
              <small>Beschreibung:</small><br>
              <span v-html="commentHtml"></span>
            </p>
          </div>
          <div v-if="editmode">
            <EventForm :item="editItem"></EventForm>
            <br>
            <hr>
            <br>
            <div style="text-align: right">
              <v-btn @click="editmode = false">
                Abbrechen
              </v-btn>
              <v-btn @click="save()" color="#1976D2" style="color: #ffffff">
                Speichern
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>

import {convertDateToColumn, convertEventToColumns} from './date_column_convertion'
import EventForm from './EventForm'

export default {

  props: ['boundary', 'maxColumn', 'item', 'team', 'member', 'type', 'dragoverIndex'],

  data(){
    return {
      gridRow: "",
      gridColumns: "",
      isDragged: false,
      dialog: false,
      editmode: false,
      editItem: {"user": {}}
    }
  },

  components: {
    EventForm
  },

  computed: {
    classDefinition(){
      let classList = 'swimlane__item item--' + this.item.type + ' item--status-' + this.item.status
      if(this.isDragged){
        classList = classList + " item--is-dragged"
      }
      return classList
    },
    combinedProps(){
      return (this.boundary.end + "-"
        + this.maxColumn + "-"
        + this.item.id + "-"
        + this.type + "-"
        + this.item.begin + "-"
        + this.item.end + "-"
        + this.item.rowIndex)
    },
    commentHtml(){
      if(!this.item) return ""
      return this.item.comment.replace(/(?:\r\n|\r|\n)/g, '<br>')
    }
  },

  watch: {
    combinedProps: {
      immediate: true,
      handler() {
        const columns = convertEventToColumns(this.item, this.type, this.boundary, this.maxColumn)
        this.item.beginColumn = columns[0]
        this.item.endColumn = columns[1]
        this.gridColumns = (
          "grid-column: " + this.item.beginColumn + " / " + this.item.endColumn + ";" +
          "grid-row: " + (this.item.rowIndex + 1) + " / " + (this.item.rowIndex + 1) + ";"
        )
      }
    }
  },
  methods: {
    enterEditMode(){
      this.editItem = JSON.parse(JSON.stringify(this.item))
      this.editItem.begin = new Date(this.editItem.begin)
      this.editItem.end = new Date(this.editItem.end)
      this.editmode = true
    },
    save(){
      this.$emit('storeItem', {
        "item": this.editItem
      })
      this.editmode = false
    },
    withinBoundary(direction){
      if(direction === "before"){
        const boundary_begin = new Date(this.boundary["begin"])
        const item_begin = new Date(this.item.begin)
        if(item_begin < boundary_begin){
          return false
        }
      }
      if(direction === "after"){
        const boundary_end = new Date(this.boundary["end"])
        const item_end = new Date(this.item.end)
        if(item_end > boundary_end){
          return false
        }
      }
      return true
    },
    startDragMove(e){
      this.isDragged = true
      this.$emit('startMove', {
        "item": this.item,
        "element": this
      })
    },
    startDragBefore(e){
      this.isDragged = true
      const end = new Date(this.item.end);
      let endColumn = convertDateToColumn(end, this.type, this.boundary, this.maxColumn)
      if(this.type == "month" || this.type == "week"){
        endColumn = endColumn + 1
      }
      this.$emit('extendStartBefore', {
        "group": this.team.label + this.member.id,
        "item": this.item,
        "element": this,
        "drag_start": convertDateToColumn(end, this.type, this.boundary, this.maxColumn),
        "drag_start_date": end
      })
    },
    startDragAfter(e){
      this.isDragged = true
      const begin = new Date(this.item.begin);
      this.$emit('extendStartAfter', {
        "group": this.team.label + this.member.id,
        "item": this.item,
        "element": this,
        "drag_start": convertDateToColumn(begin, this.type, this.boundary, this.maxColumn),
        "drag_start_date": begin
      })
    }

  }
}
</script>
