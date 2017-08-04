<template>
  <div>
    <account-missions-table></account-missions-table>
    <div class="text-center">
      <button type="button" class="btn btn-secondary" @click="refreshAccountMissions">
        <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
      </button>
    </div>
  </div>
</template>

<script>
import AccountMissionsTable from './AccountMissionsTable.vue'

export default {
  components: {
    AccountMissionsTable
  },
  methods: {
    refreshAccountMissions() {
      this.$store.dispatch('getAccountDetails')
    }
  }
}
</script>
