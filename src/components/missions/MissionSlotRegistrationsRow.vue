<template>
  <tr>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: registration.user.uid}}">
        {{ formatUserWithTag(registration.user) }}
      </router-link>
    </td>
    <td v-html="formattedComment" v-if="(isMissionEditor || hasMissionSlotlistCommunityPermission) && registration.uid"></td>
    <td>{{ formatDateTime(registration.createdAt) }}</td>
    <td class="text-center" v-html="formattedConfirmation"></td>
    <td class="text-center" v-if="(isMissionEditor || hasMissionSlotlistCommunityPermission) && registration.uid && !hasMissionEnded">
      <b-btn v-if="!registration.confirmed" variant="success" size="sm" @click="modifyMissionSlotRegistration(true)">
        <i class="fa fa-check" aria-hidden="true"></i>
      </b-btn>
      <b-btn v-if="registration.confirmed" variant="warning" size="sm" @click="modifyMissionSlotRegistration(false)">
        <i class="fa fa-times" aria-hidden="true"></i>
      </b-btn>
      <b-btn variant="danger" size="sm" v-if="isMissionEditor" @click="deleteMissionSlotRegistration">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </b-btn>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

export default {
  props: [
    'registration'
  ],
  computed: {
    formattedComment() {
      return _.isNil(this.registration.comment) ?
        `<span class="text-muted font-italic">${this.$t('misc.notProvided')}</span>` :
        this.registration.comment
    },
    formattedConfirmation() {
      return this.registration.confirmed ? '<i class="fa fa-check fa-lg text-success" aria-hidden="true"></i>' : '<i class="fa fa-close fa-lg text-danger" aria-hidden="true"></i>'
    },
    hasMissionEnded() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return moment().isAfter(moment(this.missionDetails.endTime))
    },
    hasMissionSlotlistCommunityPermission() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.slotlist.community`])
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    }
  },
  methods: {
    deleteMissionSlotRegistration() {
      this.$store.dispatch('deleteMissionSlotRegistration', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.registration.slotUid,
        registrationUid: this.registration.uid,
        slotOrderNumber: this.$store.getters.missionSlotDetails.orderNumber,
        slotTitle: this.$store.getters.missionSlotDetails.title,
      })
    },
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
