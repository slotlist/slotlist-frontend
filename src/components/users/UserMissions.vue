<template>
  <div>
    <user-missions-table></user-missions-table>
    <div class="text-center">
      <button type="button" class="btn btn-secondary" @click="refreshUserMissions">
        <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
      </button>
    </div>
  </div>
</template>

<script>
import UserMissionsTable from './UserMissionsTable.vue'

export default {
  components: {
    UserMissionsTable
  },
  methods: {
    refreshUserMissions() {
      this.$store.dispatch('getUserMissions', this.$route.params.userUid)
    }
  }
}
</script>
