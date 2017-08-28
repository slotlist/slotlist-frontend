<template>
  <tr>
    <td>{{ missionSlot.orderNumber }}</td>
    <td>
      <i :class="difficultyIcon" aria-hidden="true"></i>
      <b-tooltip v-if="missionSlot.restricted || missionSlot.reserve" :content="titleTooltip">
        <span :class="titleColor">{{ missionSlot.title }}</span>
      </b-tooltip>
      <span v-if="!missionSlot.restricted && !missionSlot.reserve" :class="titleColor">{{ missionSlot.title }}</span>
    </td>
    <td v-html="formattedAssignee"></td>
    <td>{{ missionSlot.shortDescription }}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Mission slot actions">
        <button type="button" class="btn btn-primary" @click="showMissionSlotDetails">
          <i class="fa fa-info" aria-hidden="true"></i> Details
        </button>
        <button type="button" class="btn btn-success" v-if="loggedIn && !missionSlot.registrationUid" :disabled="missionSlot.assignee" @click="showMissionSlotRegistration">
          <i class="fa fa-ticket" aria-hidden="true"></i> Register
        </button>
        <click-confirm v-if="loggedIn && missionSlot.registrationUid" button-yes-icon="fa fa-eraser" button-yes-class="btn btn-warning" button-size="sm" :messages="{title: 'Unregister from slot?', yes: 'Confirm', no: 'Cancel'}">
          <button type="button" class="btn btn-sm btn-warning" @click="deleteMissionSlotRegistration">
            <i class="fa fa-eraser" aria-hidden="true"></i> Unregister
          </button>
        </click-confirm>
        <click-confirm v-if="isMissionEditor" button-yes-icon="fa fa-trash" button-yes-class="btn btn-danger" button-size="sm" :messages="{title: 'Delete slot?', yes: 'Confirm', no: 'Cancel'}">
          <button type="button" class="btn btn-sm btn-danger" @click="deleteMissionSlotRegistration">
            <i class="fa fa-trash" aria-hidden="true"></i> Delete
          </button>
        </click-confirm>
      </div>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  props: [
    'missionSlot'
  ],
  computed: {
    difficultyIcon() {
      let difficultyColor = ''
      switch (this.missionSlot.difficulty) {
        case 0:
          difficultyColor = 'text-muted'
          break
        case 1:
          difficultyColor = 'text-info'
          break
        case 2:
          difficultyColor = 'text-primary'
          break
        case 3:
          difficultyColor = 'text-warning'
          break
        case 4:
          difficultyColor = 'text-danger'
          break
      }

      return `${difficultyColor} fa fa-thermometer-${this.missionSlot.difficulty} fa-lg`
    },
    formattedAssignee() {
      if (!_.isNil(this.missionSlot.assignee)) {
        return `<span class="text-success font-weight-bold">${this.formatUserWithTag(this.missionSlot.assignee)}</span>`
      }

      if (!_.isNumber(this.missionSlot.registrationCount) || this.missionSlot.registrationCount <= 0) {
        return '<span class="text-muted font-italic">not assigned - no registrations</span>'
      }

      return `<span class="text-muted font-italic">not assigned - ${this.missionSlot.registrationCount} registration${this.missionSlot.registrationCount > 1 ? 's' : ''}</span>`
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    titleColor() {
      if (this.missionSlot.restricted) {
        return 'text-primary font-italic'
      } else if (this.missionSlot.reserve) {
        return 'text-muted font-italic'
      }
    },
    titleTooltip() {
      if (this.missionSlot.restricted) {
        return 'Restricted - not available for everyone'
      } else if (this.missionSlot.reserve) {
        return 'Reserve - only filled after other slots are taken'
      }
    }
  },
  methods: {
    deleteMissionSlot() {
      console.log(`deleteMissionSlot ${this.missionSlot.uid}`);
    },
    deleteMissionSlotRegistration() {
      console.log(`deleteMissionSlotRegistration ${this.missionSlot.uid} ${this.missionSlot.registrationUid}`);
    },
    showMissionSlotDetails() {
      this.$store.dispatch('setMissionSlotDetails', this.missionSlot)
    },
    showMissionSlotRegistration() {
      this.$store.dispatch('showMissionSlotRegister', this.missionSlot)
    }
  }
}
</script>
