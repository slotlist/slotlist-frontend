<template>
  <tr>
    <td>
      <div v-if="!isShawalla">{{ communityMember.nickname }}</div>
      <b-popover v-if="isShawalla" content='<i class="fa fa-wheelchair fa-2x text-center" aria-hidden="true"></i>' :triggers="['hover']">{{ communityMember.nickname }}</b-popover>
    </td>
    <td class="text-center" v-html="formattedCommunityLeader"></td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Community member actions">
        <b-btn variant="primary" size="sm" :to="{name: 'userDetails', params: {userUid: communityMember.uid}}">
          <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
        </b-btn>
        <click-confirm v-if="canEditCommunityMembers" yes-icon="fa fa-ban" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('community.member.confirm.remove'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="danger" size="sm" @click="removeCommunityMember">
            <i class="fa fa-ban" aria-hidden="true"></i> {{ $t('button.remove') }}
          </b-btn>
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
