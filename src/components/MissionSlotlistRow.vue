<template>
  <tr>
    <td>{{ missionSlot.orderNumber + 1 }}</td>
    <td>
      <i :class="difficultyIcon" aria-hidden="true"></i> {{ missionSlot.title }}
    </td>
    <td v-html="optionalAssignee"></td>
    <td>{{ missionSlot.shortDescription }}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Mission slot actions">
        <button type="button" class="btn btn-primary" @click="slotDetails">Details</button>
        <button type="button" class="btn btn-success" v-show="loggedIn" :disabled="missionSlot.assignee" @click="registerForSlot">Register</button>
        <button type="button" class="btn btn-danger" v-if="canEditSlotlist" @click="deleteSlot">Delete</button>
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
      return _.isNil(this.missionSlot.assignee) ? '<span class="text-muted font-italic">not assigned</span>' : this.formatUserWithTag(this.missionSlot.assignee)
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
    }
  },
  methods: {
    registerForSlot() {
      console.log('registerForSlot', this.missionSlot)
    },
    slotDetails() {
      console.log('details', this.missionSlot)
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
