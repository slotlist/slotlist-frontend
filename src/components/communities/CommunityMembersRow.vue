<template>
  <tr>
    <td>{{ communityMember.nickname }}</td>
    <td v-html="formattedCommunityLeader"></td>
    <td class="text-center">
      <router-link tag="button" class="btn btn-primary btn-sm" :to="{name: 'userDetails', params: {userUid: communityMember.uid}}">
        <i class="fa fa-info" aria-hidden="true"></i> Details
      </router-link>
      <button type="button" class="btn btn-danger btn-sm" v-show="canEditCommunityMembers" @click="removeCommunityMember">
        <i class="fa fa-trash" aria-hidden="true"></i> Remove
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'communityMember'
  ],
  computed: {
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
