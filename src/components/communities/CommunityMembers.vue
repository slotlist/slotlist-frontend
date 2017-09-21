<template>
  <div>
    <community-members-table></community-members-table>
    <div class="text-center">
      <div class="btn-group" role="group" aria-label="Community members actions">
        <b-btn variant="secondary" @click="refreshCommunityMembers">
          <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
        </b-btn>
        <b-btn variant="primary" v-if="loggedIn" :disabled="isCommunityMember || communityApplicationStatus !== null" @click="applyToCommunity">
          <i class="fa fa-user-plus" aria-hidden="true"></i> {{ $t('button.apply') }}
        </b-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CommunityMembersTable from './CommunityMembersTable.vue'

export default {
  components: {
    CommunityMembersTable
  },
  computed: {
    communityApplicationStatus() {
      return this.$store.getters.communityApplicationStatus
    },
    isCommunityMember() {
      const user = this.$store.getters.user

      if (_.isNil(user)) {
        return false
      } else if (_.isNil(user.community)) {
        return false
      }

      return user.community.slug === this.$route.params.communitySlug
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  },
  methods: {
    applyToCommunity() {
      this.$store.dispatch('applyToCommunity', this.$route.params.communitySlug)
    },
    refreshCommunityMembers() {
      this.$store.dispatch('getCommunityDetails', this.$route.params.communitySlug)
    }
  }
}
</script>
