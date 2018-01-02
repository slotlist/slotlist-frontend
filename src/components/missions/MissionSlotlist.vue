<template>
  <div>
    <mission-slotlist-group v-for="missionSlotGroup in missionSlotGroups" :missionSlotGroup="missionSlotGroup" :key="missionSlotGroup.uid"></mission-slotlist-group>
    <div class="text-center">
      <b-btn variant="success" v-if="isMissionEditor && !hasMissionEnded" v-b-modal.missionSlotGroupCreateModal>
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slotGroup') }}
      </b-btn>
      <b-btn variant="success" v-if="isMissionEditor && !hasMissionEnded" v-b-modal.missionApplySlotTemplateModal>
        <i class="fa fa-file-text-o" aria-hidden="true"></i> {{ $t('button.apply.mission.slotGroup') }}
      </b-btn>
      <b-btn @click="refreshMissionSlotlist">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
    <div v-if="isMissionEditor && !hasMissionEnded">
      <br>
      <div class="small text-muted text-center" v-html="anyMissionSlotSelected ? $tc('mission.slot.selection.actions', missionSlotSelectionCount, { count: missionSlotSelectionCount }) : $t('mission.slot.selection.hint')"></div>
      <br v-if="anyMissionSlotSelected">
      <div class="text-center" v-if="anyMissionSlotSelected">
        <b-btn variant="primary" v-b-modal.missionSlotSelectionEditModal>
          <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit.mission.slot.selection') }}
        </b-btn>
        <click-confirm yes-icon="fa fa-close" yes-class="btn btn-warning" button-size="sm" :messages="{title: $t('mission.slot.confirm.unassign.selection'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="warning" @click="unassignSelectedMissionSlots">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.unassign.mission.slot.selection') }}
          </b-btn>
        </click-confirm>
        <click-confirm yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.slot.confirm.delete.selection'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="danger" @click="deleteSelectedMissionSlots">
            <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete.mission.slot.selection') }}
          </b-btn>
        </click-confirm>
        <b-btn variant="secondary" @click="clearMissionSlotSelection">
          <i class="fa fa-times-circle" aria-hidden="true"></i> {{ $t('button.clear.selection') }}
        </b-btn>
      </div>
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
    anyMissionSlotSelected() {
      return !_.isEmpty(this.$store.getters.missionSlotSelection)
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
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionSlotGroups() {
      return this.$store.getters.missionSlotGroups
    },
    missionSlotSelectionCount() {
      return this.$store.getters.missionSlotSelection.length
    }
  },
  methods: {
    clearMissionSlotSelection() {
      this.$store.dispatch('clearMissionSlotSelection')
    },
    deleteSelectedMissionSlots() {
      this.$store.dispatch('deleteSelectedMissionSlots', { missionSlug: this.$route.params.missionSlug })
    },
    getMissionSlotTemplates() {
      this.$store.dispatch('getMissionSlotTemplates', { limit: 100 })
    },
    refreshMissionSlotlist() {
      this.$store.dispatch('getMissionSlotlist', { missionSlug: this.$route.params.missionSlug })
    },
    unassignSelectedMissionSlots() {
      this.$store.dispatch('unassignSelectedMissionSlots', { missionSlug: this.$route.params.missionSlug })
    }
  }
}
</script>
