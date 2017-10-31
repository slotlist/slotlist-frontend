<template>
  <div class="calendar-day" :class="{'calendar-day-today': day.isToday, 'calendar-day-current-month': day.isCurrentMonth, 'calendar-day-weekend': day.isWeekend, 'calendar-day-selected': isDaySelected}">
    <div class="row">
      <div class="col">
        <p class="calendar-day-number">{{ day.date.format('D') }}</p>
      </div>
    </div>
    <div>
      <calendar-mission v-for="mission in missionsForDay" :key="mission.uid" :mission="mission"></calendar-mission>
    </div>
  </div>
</template>

<script>
import CalendarMission from './CalendarMission.vue'
import moment from 'moment-timezone'

export default {
  components: {
    CalendarMission
  },
  props: [
    'day'
  ],
  computed: {
    isDaySelected() {
      return false
    },
    missions() {
      return this.$store.getters.missionsForCalendar
    },
    missionsForDay() {
      if (_.isNil(this.missions) || _.isEmpty(this.missions)) {
        return []
      }

      return _.filter(this.missions, (mission) => {
        return this.day.date.isSame(moment(mission.startTime), 'day')
      })
    }
  }
}
</script>

<style>
.calendar-day {
  flex: 1;
  min-height: 112px;
  padding: 4px;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  background: rgba(147, 147, 147, 0.1);
}

.calendar-day-current-month {
  background: #ffffff;
}

.calendar-day-current-month .calendar-day-number {
  color: rgba(0, 0, 0, .5);
  font-size: 1em;
}

.calendar-day-number {
  text-align: right;
  color: rgba(0, 0, 0, 0.25);
  font-size: 0.75em;
}

.calendar-day-today {
  background-color: #ebf9ea;
}

.calendar-day-today .calendar-day-number {
  font-size: 1.25em;
  font-weight: bold;
  color: #367016;
}

.calendar-day-weekend .calendar-day-number {
  color: rgba(210, 2, 2, 0.6);
}
</style>
