<template>
  <div>
    <community-missions-table></community-missions-table>
    <div class="text-center">
      <button type="button" class="btn btn-secondary" @click="refreshCommunityMissions">
        <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
      </button>
    </div>
  </div>
</template>

<script>
import CommunityMissionsTable from './CommunityMissionsTable.vue'

export default {
  components: {
    CommunityMissionsTable
  },
  methods: {
    refreshCommunityMissions() {
      this.$store.dispatch('getCommunityMissions', this.$route.params.communitySlug)
    }
  }
}
</script>
