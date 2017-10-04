<template>
  <div>
    <b-modal id="missionSlotDetailsModal" ref="missionSlotDetailsModal" v-if="missionSlotDetails" size="lg" :title="slotDetailsTitle" no-close-on-backdrop>
      <div class="container-fluid">
        <div class="row font-weight-bold">
          <div class="col col-1">#</div>
          <div class="col col-3">{{ $t('mission.slot.role') }}</div>
          <div class="col col-5">{{ $t('mission.slot.player') }}</div>
          <div class="col col-3">{{ $t('mission.slot.difficulty') }}</div>
        </div>
        <div class="row">
          <div class="col col-1">{{ missionSlotDetails.orderNumber }}</div>
          <div class="col col-3">{{ missionSlotDetails.title }} </div>
          <div class="col col-5" v-html="formattedAssignee"></div>
          <div class="col col-3">
            <i :class="difficultyIcon" aria-hidden="true"></i>
            <span :class="difficultyColor">{{ difficultyText }}</span>
          </div>
        </div>
        <div class="row font-weight-bold">
          <div class="col col-1"></div>
          <div class="col col-6">{{ $t('mission.slot.description') }}</div>
          <div class="col col-5">{{ $t('mission.slot.status') }}</div>
        </div>
        <div class="row">
          <div class="col col-1"></div>
          <div class="col col-6">{{ missionSlotDetails.description}}</div>
          <div class="col col-5" v-html="slotStatus"></div>
        </div>
        <hr class="my-4" v-show="missionSlotDetails.detailedDescription">
        <div class="row font-weight-bold" v-show="missionSlotDetails.detailedDescription">
          <div class="col col-12">{{ $t('mission.slot.detailedDescription') }}</div>
        </div>
        <div class="row" v-show="missionSlotDetails.detailedDescription">
          <div class="col col-12" v-html="missionSlotDetails.detailedDescription"></div>
        </div>
        <hr class="my-4">
        <div class="row font-weight-bold">
          <div class="col col-12">{{ $t('mission.slot.registrations') }}</div>
        </div>
        <br>
        <div class="row">
          <div class="col col-12">
            <mission-slot-registrations :missionSlotDetails="missionSlotDetails"></mission-slot-registrations>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <b-btn variant="success" v-if="loggedIn && !missionSlotDetails.registrationUid" :disabled="!canRegisterForSlot" @click="hideMissionSlotDetailsModal" v-b-modal.missionSlotRegistrationModal>
          <i class="fa fa-ticket" aria-hidden="true"></i> {{ $t('button.register') }}
        </b-btn>
        <b-btn variant="warning" v-if="isMissionEditor" @click="hideMissionSlotDetailsModal" v-b-modal.missionSlotAssignModal>
          <i class="fa fa-gavel" aria-hidden="true"></i> {{ $t('button.assign.mission.slot') }}
        </b-btn>
        <b-btn variant="secondary" v-if="isMissionEditor" @click="duplicateMissionSlot">
          <i class="fa fa-files-o" aria-hidden="true"></i> {{ $t('button.duplicate.mission.slot') }}
        </b-btn>
        <b-btn variant="primary" v-if="isMissionEditor" @click="hideMissionSlotDetailsModal" v-b-modal.missionSlotEditModal>
          <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
        </b-btn>
        <b-btn @click="hideMissionSlotDetailsModal">
          <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.close') }}
        </b-btn>
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
    canRegisterForSlot() {
      const user = this.$store.getters.user
      let userCommunityUid = null;
      if (!_.isNil(user) && !_.isNil(user.community)) {
        userCommunityUid = user.community.uid
      }

      let restrictedCommunityUid = null;
      if (!_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        restrictedCommunityUid = this.missionSlotDetails.restrictedCommunity.uid
      }

      return _.isNil(this.missionSlotDetails.assignee) && (_.isNil(restrictedCommunityUid) || _.isEqual(userCommunityUid, restrictedCommunityUid))
    },
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
        case 0: return this.$t('mission.slot.difficulty.beginner')
        case 1: return this.$t('mission.slot.difficulty.easy')
        case 2: return this.$t('mission.slot.difficulty.medium')
        case 3: return this.$t('mission.slot.difficulty.advanced')
        case 4: return this.$t('mission.slot.difficulty.expert')
        default: return ''
      }
    },
    formattedAssignee() {
      if (!_.isNil(this.missionSlotDetails.assignee)) {
        return `<span class="text-success font-weight-bold">${this.formatUserWithTag(this.missionSlotDetails.assignee)}</span>`
      }

      if (!_.isNumber(this.missionSlotDetails.registrationCount) || this.missionSlotDetails.registrationCount <= 0) {
        return `<span class="text-muted font-italic">${this.$t('mission.slot.assignee.notAssigned')} - ${this.$tc('mission.slot.assignee.registration', 0)}</span>`
      }

      return `<span class="text-muted font-italic">${this.$t('mission.slot.assignee.notAssigned')} - ${this.missionSlotDetails.registrationCount} ${this.$tc('mission.slot.assignee.registration', this.missionSlotDetails.registrationCount > 1 ? 2 : 1)}</span>`
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
      return `${this.$t('mission.modal.slot.details')} - #${this.missionSlotDetails.orderNumber} ${this.missionSlotDetails.title}`
    },
    slotReserve() {
      if (this.missionSlotDetails.reserve) {
        return `<span class="text-muted font-italic">${this.$t('mission.slot.reserve')}</span>`
      }

      return `<span>${this.$t('mission.slot.reserve.regular')}</span>`
    },
    slotRestricted() {
      if (!_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        return `<span class="text-primary">${this.$t('mission.slot.restricted', { communityInfo: `[${this.missionSlotDetails.restrictedCommunity.tag}] ${this.missionSlotDetails.restrictedCommunity.name}` })}</span>`
      }

      return `<span>${this.$t('mission.slot.restricted.unrestricted')}</span>`
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
    duplicateMissionSlot() {
      const slotDetails = {
        title: this.missionSlotDetails.title,
        difficulty: this.missionSlotDetails.difficulty,
        description: this.missionSlotDetails.description,
        detailedDescription: this.missionSlotDetails.detailedDescription,
        restrictedCommunityUid: _.isNil(this.missionSlotDetails.restrictedCommunity) ? null : this.missionSlotDetails.restrictedCommunity.uid,
        reserve: this.missionSlotDetails.reserve,
        insertAfter: this.missionSlotDetails.orderNumber,
        slotGroupUid: this.missionSlotDetails.slotGroupUid
      }

      this.hideMissionSlotDetailsModal();

      this.$store.dispatch('createMissionSlot', { missionSlug: this.$route.params.missionSlug, slotDetails: slotDetails });
    },
    hideMissionSlotDetailsModal() {
      this.$refs.missionSlotDetailsModal.hide()
    }
  }
}
</script>
