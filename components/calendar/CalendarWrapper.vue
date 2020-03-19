<style lang="scss">
.maingrid {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-column: 1/end;
}
.filterbox,
.maingrid--header {
  position: fixed;
  width: 100%;
  top: 0;
  background: #ffffff;
  z-index: 180;
}
.filterbox {
  height: 4em;
}
.maingrid--header {
  position: -webkit-sticky;
  position: sticky;
  top: 4em;
  height: 1.8em;
  color: #ffffff;
  background: #1976D2;
  box-shadow: 0 0 3px 0 rgba(0,0,0,0.5);
}
.calendar-main-grid {
  padding-top: 4em;
}
.swimlane__header,
.swimlane {
  grid-column-start: 2;
}
.team__header,
.team__member {
  grid-column-start: 1;
  border-bottom: 1px solid #c3c3c3;
}
.team__member {
  padding-left: 1em;
}
.swimlane {
  display: grid;
  grid-template-columns: repeat(56, 1fr);
  position: relative;
  min-height: 3.2em;
}
.swimlane--header,
.swimlane--group-header {
  min-height: 0;
}
.swimlane__column {
  border-left: 1px solid rgb(228, 228, 228);
  border-bottom: 1px solid #c3c3c3;
  padding: 0.2em;
  grid-row: 1 / last-line;
}
.swimlane .swimlane__column:nth-last-child(7n+2){
  border-left: 1px solid rgb(176, 176, 176);
}
.calendar-type-day .swimlane--header.swimlane > span:last-of-type > div {
  text-align: right;
  right: 0;
}
.swimlane__header__content {
  padding-left: 0.2em;
}
.swimlane--header .swimlane__column {
  border-bottom: 1px solid rgb(176, 176, 176);
}
.swimlane__item {
  position: relative;
  color: #ffffff;
}
.swimlane__item__content {
  position: absolute;
  background-color: #757575;
  width: 100%;
  top: 0.1em;
  padding: 0.1em 0.2em;
  box-shadow: 1px 2px 4px rgba(0,0,0,0.5);
}
.item--is-dragged .swimlane__item__content {
  z-index: -1;
}
.swimlane__item {
  &.item--service .swimlane__item__content { background-color: #43A047;}
  &.item--construction .swimlane__item__content { background-color: #1E88E5;}
  &.item--eeg .swimlane__item__content { background-color: #9C27B0;}
  &.item--electric .swimlane__item__content { background-color: #E53935;}
  &.item--heating .swimlane__item__content { background-color: #FB8C00;}
  &.item--interal .swimlane__item__content { background-color: #FFEB3B; color: #333;}
}
</style>

<template>
  <div>
    <slot></slot>
  </div>
</template>


<script>
export default {
}
</script>
