<template>
  <div>
    <h5>{{ missionSlotGroup.title }}</h5>
    <div class="word-wrap" v-show="missionSlotGroup.description">{{ missionSlotGroup.description }}</div>
    <mission-slotlist-group-slots-table :missionSlotGroup="missionSlotGroup"></mission-slotlist-group-slots-table>
    <div class="text-center" v-if="isMissionEditor && !hasMissionEnded">
      <b-btn variant="success" @click="setMissionSlotGroupDetails" v-b-modal.missionSlotCreateModal>
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slot') }}
      </b-btn>
      <b-btn variant="primary" @click="setMissionSlotGroupDetails" v-b-modal.missionSlotGroupEditModal>
        <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit.mission.slotGroup') }}
      </b-btn>
      <b-btn variant="secondary" @click="duplicateMissionSlotGroup">
        <i class="fa fa-files-o" aria-hidden="true"></i> {{ $t('button.duplicate.mission.slotGroup') }}
      </b-btn>
      <click-confirm yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.slotGroup.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
        <b-btn variant="danger" @click="deleteMissionSlotGroup">
          <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
        </b-btn>
      </click-confirm>
    </div>
    <br>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

import MissionSlotlistGroupSlotsTable from './MissionSlotlistGroupSlotsTable.vue'

export default {
  components: {
    MissionSlotlistGroupSlotsTable
  },
  props: [
    'missionSlotGroup'
  ],
  computed: {
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
  },
  methods: {
    duplicateMissionSlotGroup() {
      this.$store.dispatch("duplicateMissionSlotGroup", { missionSlug: this.$route.params.missionSlug, missionSlotGroup: this.missionSlotGroup })
    },
    deleteMissionSlotGroup() {
      this.$store.dispatch('deleteMissionSlotGroup', {
        missionSlug: this.$route.params.missionSlug,
        slotGroupUid: this.missionSlotGroup.uid,
        slotGroupTitle: this.missionSlotGroup.title
      })
    },
    setMissionSlotGroupDetails() {
      this.$store.dispatch('setMissionSlotGroupDetails', this.missionSlotGroup);
    }
  }
}
</script>
