<template>
  <tr>
    <td>{{ missionSlotDetails.orderNumber }}</td>
    <td>
      <i :class="difficultyIcon" aria-hidden="true"></i>
      <span :class="titleColor">{{ missionSlotDetails.title }}</span>
    </td>
    <td v-html="formattedAssignee"></td>
    <td v-if="missionSlotDetails.description">{{ missionSlotDetails.description }}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Mission slot actions">
        <b-btn variant="primary" @click="prepareMissionSlotDetails" v-b-modal.missionSlotDetailsModal>
          <i class="fa fa-info" aria-hidden="true"></i> {{ $t('misc.details') }}
        </b-btn>
        <b-btn variant="success" v-if="loggedIn && !missionSlotDetails.registrationUid" :disabled="missionSlotDetails.assignee ? true : false" @click="setMissionSlotDetails" v-b-modal.missionSlotRegistrationModal>
          <i class="fa fa-ticket" aria-hidden="true"></i> {{ $t('button.register') }}
        </b-btn>
        <click-confirm v-if="loggedIn && missionSlotDetails.registrationUid" yes-icon="fa fa-eraser" yes-class="btn btn-warning" button-size="sm" :messages="{title: $t('mission.slot.confirm.unregister'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="warning" size="sm" @click="deleteMissionSlotRegistration">
            <i class="fa fa-eraser" aria-hidden="true"></i> {{ $t('button.unregister') }}
          </b-btn>
        </click-confirm>
        <click-confirm v-if="isMissionEditor" yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.slot.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="danger" size="sm" @click="deleteMissionSlotRegistration">
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
    'missionSlotDetails'
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
    titleColor() {
      if (this.missionSlotDetails.restricted) {
        return 'text-primary font-italic'
      } else if (this.missionSlotDetails.reserve) {
        return 'text-muted font-italic'
      }
    },
    titleTooltip() {
      if (this.missionSlotDetails.restricted) {
        return this.$t('mission.slot.restricted.tooltip')
      } else if (this.missionSlotDetails.reserve) {
        return this.$t('mission.slot.reserve.tooltip')
      }
    }
  },
  methods: {
    deleteMissionSlot() {
      this.$store.dispatch('deleteMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      });
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
    prepareMissionSlotDetails() {
      this.$store.dispatch('getMissionSlotRegistrations', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })

      this.setMissionSlotDetails();
    },
    setMissionSlotDetails() {
      this.$store.dispatch('setMissionSlotDetails', this.missionSlotDetails)
    }
  }
}
</script>
