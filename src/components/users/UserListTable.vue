<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 55%">{{ $t('user.nickname') }}</th>
          <th style="width: 35%">{{ $t('mission.community') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <user-list-row v-for="user in users" :user="user" :key="user.uid"></user-list-row>
      </tbody>
      <tfoot v-show="users.length >= 10">
        <tr>
          <th style="width: 55%">{{ $t('user.nickname') }}</th>
          <th style="width: 35%">{{ $t('mission.community') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import UserListRow from './UserListRow.vue'

export default {
  components: {
    UserListRow
  },
  computed: {
    users() {
      return this.$store.getters.users
    }
  }
}
</script>
