<template>
  <div>
    <div v-show="loaded">
      <missionlist-table></missionlist-table>
      <div class="text-center">
        <button type="button" class="btn btn-success">Create mission</button>
      </div>
    </div>
    <div v-show="!loaded">
      <loading-overlay message="Loading Missions..."></loading-overlay>
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
