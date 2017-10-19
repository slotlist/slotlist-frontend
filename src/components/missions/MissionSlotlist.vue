<template>
  <div>
    <mission-slotlist-group v-for="missionSlotGroup in missionSlotGroups" :missionSlotGroup="missionSlotGroup" :key="missionSlotGroup.uid"></mission-slotlist-group>
    <br>
    <div class="text-center">
      <b-btn variant="success" v-if="isMissionEditor && !hasMissionEnded" v-b-modal.missionSlotGroupCreateModal>
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slotGroup') }}
      </b-btn>
      <b-btn @click="refreshMissionSlotlist">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'
import MissionSlotlistGroup from './MissionSlotlistGroup.vue'

export default {
  components: {
    MissionSlotlistGroup
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    hasMissionEnded() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return moment().isAfter(moment(this.missionDetails.endTime))
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionSlotGroups() {
      return this.$store.getters.missionSlotGroups
    }
  },
  methods: {
    refreshMissionSlotlist() {
      this.$store.dispatch('getMissionSlotlist', { missionSlug: this.$route.params.missionSlug })
    }
  }
}
</script>
