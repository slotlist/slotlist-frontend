<template>
  <div class="row">
    <div class="col-sm-4 text-center">
      <b-btn @click="refreshCalendarMissions()">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
    <div class="col-sm-4">
      <b-btn-group>
        <b-btn variant="primary" @click="changeMonth(-1)">
          <i class="fa fa-angle-left" aria-hidden="true"></i> {{ $t('calendar.month.previous') }}
        </b-btn>
        <b-btn variant="secondary" @click="changeMonth(0)">
          <i class="fa fa-angle-down" aria-hidden="true"></i> {{ $t('calendar.month.current') }}
        </b-btn>
        <b-btn variant="primary" @click="changeMonth(1)">
          {{ $t('calendar.month.next') }}
          <i class="fa fa-angle-right" aria-hidden="true"></i>
        </b-btn>
      </b-btn-group>
    </div>
    <div class="col-sm-4">
      <div class="calendar-header-month">{{ currentMonth.locale(locale).format('MMMM Y') }}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'

export default {
  props: [
    'currentMonth'
  ],
  computed: {
    locale() {
      return this.$i18n.locale
    }
  },
  methods: {
    changeMonth(direction) {
      let payload;

      if (direction === 0) {
        payload = moment().startOf('month')
      } else if (direction < 0) {
        payload = moment(this.currentMonth).subtract(1, 'month').startOf('month')
      } else {
        payload = moment(this.currentMonth).add(1, 'month').startOf('month')
      }

      this.$root.$emit('calendarMonthChanged', payload)
    },
    refreshCalendarMissions() {
      this.$store.dispatch('getCalendarMissions')
    }
  }
}
</script>

<style>
.calendar-header-month {
  text-align: center;
  font-size: 1.4em;
  font-weight: bolder;
}
</style>
