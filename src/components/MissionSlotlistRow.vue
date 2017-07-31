<template>
  <tr>
    <td>{{ missionSlot.orderNumber + 1 }}</td>
    <td>
      <i :class="difficultyIcon" aria-hidden="true"></i>
      <b-tooltip v-if="missionSlot.restricted || missionSlot.reserve" :content="titleTooltip">
        <span :class="titleColor">{{ missionSlot.title }}</span>
      </b-tooltip>
      <span v-if="!missionSlot.restricted && !missionSlot.reserve" :class="titleColor">{{ missionSlot.title }}</span>
    </td>
    <td v-html="optionalAssignee"></td>
    <td>{{ missionSlot.shortDescription }}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Mission slot actions">
        <button type="button" class="btn btn-primary" @click="slotDetails">
          <i class="fa fa-info" aria-label="true"></i> Details
        </button>
        <button type="button" class="btn btn-success" v-show="loggedIn" :disabled="missionSlot.assignee" @click="registerForSlot">
          <i class="fa fa-check-square-o" aria-label="true"></i> Register
        </button>
        <button type="button" class="btn btn-danger" v-if="canEditSlotlist" @click="deleteSlot">
          <i class="fa fa-trash" aria-label="true"></i> Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    canEditSlotlist() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    optionalAssignee() {
      return _.isNil(this.missionSlot.assignee) ?
        '<span class="text-muted font-italic">not assigned</span>' :
        `<span class="text-success font-weight-bold">${this.formatUserWithTag(this.missionSlot.assignee)}</span>`
    },
    difficultyColor() {
      switch (this.missionSlot.difficulty) {
        case 0: return 'text-muted'
        case 1: return 'text-info'
        case 2: return 'text-primary'
        case 3: return 'text-warning'
        case 4: return 'text-danger'
        default: return ''
      }
    },
    difficultyIcon() {
      return `${this.difficultyColor} fa fa-thermometer-${this.missionSlot.difficulty} fa-lg`
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
    registerForSlot() {
      this.$store.dispatch('showMissionSlotRegister', this.missionSlot)
    },
    slotDetails() {
      this.$store.dispatch('setMissionSlotDetails', this.missionSlot)
    },
    deleteSlot() {
      console.log('deleteSlot', this.missionSlot)
    }
  },
  props: [
    'missionSlot'
  ]
}
</script>
