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
    <br v-if="hasMissionAnyRequiredDLCs">
    <div v-if="hasMissionAnyRequiredDLCs" class="text-center small text-muted">
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/aow.png" width="12px" alt="Art of War" /> {{ $t('mission.requiredDLCs.aow') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/apex.png" width="12px" alt="Apex" /> {{ $t('mission.requiredDLCs.apex') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/contact.png" width="12px" alt="Contact" /> {{ $t('mission.requiredDLCs.contact') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/csla.png" width="12px" alt="CSLA Iron Curtain" /> {{ $t('mission.requiredDLCs.csla') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/ef.png" width="12px" alt="Expeditionary Forces" /> {{ $t('mission.requiredDLCs.ef') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/gm.png" width="12px" alt="Global Mobilization" /> {{ $t('mission.requiredDLCs.gm') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/helicopters.png" width="12px" alt="Helicopters" /> {{ $t('mission.requiredDLCs.helicopters') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/jets.png" width="12px" alt="Jets" /> {{ $t('mission.requiredDLCs.jets') }} | 
      <br/>
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/karts.png" width="12px" alt="Karts" /> {{ $t('mission.requiredDLCs.karts') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/laws-of-war.png" width="12px" alt="Laws of War" /> {{ $t('mission.requiredDLCs.laws-of-war') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/marksmen.png" width="12px" alt="Marksmen" /> {{ $t('mission.requiredDLCs.marksmen') }} |
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/rf.png" width="12px" alt="Reaction Forces" /> {{ $t('mission.requiredDLCs.rf') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tac-ops.png" width="12px" alt="Tac-Ops" /> {{ $t('mission.requiredDLCs.tac-ops') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tanks.png" width="12px" alt="Tanks" /> {{ $t('mission.requiredDLCs.tanks') }} | 
      <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/vn.png" width="12px" alt="S.O.G. Prairie Fire" /> {{ $t('mission.requiredDLCs.vn') }}
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
    hasMissionAnyRequiredDLCs() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      if (!_.isEmpty(this.missionDetails.requiredDLCs)) {
        return true
      }

      return _.some(this.missionSlotGroups, (slotGroup) => {
        return _.some(slotGroup.slots, (slot) => {
          return !_.isEmpty(slot.requiredDLCs)
        })
      })
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
