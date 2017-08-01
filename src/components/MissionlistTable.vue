<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 15%">Start time</th>
          <th style="width: 25%">Title</th>
          <th style="width: 35%">Description</th>
          <th style="width: 10%">Creator</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <missionlist-row v-for="mission in missions" :mission="mission" :key="mission.uid"></missionlist-row>
      </tbody>
      <tfoot v-show="missions.length >= 10">
        <tr>
          <th style="width: 15%">Start time</th>
          <th style="width: 25%">Title</th>
          <th style="width: 35%">Description</th>
          <th style="width: 10%">Creator</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import MissionlistRow from './MissionlistRow.vue'

export default {
  components: {
    MissionlistRow
  },
  computed: {
    missions() {
      return this.$store.getters.missions
    }
  }
}
</script>
