
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
  background: red;
  height: 100%;
}
.swimlane__item__content .drag-after {
  content: ' ';
  display: none;
  position: absolute;
  right: -1em;
  top: 0;
  width: 1em;
  background: red;
  height: 100%;
}
/*.swimlane__item__content:hover .drag-before,
.swimlane__item__content:hover .drag-after {
  display: block;
}*/
</style>


<template>
  <div :class="classDefinition" :style="gridColumns">
    <div class="swimlane__item__content" @click="dialog = true">
      <div class="drag-before">&nbsp;</div>
      <div class="boundary">
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
      <div class="drag-after" draggable="true" @dragstart="drag">&nbsp;</div>
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
            <v-btn dark text v-if="item.task">
              <a  :href="'https://keso.bitrix24.de/company/personal/user/1/tasks/task/view/' + item.task.remote_id + '/'" target="blank">Aufgabe</a>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
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
        </v-card-text>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>

export default {

  props: ['boundary', 'maxColumn', 'item', 'team', 'member', 'type', 'dragoverIndex'],

  data(){
    return {
      gridColumns: "",
      isDragged: false,
      dialog: false
    }
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
        + this.item.end)
    },
    commentHtml(){
      if(!this.item) return ""
      return this.item.comment.replace(/(?:\r\n|\r|\n)/g, '<br>')
    }
  },

  watch: {
    dragoverIndex(){
      if(!this.isDragged) return
      const begin = new Date(this.item.begin);
      const end = new Date(this.item.end);
      let endColumn = (this.convertTimeToGrid(end))
      if(this.type == "month"){
        endColumn = endColumn + 1
      }
      this.gridColumns = (
          "grid-column: " + this.convertTimeToGrid(begin) + " / " + this.dragoverIndex + ";" +
          "grid-row: " + this.item.row_index + " / " + this.item.row_index + ";"
        )
    },
    combinedProps: {
      immediate: true,
      handler() {
        const begin = new Date(this.item.begin);
        const end = new Date(this.item.end);
        let endColumn = (this.convertTimeToGrid(end))
        if(this.type == "month"){
          endColumn = endColumn + 1
        }
        this.gridColumns = (
          "grid-column: " + this.convertTimeToGrid(begin) + " / " + endColumn + ";" +
          "grid-row: " + this.item.row_index + " / " + this.item.row_index + ";"
        )
      }
    }
  },
  methods: {
    drag(e){
      this.isDragged = true
      this.gridColumns = this.gridColumns + "; "
      e.dataTransfer.setData("teamLabel", this.team.label);
      e.dataTransfer.setData("memberId", this.member.id);
      e.dataTransfer.setData("eventId", this.item.id);
    },
    convertTimeToGrid(date){
      if (date < this.boundary["begin"]){
        return 1;
      }
      if (date > this.boundary["end"]){
        return this.maxColumn + 1;
      }
      if(this.type == "week"){
        return this.convertTimeToGridForWeek(date)
      }
      if(this.type == "month"){
        return this.convertTimeToGridForMonth(date)
      }
      return this.convertTimeToGridForDay(date)
    },
    convertTimeToGridForDay(date){
      let base = ((date.getHours() - 6) * 4) + 1;
      if (base < 1){
        base = 1;
      }
      let extra = 0;
      if(date.getMinutes() > 0){
        extra = 1;
      }
      if(date.getMinutes() > 15){
        extra = 2;
      }
      if(date.getMinutes() > 30){
        extra = 3;
      }
      if(date.getMinutes() > 45){
        extra = 4;
      }
      if (base + extra > 56){
        base = 56;
      }
      return base + extra;
    },
    convertTimeToGridForWeek(date){
      let base = date.getDay();
      if (base < 1){
        base = 7;
      }
      return base;
    },
    convertTimeToGridForMonth(date){
      let base = date.getDate();
      return base;
    }
  }
}
</script>
