<template>
  <tr>
    <td>{{ missionSlot.orderNumber + 1 }}</td>
    <td>
      <i :class="difficultyIcon" aria-hidden="true"></i> {{ missionSlot.title }}
    </td>
    <td v-html="optionalAssignee"></td>
    <td>{{ missionSlot.shortDescription }}</td>
    <td class="text-center">
      <button type="button" class="btn btn-primary btn-sm" @click="details">Details</button>
      <button type="button" class="btn btn-success btn-sm" :disabled="missionSlot.assignee" @click="register">Register</button>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  computed: {
    optionalAssignee() {
      return _.isNil(this.missionSlot.assignee) ? '<span class="text-muted font-italic">not assigned</span>' : this.formatUserWithTag(this.missionSlot.assignee)
    },
    difficultyColor() {
      switch (this.missionSlot.difficulty) {
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
      return `${this.difficultyColor} fa fa-thermometer-${this.missionSlot.difficulty}`
    }
  },
  methods: {
    register() {
      console.log('missionSlot register', this.missionSlot)
    },
    details() {
      console.log('missionSlot details', this.missionSlot)
    }
  },
  props: [
    'missionSlot'
  ]
}
</script>
