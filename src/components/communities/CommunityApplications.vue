<template>
  <div>
    <community-applications-table></community-applications-table>
    <nav v-show="communityApplicationsPageCount > 1">
      <paginate ref="communityApplicationsPaginate" :pageCount="communityApplicationsPageCount" :clickHandler="paginateCommunityApplications" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <b-btn variant="secondary" @click="refreshCommunityApplications">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import CommunityApplicationsTable from './CommunityApplicationsTable.vue'

export default {
  components: {
    CommunityApplicationsTable
  },
  beforeCreate: function() {
    this.$store.dispatch('getCommunityApplications', { communitySlug: this.$route.params.communitySlug })
  },
  computed: {
    communityApplicationsPageCount() {
      return this.$store.getters.communityApplicationsPageCount
    }
  },
  methods: {
    paginateCommunityApplications(page) {
      this.$store.dispatch('getCommunityApplications', { communitySlug: this.$route.params.communitySlug, page })
    },
    refreshCommunityApplications() {
      this.$store.dispatch('getCommunityApplications', { communitySlug: this.$route.params.communitySlug })
    }
  }
}
</script>
