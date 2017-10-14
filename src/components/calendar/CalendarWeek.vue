<template>
  <div class="calendar-week-row">
    <calendar-day v-for="day in week" :key="day" :day="day"></calendar-day>
  </div>
</template>

<script>
import CalendarDay from './CalendarDay.vue'

export default {
  components: {
    CalendarDay
  },
  props: [
    'week'
  ],
}
</script>

<style>
.calendar-week-row {
  width: 100%;
  border-left: 1px solid #e0e0e0;
  display: flex;
}
</style>
