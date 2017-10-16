<template>
  <div>
    <user-missions-table></user-missions-table>
    <nav v-show="userMissionsPageCount > 1">
      <paginate ref="userMissionsPaginate" :pageCount="userMissionsPageCount" :clickHandler="paginateUserMissions" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <b-btn variant="secondary" @click="paginateUserMissions(1)">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import UserMissionsTable from './UserMissionsTable.vue'

export default {
  components: {
    UserMissionsTable
  },
  beforeCreate: function() {
    this.$store.dispatch('getUserMissions', { userUid: this.$route.params.userUid })
  },
  computed: {
    userMissionsPageCount() {
      return this.$store.getters.userMissionsPageCount
    }
  },
  methods: {
    paginateUserMissions(page) {
      this.$store.dispatch('getUserMissions', { userUid: this.$route.params.userUid, page })
    },
  }
}
</script>
