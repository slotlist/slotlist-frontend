<template>
  <b-popover :content="missionPopoverContent" :triggers="['hover']">
    <div class="card card-inverse calendar-mission" :class="{'card-primary': !mission.isAssignedToAnySlot && !mission.isRegisteredForAnySlot, 'card-info': !mission.isAssignedToAnySlot && mission.isRegisteredForAnySlot, 'card-success': mission.isAssignedToAnySlot}" @click="redirectToMissionDetails">
      <div class="card-header calendar-mission-title">{{ mission.title }}</div>
    </div>
  </b-popover>
</template>

<script>
import moment from 'moment-timezone'

export default {
  props: [
    'mission'
  ],
  computed: {
    missionPopoverContent() {
      let content = `<span><strong>${this.mission.title}</strong><br>${this.$t('mission.startTime')} ${moment(this.mission.startTime).format('LT')}<br>${this.$t('mission.endTime')} ${moment(this.mission.endTime).format('LT')}`
      if (!this.mission.isAssignedToAnySlot && this.mission.isRegisteredForAnySlot) {
        content += `<br>${this.$t('mission.list.slot.status.registered')}</span>`
      } else if (this.mission.isAssignedToAnySlot) {
        content += `<br>${this.$t('mission.list.slot.status.assigned')}</span>`
      } else {
        content += `</span>`
      }

      return content
    }
  },
  methods: {
    redirectToMissionDetails() {
      this.$router.push({ name: 'missionDetails', params: { missionSlug: this.mission.slug } })
    }
  }
}
</script>

<style>
.calendar-mission {
  margin-bottom: 5px;
}

.calendar-mission>.calendar-mission-title {
  padding: 0px 5px;
  font-size: 12px;
}
</style>
