<template>
  <div>
    <table class="table table-striped" v-if="communityPermissions">
      <thead>
        <tr>
          <th style="width: 50%">{{ $t('user') }}</th>
          <th style="width: 40%">{{ $t('account.permission') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <community-permissions-row v-for="communityPermission in communityPermissions" :communityPermission="communityPermission" :key="communityPermission.uid"></community-permissions-row>
      </tbody>
      <tfoot v-show="communityPermissions.length >= 10">
        <tr>
          <th style="width: 50%">{{ $t('user') }}</th>
          <th style="width: 40%">{{ $t('account.permission') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import CommunityPermissionsRow from './CommunityPermissionsRow.vue'

export default {
  components: {
    CommunityPermissionsRow
  },
  props: [
    'communityPermissions'
  ]
}
</script>
