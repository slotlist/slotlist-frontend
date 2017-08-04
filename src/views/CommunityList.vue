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
    <div>
    </div>
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
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
  beforeCreate: function () {
    this.$store.dispatch('getCommunities')
  },
  created: function () {
    utils.setTitle('Communities')
  },
  beforeDestroy: function () {
    this.$store.dispatch('clearCommunities')
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  }
}
</script>
