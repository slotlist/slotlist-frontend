<template>
  <tr>
    <td>
      <div v-if="!isShawalla">{{ communityMember.nickname }}</div>
      <b-tooltip v-if="isShawalla" content='<i class="fa fa-wheelchair fa-2x text-center" aria-hidden="true"></i>'>{{ communityMember.nickname }}</b-tooltip>
    </td>
    <td class="text-center" v-html="formattedCommunityLeader"></td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Community member actions">
        <router-link tag="button" class="btn btn-primary" :to="{name: 'userDetails', params: {userUid: communityMember.uid}}">
          <i class="fa fa-info" aria-hidden="true"></i> Details
        </router-link>
        <click-confirm button-yes-icon="fa fa-ban" button-yes-class="btn btn-danger" button-size="sm" :messages="{title: 'Remove member?', yes: 'Confirm', no: 'Cancel'}">
          <button type="button" class="btn btn-danger btn-sm" v-show="canEditCommunityMembers" @click="removeCommunityMember">
            <i class="fa fa-ban" aria-hidden="true"></i> Remove
          </button>
        </click-confirm>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'communityMember'
  ],
  computed: {
    isShawalla() {
      return this.communityMember.nickname.toLowerCase() === 'shawalla'
    },
    formattedCommunityLeader() {
      return this.communityMember.leader ? '<i class="fa fa-check fa-lg text-success" aria-hidden="true"></i>' : ''
    },
    canEditCommunityMembers() {
      return this.$acl.can([`community.${this.$route.params.communitySlug}.founder`, `community.${this.$route.params.communitySlug}.leader`, `community.${this.$route.params.communitySlug}.recruitment`])
    }
  },
  methods: {
    removeCommunityMember() {
      this.$store.dispatch('removeCommunityMember', { communitySlug: this.$route.params.communitySlug, memberUid: this.communityMember.uid, memberNickname: this.communityMember.nickname })
    }
  }
}
</script>
