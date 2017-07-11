<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th class="w-25">Title</th>
          <th class="w-50">Description</th>
          <th class="w-15">Initiator</th>
          <th class="w-10 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <missionlist-row v-for="mission in missions" :mission="mission" :key="mission.uid"></missionlist-row>
      </tbody>
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
