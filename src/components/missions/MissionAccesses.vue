<template>
  <div>
    <mission-accesses-table :missionAccesses="missionAccesses"></mission-accesses-table>
    <nav v-show="missionAccessesPageCount > 1">
      <paginate ref="missionAccessesPaginate" :pageCount="missionAccessesPageCount" :clickHandler="paginateMissionAccesses" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <b-btn variant="secondary" @click="refreshMissionAccesses">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import MissionAccessesTable from './MissionAccessesTable.vue'

export default {
  components: {
    MissionAccessesTable
  },
  props: [
    'missionAccesses'
  ],
  computed: {
    missionAccessesPageCount() {
      return this.$store.getters.missionAccessesPageCount
    }
  },
  methods: {
    paginateMissionAccesses(page) {
      this.$store.dispatch('getMissionAccesses', { missionSlug: this.$route.params.missionSlug, page })
    },
    refreshMissionAccesses() {
      this.$store.dispatch('getMissionAccesses', { missionSlug: this.$route.params.missionSlug })
    }
  }
}
</script>
