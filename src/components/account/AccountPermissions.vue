<template>
  <div>
    <account-permissions-table></account-permissions-table>
    <div class="text-center">
      <b-btn variant="secondary" @click="refreshAccountPermissions">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import AccountPermissionsTable from './AccountPermissionsTable.vue'

export default {
  components: {
    AccountPermissionsTable
  },
  methods: {
    refreshAccountPermissions() {
      this.$store.dispatch('getAccountDetails')
    }
  }
}
</script>
