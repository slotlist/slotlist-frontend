<template>
  <div>
    <account-missions-table></account-missions-table>
    <div class="text-center">
      <b-btn variant="secondary" @click="refreshAccountMissions">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
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
