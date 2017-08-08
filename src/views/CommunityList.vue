<template>
  <div>
    <!-- Begin of content -->
    <div>
      <community-list-table></community-list-table>
      <nav v-show="communityListPageCount > 1">
        <paginate ref="communityListPaginate" :pageCount="communityListPageCount" :initial-page="0" :clickHandler="communityListPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
      </nav>
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
    communityListPageCount() {
      return this.$store.getters.communityListPageCount
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  },
  methods: {
    communityListPaginate(page) {
      this.$store.dispatch('getCommunities', { page })
    }
  }
}
</script>
