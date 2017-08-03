<template>
  <div>
    <community-applications-table></community-applications-table>
    <div class="text-center">
      <button type="button" class="btn btn-secondary" @click="refreshCommunityApplications">
        <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
      </button>
    </div>
  </div>
</template>

<script>
import CommunityApplicationsTable from './CommunityApplicationsTable.vue'

export default {
  components: {
    CommunityApplicationsTable
  },
  methods: {
    refreshCommunityApplications() {
      this.$store.dispatch('getCommunityApplications', this.$route.params.communitySlug)
    }
  }
}
</script>
