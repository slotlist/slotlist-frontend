<template>
  <div>
    <table class="table table-striped" v-if="userMissions">
      <thead>
        <tr>
          <th style="width: 15%">Start time</th>
          <th style="width: 35%">Title</th>
          <th style="width: 35%">Description</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <user-missions-row v-for="userMission in userMissions" :userMission="userMission" :key="userMission.uid"></user-missions-row>
      </tbody>
      <tfoot v-show="userMissions.length >= 10">
        <tr>
          <th style="width: 15%">Start time</th>
          <th style="width: 35%">Title</th>
          <th style="width: 35%">Description</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import UserMissionsRow from './UserMissionsRow.vue'

export default {
  components: {
    UserMissionsRow
  },
  computed: {
    userMissions() {
      return this.$store.getters.userMissions
    }
  }
}
</script>
