<style lang="scss" scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>


<template>
  <Calendar class="main-content" />
</template>



<script>
import Calendar from '~/components/calendar/Calendar.vue'

export default {
  components: {
    Calendar
  }
}
</script>
