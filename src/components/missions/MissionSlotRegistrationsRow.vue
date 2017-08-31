<template>
  <tr>
    <td>{{ formatUserWithTag(registration.user) }}</td>
    <td v-html="formattedComment" v-if="isMissionEditor"></td>
    <td>{{ formatDateTime(registration.createdAt) }}</td>
    <td class="text-center" v-html="formattedConfirmation"></td>
    <td class="text-center" v-if="isMissionEditor">
      <button type="button" class="btn btn-success btn-sm" v-if="!registration.confirmed" @click="registrationAssign">
        <i class="fa fa-check" aria-hidden="true"></i> Assign
      </button>
      <button type="button" class="btn btn-danger btn-sm" v-if="registration.confirmed" @click="registrationUnassign">
        <i class="fa fa-check" aria-hidden="true"></i> Unassign
      </button>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  props: [
    'registration'
  ],
  computed: {
    formattedComment() {
      return _.isNil(this.registration.comment) ?
        '<span class="text-muted font-italic">not provided</span>' :
        this.registration.comment
    },
    formattedConfirmation() {
      return this.registration.confirmed ? '<i class="fa fa-check fa-lg text-success" aria-hidden="true"></i>' : '<i class="fa fa-close fa-lg text-danger" aria-hidden="true"></i>'
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    }
  },
  methods: {
    registrationAssign() {
      this.$store.dispatch('showMissionSlotRegistrationConfirmation', { registration: this.registration, assign: true })
    },
    registrationUnassign() {
      this.$store.dispatch('showMissionSlotRegistrationConfirmation', { registration: this.registration, assign: false })
    }
  }
}
</script>
