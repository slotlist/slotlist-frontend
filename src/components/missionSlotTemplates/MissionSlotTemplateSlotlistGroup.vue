<template>
  <div>
    <h5>{{ missionSlotGroup.title }}</h5>
    <div class="word-wrap" v-show="missionSlotGroup.description">{{ missionSlotGroup.description }}</div>
    <mission-slot-template-slotlist-group-slots-table :missionSlotGroup="missionSlotGroup"></mission-slot-template-slotlist-group-slots-table>
    <div class="text-center" v-if="isMissionSlotTemplateCreator">
      <b-btn variant="secondary" v-if="index > 0" @click="moveMissionSlotTemplateSlotGroup(-1)">
        <i class="fa fa-angle-up" aria-hidden="true"></i> {{ $t('button.move.up') }}
      </b-btn>
      <b-btn variant="secondary" v-if="index < (missionSlotGroupCount - 1)" @click="moveMissionSlotTemplateSlotGroup(1)">
        <i class="fa fa-angle-down" aria-hidden="true"></i> {{ $t('button.move.down') }}
      </b-btn>
      <b-btn variant="success" @click="setMissionSlotTemplateSlotGroupDetails" v-b-modal.missionSlotTemplateSlotCreateModal>
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slot') }}
      </b-btn>
      <b-btn variant="primary" @click="setMissionSlotTemplateSlotGroupDetails" v-b-modal.missionSlotTemplateSlotGroupEditModal>
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
    'index',
    'missionSlotGroup',
    'missionSlotGroupCount'
  ],
  computed: {
    isMissionSlotTemplateCreator() {
      if (!this.loggedIn || _.isNil(this.missionSlotTemplateDetails)) {
        return false
      }

      return this.missionSlotTemplateDetails.creator.uid === this.$store.getters.user.uid
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missionSlotTemplateDetails() {
      return this.$store.getters.missionSlotTemplateDetails
    }
  },
  methods: {
    deleteMissionSlotTemplateSlotGroup() {
      this.$store.dispatch('removeMissionSlotTemplateSlotGroup', { index: this.index })
    },
    duplicateMissionSlotTemplateSlotGroup() {
      const slotGroupDetails = {
        title: this.missionSlotGroup.title,
        description: this.missionSlotGroup.description,
        slots: _.clone(this.missionSlotGroup.slots),
        insertAfter: this.missionSlotGroup.orderNumber
      }

      this.$store.dispatch('addMissionSlotTemplateSlotGroup', slotGroupDetails)
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
