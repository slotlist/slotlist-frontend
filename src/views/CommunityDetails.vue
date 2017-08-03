<template>
  <div>
    <!-- Begin of content -->
    <div>
      <h3>Members</h3>
      <community-members-table></community-members-table>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
    </div>
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
      <div v-show="working">
        <loading-overlay :message="working"></loading-overlay>
      </div>
    </div>
    <!-- End of overlays -->
  </div>
</template>

<script>
import CommunityMembersTable from '../components/communities/CommunityMembersTable.vue'
import utils from '../utils'

export default {
  components: {
    CommunityMembersTable
  },
  computed: {
    working() {
      return this.$store.getters.working
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    isCommunityMember() {
      return this.$store.getters.isCommunityMember
    },
    canEditCommunity() {
      return this.$acl.can([`community.${this.$route.params.communitySlug}.founder`, `community.${this.$route.params.communitySlug}.leader`])
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getCommunityDetails', this.$route.params.communitySlug)
  },
  created: function () {
    utils.setTitle('Community')
  },
  beforeDestroy: function () {
    this.$store.dispatch('clearCommunityDetails')
  }
}
</script>
