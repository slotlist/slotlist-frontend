<template>
  <div>
    <table class="table table-striped" v-if="accountMissions">
      <thead>
        <tr>
          <th style="width: 15%">Start time</th>
          <th style="width: 35%">Title</th>
          <th style="width: 35%">Description</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <account-missions-row v-for="accountMission in accountMissions" :accountMission="accountMission" :key="accountMission.uid"></account-missions-row>
      </tbody>
      <tfoot v-show="accountMissions.length >= 10">
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
import AccountMissionsRow from './AccountMissionsRow.vue'

export default {
  components: {
    AccountMissionsRow
  },
  computed: {
    accountMissions() {
      return this.$store.getters.accountMissions
    }
  }
}
</script>
