<template>
  <div>
    <table class="table table-striped" v-if="missionPermissions">
      <thead>
        <tr>
          <th style="width: 50%">{{ $t('user') }}</th>
          <th style="width: 40%">{{ $t('account.permission') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-permissions-row v-for="missionPermission in missionPermissions" :missionPermission="missionPermission" :key="missionPermission.uid"></mission-permissions-row>
      </tbody>
      <tfoot v-show="missionPermissions.length >= 10">
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
import MissionPermissionsRow from './MissionPermissionsRow.vue'

export default {
  components: {
    MissionPermissionsRow
  },
  props: [
    'missionPermissions'
  ]
}
</script>
