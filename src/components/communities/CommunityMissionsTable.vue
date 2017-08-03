<template>
  <div>
    <table class="table table-striped" v-if="communityMissions">
      <thead>
        <tr>
          <th style="width: 15%">Start time</th>
          <th style="width: 25%">Title</th>
          <th style="width: 25%">Description</th>
          <th style="width: 20%">Creator</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <community-missions-row v-for="communityMission in communityMissions" :communityMission="communityMission" :key="communityMission.uid"></community-missions-row>
      </tbody>
      <tfoot v-show="communityMissions.length >= 10">
        <tr>
          <th style="width: 15%">Start time</th>
          <th style="width: 25%">Title</th>
          <th style="width: 25%">Description</th>
          <th style="width: 20%">Creator</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import CommunityMissionsRow from './CommunityMissionsRow.vue'

export default {
  components: {
    CommunityMissionsRow
  },
  computed: {
    communityMissions() {
      return this.$store.getters.communityMissions
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getCommunityMissions', this.$route.params.communitySlug)
  }
}
</script>
