<template>
  <div>
    <community-permissions-table :communityPermissions="communityPermissions"></community-permissions-table>
    <nav v-show="communityPermissionsPageCount > 1">
      <paginate ref="communityPermissionsPaginate" :pageCount="communityPermissionsPageCount" :clickHandler="paginateCommunityPermissions" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <b-btn variant="secondary" @click="refreshCommunityPermissions">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import CommunityPermissionsTable from './CommunityPermissionsTable.vue'

export default {
  components: {
    CommunityPermissionsTable
  },
  props: [
    'communityPermissions'
  ],
  computed: {
    communityPermissionsPageCount() {
      return this.$store.getters.communityPermissionsPageCount
    }
  },
  methods: {
    paginateCommunityPermissions(page) {
      this.$store.dispatch('getCommunityPermissions', { communitySlug: this.$route.params.communitySlug, page })
    },
    refreshCommunityPermissions() {
      this.$store.dispatch('getCommunityPermissions', { communitySlug: this.$route.params.communitySlug })
    }
  }
}
</script>
