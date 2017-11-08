<template>
  <div>
    <h5>{{ missionSlotGroup.title }}</h5>
    <div class="word-wrap" v-show="missionSlotGroup.description">{{ missionSlotGroup.description }}</div>
    <mission-slot-template-slotlist-group-slots-table :missionSlotGroup="missionSlotGroup"></mission-slot-template-slotlist-group-slots-table>
    <div class="text-center">
      <b-btn variant="success" @click="setMissionSlotTemplateSlotGroupDetails" v-b-modal.missionSlotTemplateSlotCreateModal>
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slot') }}
      </b-btn>
      <b-btn variant="primary" @click="setMissionSlotTemplateSlotGroupDetails" v-b-modal.missionSlotTemplateSlotEditModal>
        <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit.mission.slotGroup') }}
      </b-btn>
      <b-btn variant="secondary" @click="duplicateMissionSlotTemplateSlotGroup">
        <i class="fa fa-files-o" aria-hidden="true"></i> {{ $t('button.duplicate.mission.slotGroup') }}
      </b-btn>
      <click-confirm yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.slotGroup.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
        <b-btn variant="danger" @click="deleteMissionSlotTemplateSlotGroup">
          <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
        </b-btn>
      </click-confirm>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'

import MissionSlotTemplateSlotlistGroupSlotsTable from './MissionSlotTemplateSlotlistGroupSlotsTable.vue'

export default {
  components: {
    MissionSlotTemplateSlotlistGroupSlotsTable
  },
  props: [
    'missionSlotGroup'
  ],
  methods: {
    deleteMissionSlotTemplateSlotGroup() {
      this.$store.dispatch('deleteMissionSlotTemplateSlotGroup', { missionSlotGroup: this.missionSlotGroup })
    },
    duplicateMissionSlotTemplateSlotGroup() {
      this.$store.dispatch('duplicateMissionSlotTemplateSlotGroup', { missionSlotGroup: this.missionSlotGroup })
    },
    moveMissionSlotTemplateSlotGroup(direction) {
      this.$store.dispatch('moveMissionSlotTemplateSlotGroup', { index: this.index, direction })
    },
    setMissionSlotTemplateSlotGroupDetails() {
      this.$store.dispatch('setMissionSlotTemplateSlotGroupDetails', this.missionSlotGroup)
    }
  }
}
</script>
