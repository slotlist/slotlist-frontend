<template>
  <div>
    <table class="table table-striped" v-if="missionSlotRegistrations">
      <thead>
        <tr>
          <th :style="playerColumnWidth">Player</th>
          <th style="width: 35%" v-show="isMissionEditor">Comment</th>
          <th style="width: 24%">Registered</th>
          <th style="width: 1%">Confirmed</th>
          <th style="width: 10%" class="text-center" v-show="isMissionEditor">Actions</th>
        </tr>
      </thead>
      <tbody>
        <mission-slot-registrations-row v-for="registration in missionSlotRegistrations" :registration="registration" :key="registration.uid"></mission-slot-registrations-row>
      </tbody>
      <tfoot v-show="missionSlotRegistrations.length >= 10">
        <tr>
          <th :style="playerColumnWidth">Player</th>
          <th style="width: 35%" v-show="isMissionEditor">Comment</th>
          <th style="width: 24%">Registered</th>
          <th style="width: 1%">Confirmed</th>
          <th style="width: 10%" class="text-center" v-show="isMissionEditor">Actions</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import MissionSlotRegistrationsRow from './MissionSlotRegistrationsRow.vue'

export default {
  components: {
    MissionSlotRegistrationsRow
  },
  computed: {
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    missionSlotRegistrations() {
      return this.$store.getters.missionSlotRegistrations
    },
    playerColumnWidth() {
      return this.isMissionEditor ? 'width: 30%' : 'width: 75%'
    },
  }
}
</script>
