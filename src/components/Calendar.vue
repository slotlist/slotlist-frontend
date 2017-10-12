<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header">
          <h3>{{ $t('calendar.title') }}</h3>
        </div>
        <div class="card-block">
          <calendar-header :currentMonth="currentMonth"></calendar-header>
          <calendar-body :currentMonth="currentMonth"></calendar-body>
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
  created: function() {
    this.missionListFilter = this.$store.getters.missionListFilter

    this.$root.$on('calendarMonthChanged', (payload) => {
      this.currentMonth = payload
    })
  },
  data() {
    return {
      currentMonth: moment().startOf('month'),
      missionListFilter: []
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  },
  watch: {
    missionListFilter(val) {
      this.$store.dispatch('filterMissionList', val)
    }
  }
}
</script>
