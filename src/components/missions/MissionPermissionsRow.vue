<template>
  <tr>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: missionPermission.user.uid}}">{{ formatUserWithTag(missionPermission.user) }}</router-link>
    </td>
    <td v-html="formattedMissionPermission"></td>
    <td class="text-center">
      <b-btn variant="danger" size="sm" :disabled="isMissionCreatorPermission" @click="deleteMissionPermission">
        <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  props: [
    'missionPermission'
  ],
  computed: {
    formattedMissionPermission() {
      const permission = this.missionPermission.permission.toLowerCase()
      if (_.endsWith(permission, 'creator')) {
        return this.$t('mission.permission.creator')
      } else if (_.endsWith(permission, 'editor')) {
        return this.$t('mission.permission.editor')
      } else if (_.endsWith(permission, 'slotlist.community')) {
        return this.$t('mission.permission.slotlist.community')
      } else {
        return `<span class="text-italic font-muted">${this.missionPermission.permission}</span>`
      }
    },
    isMissionCreatorPermission() {
      return _.endsWith(this.missionPermission.permission.toLowerCase(), 'creator')
    }
  },
  methods: {
    deleteMissionPermission() {
      this.$store.dispatch('deleteMissionPermission', {
        missionSlug: this.$route.params.missionSlug,
        permissionUid: this.missionPermission.uid
      })
    }
  }
}
</script>
