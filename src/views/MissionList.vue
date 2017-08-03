<template>
  <div>
    <!-- Begin of content -->
    <div v-show="loaded">
      <mission-list-table></mission-list-table>
      <div class="text-center" v-show="loggedIn">
        <router-link tag="button" type="button" class="btn btn-success" :to="{name: 'missionCreator'}">
          <i class="fa fa-plus" aria-hidden="true"></i> Create mission
        </router-link>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
      <div v-show="!loaded">
        <loading-overlay message="Loading Missions..."></loading-overlay>
      </div>
    </div>
  </div>
</template>

<script>
import MissionListTable from '../components/MissionListTable.vue'
import utils from '../utils'

export default {
  components: {
    MissionListTable
  },
  computed: {
    loaded() {
      return this.$store.getters.missionsLoaded
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  },
  beforeCreate: function () {
    this.$store.dispatch("getMissions")
  },
  created: function () {
    utils.setTitle('Missions')
  }
}
</script>
