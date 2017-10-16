<template>
  <div>
    <community-missions-table></community-missions-table>
    <nav v-show="communityMissionsPageCount > 1">
      <paginate ref="communityMissionsPaginate" :pageCount="communityMissionsPageCount" :clickHandler="paginateCommunityMissions" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <b-btn variant="secondary" @click="paginateCommunityMissions(1)">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import CommunityMissionsTable from './CommunityMissionsTable.vue'

export default {
  components: {
    CommunityMissionsTable
  },
  beforeCreate: function() {
    this.$store.dispatch('getCommunityMissions', { communitySlug: this.$route.params.communitySlug })
  },
  computed: {
    communityMissionsPageCount() {
      return this.$store.getters.communityMissionsPageCount
    }
  },
  methods: {
    paginateCommunityMissions(page) {
      this.$store.dispatch('getCommunityMissions', { communitySlug: this.$route.params.communitySlug, page })
    }
  }
}
</script>
