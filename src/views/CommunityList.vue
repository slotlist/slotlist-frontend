<template>
  <div>
    <!-- Begin of content -->
    <div>
      <community-list-table></community-list-table>
      <div class="text-center" v-show="loggedIn">
        <router-link tag="button" type="button" class="btn btn-success" :to="{name: 'communityCreator'}">
          <i class="fa fa-plus" aria-hidden="true"></i> Create community
        </router-link>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
      <div v-show="working">
        <loading-overlay :message="working"></loading-overlay>
      </div>
    </div>
  </div>
</template>

<script>
import CommunityListTable from '../components/communities/CommunityListTable.vue'
import utils from '../utils'

export default {
  components: {
    CommunityListTable
  },
  computed: {
    working() {
      return this.$store.getters.working
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getCommunities')
  },
  created: function () {
    utils.setTitle('Communities')
  }
}
</script>
