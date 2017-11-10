<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header">
          <h3>{{ $t('calendar.title') }}</h3>
        </div>
        <div class="card-block">
          <calendar-header></calendar-header>
          <calendar-body></calendar-body>
          <div class="small text-center" v-html="$t('mission.timezone', { timezone: timezone })"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import CalendarBody from './calendar/CalendarBody.vue'
import CalendarHeader from './calendar/CalendarHeader.vue'

export default {
  components: {
    CalendarBody,
    CalendarHeader
  },
  beforeCreate: function() {
    if (_.isNil(this.$store.getters.missionsForCalendar)) {
      this.$store.dispatch('changeMissionCalendarCurrentMonth', moment().startOf('month'))
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    timezone() {
      return this.$store.getters.timezone
    }
  }
}
</script>
