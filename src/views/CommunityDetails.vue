<template>
  <div>
    <!-- Begin of content -->
    <div v-if="communityDetails">
      <h1 class="display-4  text-center">{{ communityDetails.name }}</h1>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Members</h4>
          <community-members></community-members>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Missions</h4>
          <community-missions></community-missions>
        </div>
      </div>
      <br>
      <div class="card" v-if="canEditCommunityMembers">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Applications</h4>
          <community-applications></community-applications>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
    </div>
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
    </div>
    <!-- End of overlays -->
  </div>
</template>

<script>
import CommunityApplications from '../components/communities/CommunityApplications.vue'
import CommunityMembers from '../components/communities/CommunityMembers.vue'
import CommunityMissions from '../components/communities/CommunityMissions.vue'
import utils from '../utils'

export default {
  components: {
    CommunityApplications,
    CommunityMembers,
    CommunityMissions
  },
  computed: {
    working() {
      return this.$store.getters.working
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    communityDetails() {
      return this.$store.getters.communityDetails
    },
    canEditCommunity() {
      return this.$acl.can([`community.${this.$route.params.communitySlug}.founder`, `community.${this.$route.params.communitySlug}.leader`])
    },
    canEditCommunityMembers() {
      return this.$acl.can([`community.${this.$route.params.communitySlug}.founder`, `community.${this.$route.params.communitySlug}.leader`, `community.${this.$route.params.communitySlug}.recruitment`])
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
