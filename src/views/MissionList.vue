<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Initiator</th>
          <th>Description</th>
          <th>Details</th>
        </tr>
      </thead>
      <missionlist-row v-for="mission in missionList" :info="mission" :key="mission.uid"></missionlist-row>
      <tbody>
      </tbody>
    </table>
  </div>
</template>

<script>
import MissionlistRow from 'components/MissionlistRow.vue'
import utils from '../utils'

export default {
  components: {
    MissionlistRow
  },
  computed: {
    missionList() {
      return this.$store.getters.missionList
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
