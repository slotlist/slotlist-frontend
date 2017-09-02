<template>
  <tr>
    <td>{{ formatUserWithTag(registration.user) }}</td>
    <td v-html="formattedComment" v-if="isMissionEditor"></td>
    <td>{{ formatDateTime(registration.createdAt) }}</td>
    <td class="text-center" v-html="formattedConfirmation"></td>
    <td class="text-center" v-if="isMissionEditor">
      <b-btn v-if="!registration.confirmed" variant="success" size="sm" @click="modifyMissionSlotRegistration(true)">
        <i class="fa fa-check" aria-hidden="true"></i> Assign
      </b-btn>
      <b-btn v-if="registration.confirmed" variant="danger" size="sm" @click="modifyMissionSlotRegistration(false)">
        <i class="fa fa-trash" aria-hidden="true"></i> Unassign
      </b-btn>
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
    modifyMissionSlotRegistration(confirm) {
      this.$store.dispatch('modifyMissionSlotRegistration', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.registration.slotUid,
        registrationUid: this.registration.uid,
        confirm: confirm
      })
    }
  }
}
</script>
