<template>
  <tr>
    <td>{{ missionSlotDetails.orderNumber }}</td>
    <td>
      <div v-if="!missionSlotDetails.reserve && !missionSlotDetails.blocked">
        <i :class="difficultyIcon" aria-hidden="true"></i> {{ missionSlotDetails.title }}
      </div>
      <b-popover v-if="missionSlotDetails.reserve || missionSlotDetails.blocked" :content="titlePopoverContent" :triggers="['hover']">
        <span :class="titleColor" v-html="formattedTitle"></span>
      </b-popover>
    </td>
    <td v-if="hasAnyMissionSlotDescription">{{ missionSlotDetails.description }}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Mission slot template slot actions">
        <b-btn variant="primary" @click="prepareMissionSlotTemplateSlotDetails" v-b-modal.missionSlotTemplateSlotDetailsModal>
          <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
        </b-btn>
        <click-confirm v-if="isMissionSlotTemplateCreator" yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.slot.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="danger" size="sm" @click="deleteMissionSlotTemplateMissionSlot">
            <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
          </b-btn>
        </click-confirm>
      </div>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  props: [
    'index',
    'hasAnyMissionSlotDescription',
    'missionSlotCount',
    'missionSlotDetails',
    'missionSlotGroup'
  ],
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
    formattedTitle() {
      if (_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        return `<i class="${this.difficultyIcon}" aria-hidden="true"></i> ${this.missionSlotDetails.title}`
      }

      return `<i class="${this.difficultyIcon}" aria-hidden="true"></i> ${this.missionSlotDetails.title} - [${this.missionSlotDetails.restrictedCommunity.tag}]`
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
    titleColor() {
      if (this.missionSlotDetails.blocked || !_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        return 'text-primary'
      } else if (this.missionSlotDetails.reserve) {
        return 'text-muted font-italic'
      }
    },
    titlePopoverContent() {
      if (this.missionSlotDetails.blocked) {
        return this.$t('mission.slot.blocked.popover')
      } else if (!_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        return this.$t('mission.slot.restricted.popover', { communityInfo: `[${this.missionSlotDetails.restrictedCommunity.tag}] ${this.missionSlotDetails.restrictedCommunity.name}` })
      } else if (this.missionSlotDetails.reserve) {
        return this.$t('mission.slot.reserve.popover')
      }
    }
  },
  methods: {
    deleteMissionSlotTemplateMissionSlot() {
      this.$store.dispatch('removeMissionSlotTemplateSlot', { index: this.index, slotGroupOrderNumber: this.missionSlotGroup.orderNumber })
    },
    prepareMissionSlotTemplateSlotDetails() {
      this.$store.dispatch('setMissionSlotTemplateSlotDetails', this.missionSlotDetails)
      this.$store.dispatch('setMissionSlotTemplateSlotGroupDetails', this.missionSlotGroup)
    }
  }
}
</script>
