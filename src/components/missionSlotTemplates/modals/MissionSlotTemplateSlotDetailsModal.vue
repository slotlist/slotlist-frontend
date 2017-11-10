<template>
  <div>
    <b-modal id="missionSlotTemplateSlotDetailsModal" ref="missionSlotTemplateSlotDetailsModal" v-if="missionSlotTemplateSlotDetails" size="lg" :title="slotDetailsTitle" no-close-on-backdrop>
      <div class="container-fluid">
        <div class="row font-weight-bold">
          <div class="col col-1">#</div>
          <div class="col col-6">{{ $t('mission.slot.role') }}</div>
          <div class="col col-5">{{ $t('mission.slot.difficulty') }}</div>
        </div>
        <div class="row">
          <div class="col col-1">{{ missionSlotTemplateSlotDetails.orderNumber }}</div>
          <div class="col col-6">{{ missionSlotTemplateSlotDetails.title }} </div>
          <div class="col col-5">
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
          <div class="col col-6">{{ missionSlotTemplateSlotDetails.description}}</div>
          <div class="col col-5" v-html="slotStatus"></div>
        </div>
        <hr class="my-4" v-show="missionSlotTemplateSlotDetails.detailedDescription">
        <div class="row font-weight-bold" v-show="missionSlotTemplateSlotDetails.detailedDescription">
          <div class="col col-12">{{ $t('mission.slot.detailedDescription') }}</div>
        </div>
        <div class="row" v-show="missionSlotTemplateSlotDetails.detailedDescription">
          <div class="col col-12" v-html="missionSlotTemplateSlotDetails.detailedDescription"></div>
        </div>
      </div>
      <div slot="modal-footer">
        <b-btn variant="secondary" v-if="isMissionSlotTemplateCreator" @click="duplicateMissionSlotTemplateSlot">
          <i class="fa fa-files-o" aria-hidden="true"></i> {{ $t('button.duplicate.mission.slot') }}
        </b-btn>
        <b-btn variant="primary" v-if="isMissionSlotTemplateCreator" @click="hideMissionSlotTemplateSlotDetailsModal" v-b-modal.missionSlotTemplateSlotEditModal>
          <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
        </b-btn>
        <b-btn @click="hideMissionSlotTemplateSlotDetailsModal">
          <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.close') }}
        </b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  computed: {
    difficultyColor() {
      switch (this.missionSlotTemplateSlotDetails.difficulty) {
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
      return `${this.difficultyColor} fa fa-thermometer-${this.missionSlotTemplateSlotDetails.difficulty} fa-lg`
    },
    difficultyText() {
      switch (this.missionSlotTemplateSlotDetails.difficulty) {
        case 0: return this.$t('mission.slot.difficulty.beginner')
        case 1: return this.$t('mission.slot.difficulty.easy')
        case 2: return this.$t('mission.slot.difficulty.medium')
        case 3: return this.$t('mission.slot.difficulty.advanced')
        case 4: return this.$t('mission.slot.difficulty.expert')
        default: return ''
      }
    },
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
    missionSlotTemplateSlotDetails() {
      return this.$store.getters.missionSlotTemplateSlotDetails
    },
    slotDetailsTitle() {
      return `${this.$t('mission.modal.slot.details')} - #${this.missionSlotTemplateSlotDetails.orderNumber} ${this.missionSlotTemplateSlotDetails.title}`
    },
    slotReserve() {
      if (this.missionSlotTemplateSlotDetails.reserve) {
        return `<span class="text-muted font-italic">${this.$t('mission.slot.reserve')}</span>`
      }

      return `<span>${this.$t('mission.slot.reserve.regular')}</span>`
    },
    slotRestricted() {
      if (!_.isNil(this.missionSlotTemplateSlotDetails.restrictedCommunity)) {
        return `<span class="text-primary">${this.$t('mission.slot.restricted', { communityInfo: `[${this.missionSlotTemplateSlotDetails.restrictedCommunity.tag}] ${this.missionSlotTemplateSlotDetails.restrictedCommunity.name}` })}</span>`
      }

      return `<span>${this.$t('mission.slot.restricted.unrestricted')}</span>`
    },
    slotStatus() {
      if (this.missionSlotTemplateSlotDetails.blocked) {
        return `<span class="text-primary">${this.$t('mission.slot.blocked')}</span>`
      }

      return `${this.slotRestricted} - ${this.slotReserve}`
    },
  },
  methods: {
    duplicateMissionSlotTemplateSlot() {
      const slotDetails = {
        title: this.missionSlotTemplateSlotDetails.title,
        difficulty: this.missionSlotTemplateSlotDetails.difficulty,
        description: this.missionSlotTemplateSlotDetails.description,
        detailedDescription: this.missionSlotTemplateSlotDetails.detailedDescription,
        reserve: this.missionSlotTemplateSlotDetails.reserve,
        blocked: this.missionSlotTemplateSlotDetails.blocked,
        insertAfter: _.max([this.missionSlotTemplateSlotDetails.orderNumber - 1, 0])
      }

      this.hideMissionSlotTemplateSlotDetailsModal()

      this.$store.dispatch('addMissionSlotTemplateSlot', slotDetails)
    },
    hideMissionSlotTemplateSlotDetailsModal() {
      this.$refs.missionSlotTemplateSlotDetailsModal.hide()
    }
  }
}
</script>
