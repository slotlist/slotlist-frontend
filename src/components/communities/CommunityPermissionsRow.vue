<template>
  <tr>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: communityPermission.user.uid}}">{{ formatUserWithTag(communityPermission.user) }}</router-link>
    </td>
    <td v-html="formattedCommunityPermission"></td>
    <td class="text-center">
      <b-btn variant="danger" size="sm" :disabled="isCommunityFounderPermission" @click="deleteCommunityPermission">
        <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  props: [
    'communityPermission'
  ],
  computed: {
    formattedCommunityPermission() {
      const permission = this.communityPermission.permission.toLowerCase()
      if (_.endsWith(permission, 'founder')) {
        return this.$t('community.permission.founder')
      } else if (_.endsWith(permission, 'leader')) {
        return this.$t('community.permission.leader')
      } else if (_.endsWith(permission, 'recruitment')) {
        return this.$t('community.permission.recruitment')
      } else {
        return `<span class="text-italic font-muted">${this.communityPermission.permission}</span>`
      }
    },
    isCommunityFounderPermission() {
      return _.endsWith(this.communityPermission.permission.toLowerCase(), 'founder')
    }
  },
  methods: {
    deleteCommunityPermission() {
      this.$store.dispatch('deleteCommunityPermission', {
        communitySlug: this.$route.params.communitySlug,
        permissionUid: this.communityPermission.uid
      })
    }
  }
}
</script>
