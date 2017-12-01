<template>
  <div class="calendar-body">
    <div class="calendar-weeks-header">
      <span class="calendar-week-header" v-for="day in 7" :key="day">{{ localizedWeekDay(day - 1) }}</span>
    </div>
    <div class="calendar-dates">
      <calendar-week v-for="week in weeks" :key="week" :week="week"></calendar-week>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'
import CalendarWeek from './CalendarWeek.vue'

export default {
  components: {
    CalendarWeek
  },
  computed: {
    currentMonth() {
      return this.$store.getters.missionCalendarCurrentMonth
    },
    firstDayOfWeek() {
      return moment().locale(this.locale).localeData().firstDayOfWeek()
    },
    locale() {
      return this.$i18n.locale
    },
    missions() {
      return this.$store.getters.missionsForCalendar
    },
    weeks() {
      const momentIterator = moment(this.currentMonth).locale(this.locale)
      const startOfMonth = moment(momentIterator.startOf('month'))

      momentIterator.subtract(startOfMonth.day(), 'days')

      if (startOfMonth.day() < this.firstDayOfWeek) {
        momentIterator.subtract(7, 'days')
      }

      momentIterator.add(this.firstDayOfWeek, 'days')

      const startDate = moment(momentIterator)
      const daysInMonth = momentIterator.daysInMonth()

      const weeks = []
      _.times(5, () => {
        const week = []
        _.times(7, (dayIndex) => {
          const day = {
            isToday: momentIterator.isSame(moment(), 'day'),
            isCurrentMonth: momentIterator.isSame(this.currentMonth, 'month'),
            isWeekend: moment(momentIterator).isoWeekday() >= 6,
            date: moment(momentIterator)
          }

          week.push(day)
          momentIterator.add(1, 'day')
        })

        weeks.push(week)
      })

      const diff = daysInMonth - weeks[4][6].date.format('D')

      if (diff > 0 && diff < 3) {
        const week = []
        _.times(7, (dayIndex) => {
          const day = {
            isToday: momentIterator.isSame(moment(), 'day'),
            isCurrentMonth: momentIterator.isSame(this.currentMonth, 'month'),
            isWeekend: moment(momentIterator).isoWeekday() >= 6,
            date: moment(momentIterator)
          }

          week.push(day)
          momentIterator.add(1, 'day')
        })

        weeks.push(week)
      }

      const endDate = moment(momentIterator.subtract(1, 'day').endOf('day'))

      if ((_.isNil(this.$store.getters.missionsForCalendar) || _.isNil(this.$store.getters.missionsForCalendarRefreshSetInterval)) && !this.$store.getters.refreshingMissionsForCalendar) {
        this.$store.dispatch('getMissionsForCalendar', {
          autoRefresh: true,
          startDate,
          endDate
        })
      }

      return weeks
    }
  },
  methods: {
    getMissionsForDay(day) {
      if (_.isNil(this.missions) || _.isEmpty(this.missions)) {
        return []
      }

      return _.filter(this.missions, (mission) => {
        return day.isSame(moment(mission.startTime), 'day')
      })
    },
    localizedWeekDay(day) {
      return moment().locale(this.locale).localeData().weekdaysShort()[(this.firstDayOfWeek + day) % 7]
    }
  }
}
</script>

<style>
.calendar-body {
  margin-top: 20px;
}

.calendar-dates {
  position: relative;
}

.calendar-week-header {
  flex: 1;
  padding: 5px;
  text-align: center;
  border-right: 1px solid #e0e0e0;
}

.calendar-weeks-header {
  display: flex;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
}
</style>
