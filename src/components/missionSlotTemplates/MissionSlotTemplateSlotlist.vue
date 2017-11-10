<template>
  <div>
    <mission-slot-template-slotlist-group v-for="(missionSlotGroup, index) in missionSlotTemplateDetails.slotGroups" :index="index" :missionSlotGroupCount="missionSlotTemplateDetails.slotGroups.length" :missionSlotGroup="missionSlotGroup" :key="missionSlotGroup.uid"></mission-slot-template-slotlist-group>
    <br v-if="isMissionSlotTemplateCreator">
    <div class="text-center" v-if="isMissionSlotTemplateCreator">
      <b-btn variant="success" v-b-modal.missionSlotTemplateSlotGroupCreateModal>
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slotGroup') }}
      </b-btn>
      <click-confirm v-if="missionSlotTemplateUnsavedChanges" yes-icon="fa fa-floppy-o" yes-class="btn btn-success" button-size="sm" :messages="{title: $t('mission.slotTemplate.confirm.save.slotlist'), yes: $t('button.confirm'), no: $t('button.cancel')}">
        <b-btn variant="success" @click="saveMissionSlotTemplateSlotlist">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> {{ $t('button.save.mission.slotTemplate.slotlist') }}
        </b-btn>
      </click-confirm>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionSlotTemplateSlotlistGroup from './MissionSlotTemplateSlotlistGroup.vue'

export default {
  components: {
    MissionSlotTemplateSlotlistGroup
  },
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
    },
    missionSlotTemplateUnsavedChanges() {
      return this.$store.getters.missionSlotTemplateUnsavedChanges
    }
  },
  methods: {
    saveMissionSlotTemplateSlotlist() {
      const updatedMissionSlotTemplateDetails = {
        slotGroups: this.missionSlotTemplateDetails.slotGroups
      }

      this.$store.dispatch('editMissionSlotTemplate', {
        missionSlotTemplateUid: this.$route.params.missionSlotTemplateUid,
        missionSlotTemplateTitle: this.missionSlotTemplateDetails.title,
        updatedMissionSlotTemplateDetails
      }).then(() => {
        this.$store.dispatch('setMissionSlotTemplateUnsavedChanges', false)
      })
    }
  }
}
</script>
