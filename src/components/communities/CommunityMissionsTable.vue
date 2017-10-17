<template>
  <div>
    <table class="table table-striped" v-if="communityMissions">
      <thead>
        <tr>
          <th style="width: 16%">{{ $t('mission.startTime') }}</th>
          <th style="width: 44%">{{ $t('mission.title') }}</th>
          <th style="width: 30%">{{ $t('mission.creator') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <community-missions-row v-for="communityMission in communityMissions" :communityMission="communityMission" :key="communityMission.uid"></community-missions-row>
      </tbody>
      <tfoot v-show="communityMissions.length >= 10">
        <tr>
          <th style="width: 16%">{{ $t('mission.startTime') }}</th>
          <th style="width: 44%">{{ $t('mission.title') }}</th>
          <th style="width: 30%">{{ $t('mission.creator') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
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
  }
}
</script>
