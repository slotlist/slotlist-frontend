<template>
  <div>
    <mission-permissions-table :missionPermissions="missionPermissions"></mission-permissions-table>
    <nav v-show="missionPermissionsPageCount > 1">
      <paginate ref="missionPermissionsPaginate" :pageCount="missionPermissionsPageCount" :clickHandler="paginateMissionPermissions" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <b-btn variant="secondary" @click="refreshMissionPermissions">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import MissionPermissionsTable from './MissionPermissionsTable.vue'

export default {
  components: {
    MissionPermissionsTable
  },
  props: [
    'missionPermissions'
  ],
  computed: {
    missionPermissionsPageCount() {
      return this.$store.getters.missionPermissionsPageCount
    }
  },
  methods: {
    paginateMissionPermissions(page) {
      this.$store.dispatch('getMissionPermissions', { missionSlug: this.$route.params.missionSlug, page })
    },
    refreshMissionPermissions() {
      this.$store.dispatch('getMissionPermissions', { missionSlug: this.$route.params.missionSlug })
    }
  }
}
</script>
