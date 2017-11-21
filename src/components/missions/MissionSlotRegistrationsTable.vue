<template>
  <div>
    <table class="table table-striped" v-if="missionSlotRegistrations">
      <thead>
        <tr>
          <th :style="playerColumnWidth">{{ $t('mission.slot.player') }}</th>
          <th style="width: 30%" v-if="(isMissionEditor || hasMissionSlotlistCommunityPermission) && hasAnyMissionSlotRegistrationDetails">{{ $t('mission.registration.comment') }}</th>
          <th style="width: 25%">{{ $t('mission.registration.registered') }}</th>
          <th style="width: 1%">{{ $t('mission.registration.confirmed') }}</th>
          <th style="width: 13%" class="text-center" v-if="(isMissionEditor || hasMissionSlotlistCommunityPermission) && hasAnyMissionSlotRegistrationDetails && !hasMissionEnded">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-slot-registrations-row v-for="registration in missionSlotRegistrations" :registration="registration" :key="registration.uid"></mission-slot-registrations-row>
      </tbody>
      <tfoot v-show="missionSlotRegistrations.length >= 10">
        <tr>
          <th :style="playerColumnWidth">{{ $t('mission.slot.player') }}</th>
          <th style="width: 30%" v-if="(isMissionEditor || hasMissionSlotlistCommunityPermission) && hasAnyMissionSlotRegistrationDetails">{{ $t('mission.registration.comment') }}</th>
          <th style="width: 25%">{{ $t('mission.registration.registered') }}</th>
          <th style="width: 1%">{{ $t('mission.registration.confirmed') }}</th>
          <th style="width: 13%" class="text-center" v-if="(isMissionEditor || hasMissionSlotlistCommunityPermission) && hasAnyMissionSlotRegistrationDetails && !hasMissionEnded">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'
import MissionSlotRegistrationsRow from './MissionSlotRegistrationsRow.vue'

export default {
  components: {
    MissionSlotRegistrationsRow
  },
  computed: {
    hasAnyMissionSlotRegistrationDetails() {
      if (_.isNil(this.missionSlotRegistrations)) {
        return false
      }

      return _.some(this.missionSlotRegistrations, (r) => !_.isNil(r.uid))
    },
    hasMissionEnded() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return moment().isAfter(moment(this.missionDetails.endTime))
    },
    hasMissionSlotlistCommunityPermission() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.slotlist.community`])
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionSlotRegistrations() {
      return this.$store.getters.missionSlotRegistrations
    },
    playerColumnWidth() {
      return this.isMissionEditor ? 'width: 31%' : 'width: 61%'
    },
  }
}
</script>
