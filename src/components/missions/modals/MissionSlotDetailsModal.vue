<template>
  <div>
    <b-modal id="missionSlotDetailsModal" ref="missionSlotDetailsModal" v-if="missionSlotDetails" size="lg" :title="slotDetailsTitle">
      <div class="container-fluid">
        <div class="row font-weight-bold">
          <div class="col col-1">#</div>
          <div class="col col-3">Role</div>
          <div class="col col-5">Player</div>
          <div class="col col-3">Difficulty</div>
        </div>
        <div class="row">
          <div class="col col-1">{{ missionSlotDetails.orderNumber + 1 }}</div>
          <div class="col col-3">{{ missionSlotDetails.title }} </div>
          <div class="col col-5" v-html="formattedAssignee"></div>
          <div class="col col-3">
            <i :class="difficultyIcon" aria-hidden="true"></i>
            <span :class="difficultyColor">{{ difficultyText }}</span>
          </div>
        </div>
        <div class="row font-weight-bold">
          <div class="col col-1"></div>
          <div class="col col-6">Description</div>
          <div class="col col-5">Status</div>
        </div>
        <div class="row">
          <div class="col col-1"></div>
          <div class="col col-6">{{ missionSlotDetails.shortDescription}}</div>
          <div class="col col-5" v-html="slotStatus"></div>
        </div>
        <hr class="my-4" v-show="missionSlotDetails.description">
        <div class="row font-weight-bold" v-show="missionSlotDetails.description">
          <div class="col col-12">Detailed description</div>
        </div>
        <div class="row" v-show="missionSlotDetails.description">
          <div class="col col-12" v-html="missionSlotDetails.description"></div>
        </div>
        <hr class="my-4">
        <div class="row font-weight-bold">
          <div class="col col-12">Registrations</div>
        </div>
        <br>
        <div class="row">
          <div class="col col-12">
            <mission-slot-registrations :missionSlotDetails="missionSlotDetails"></mission-slot-registrations>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot detail actions">
          <b-btn variant="success" v-if="loggedIn && !missionSlotDetails.registrationUid" :disabled="missionSlotDetails.assignee" @click="hideMissionSlotDetailsModal" v-b-modal.missionSlotRegistrationModal>
            <i class="fa fa-ticket" aria-hidden="true"></i> Register
          </b-btn>
          <click-confirm v-if="true || loggedIn && missionSlotDetails.registrationUid" yes-icon="fa fa-eraser" yes-class="btn btn-warning" button-size="sm" :messages="{title: 'Unregister from slot?', yes: 'Confirm', no: 'Cancel'}">
            <b-btn variant="warning" @click="deleteMissionSlotRegistration">
              <i class="fa fa-eraser" aria-hidden="true"></i> Unregister
            </b-btn>
          </click-confirm>
          <b-btn variant="primary" v-if="isMissionEditor" @click="slotDetailsEdit">
            <i class="fa fa-edit" aria-hidden="true"></i> Edit
          </b-btn>
          <click-confirm v-if="isMissionEditor" yes-icon="fa fa-trash" yes-class="btn btn-danger" :messages="{title: 'Delete slot?', yes: 'Confirm', no: 'Cancel'}">
            <b-btn variant="danger" @click="deleteMissionSlot">
              <i class="fa fa-trash" aria-hidden="true"></i> Delete
            </b-btn>
          </click-confirm>
          <b-btn @click="hideMissionSlotDetailsModal">
            <i class="fa fa-close" aria-hidden="true"></i> Close
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionSlotRegistrations from '../MissionSlotRegistrations.vue'

export default {
  components: {
    MissionSlotRegistrations
  },
  computed: {
    difficultyColor() {
      switch (this.missionSlotDetails.difficulty) {
        case 0:
          return 'text-muted'
        case 1:
          return 'text-info'
        case 2:
          return 'text-primary'
        case 3:
          return 'text-warning'
        case 4:
          return 'text-danger'
        default:
          return ''
      }
    },
    difficultyIcon() {
      return `${this.difficultyColor} fa fa-thermometer-${this.missionSlotDetails.difficulty} fa-lg`
    },
    difficultyText() {
      switch (this.missionSlotDetails.difficulty) {
        case 0: return 'Beginner'
        case 1: return 'Easy'
        case 2: return 'Medium'
        case 3: return 'Advanced'
        case 4: return 'Expert'
        default: return ''
      }
    },
    formattedAssignee() {
      if (!_.isNil(this.missionSlotDetails.assignee)) {
        return `<span class="text-success font-weight-bold">${this.formatUserWithTag(this.missionSlotDetails.assignee)}</span>`
      }

      if (!_.isNumber(this.missionSlotDetails.registrationCount) || this.missionSlotDetails.registrationCount <= 0) {
        return '<span class="text-muted font-italic">not assigned - no registrations</span>'
      }

      return `<span class="text-muted font-italic">not assigned - ${this.missionSlotDetails.registrationCount} registration${this.missionSlotDetails.registrationCount > 1 ? 's' : ''}</span>`
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missionSlotDetails() {
      return this.$store.getters.missionSlotDetails
    },
    slotDetailsTitle() {
      return `Slot details - #${this.missionSlotDetails.orderNumber} ${this.missionSlotDetails.title}`
    },
    slotReserve() {
      if (this.missionSlotDetails.reserve) {
        return '<span class="text-muted font-italic">reserve</span>'
      }

      return '<span>regular</span>'
    },
    slotRestricted() {
      if (this.missionSlotDetails.restricted) {
        return '<span class="text-primary font-italic">restricted</span>'
      }

      return '<span>unrestricted</span>'
    },
    slotStatus() {
      return `${this.slotRestricted} - ${this.slotReserve}`
    },
  },
  methods: {
    deleteMissionSlot() {
      this.$store.dispatch('deleteMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })
    },
    deleteMissionSlotRegistration() {
      this.$store.dispatch('unregisterFromMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        registrationUid: this.missionSlotDetails.registrationUid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })
    },
    hideMissionSlotDetailsModal() {
      this.$refs.missionSlotDetailsModal.hide()
    }
  }
}
</script>