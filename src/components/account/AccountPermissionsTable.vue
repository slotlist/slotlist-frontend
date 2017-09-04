<template>
  <div>
    <table class="table table-striped" v-if="accountPermissions">
      <thead>
        <tr>
          <th style="width: 100%">{{ $t('account.permission') }}</th>
        </tr>
      </thead>
      <tbody>
        <account-permissions-row v-for="accountPermission in accountPermissions" :accountPermission="accountPermission" :key="accountPermission"></account-permissions-row>
      </tbody>
      <tfoot v-show="accountPermissions.length >= 10">
        <tr>
          <th style="width: 100%">{{ $t('account.permission') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import AccountPermissionsRow from './AccountPermissionsRow.vue'

export default {
  components: {
    AccountPermissionsRow
  },
  computed: {
    accountPermissions() {
      return this.$store.getters.accountPermissions
    }
  }
}
</script>
