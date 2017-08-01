<template>
  <div>
    <!-- Begin of content -->
    <div v-show="loaded">
      <missionlist-table></missionlist-table>
      <div class="text-center" v-show="loggedIn">
        <button type="button" class="btn btn-success" @click="redirectToMissionCreate">
          <i class="fa fa-plus" aria-hidden="true"></i> Create mission
        </button>
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
import MissionlistTable from '../components/MissionlistTable.vue'
import utils from '../utils'

export default {
  components: {
    MissionlistTable
  },
  computed: {
    loaded() {
      return this.$store.getters.missionsLoaded
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  },
  methods: {
    redirectToMissionCreate() {
      this.$router.push({ name: 'missionCreator' })
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
