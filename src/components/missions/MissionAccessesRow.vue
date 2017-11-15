<template>
  <tr>
    <td>{{ missionAccess.community ? $t('mission.access.list.type.community') : $t('mission.access.list.type.user') }}</td>
    <td>
      <router-link :to="routerLinkTarget">{{ missionAccess.community ? missionAccess.community.name : formatUserWithTag(missionAccess.user) }}</router-link>
    </td>
    <td class="text-center">
      <b-btn variant="danger" size="sm" @click="deleteMissionAccess">
        <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  props: [
    'missionAccess'
  ],
  computed: {
    routerLinkTarget() {
      if (!_.isNil(this.missionAccess.community)) {
        return {name: 'communityDetails', params: {communitySlug: this.missionAccess.community.slug}}
      } else {
        return {name: 'userDetails', params: {userUid: this.missionAccess.user.uid}}
      }
    }
  },
  methods: {
    deleteMissionAccess() {
      this.$store.dispatch('deleteMissionAccess', {
        missionSlug: this.$route.params.missionSlug,
        missionAccessUid: this.missionAccess.uid
      })
    }
  }
}
</script>
