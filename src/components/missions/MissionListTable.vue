<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 15%">{{ $t('mission.list.startTime') }}</th>
          <th style="width: 25%">{{ $t('mission.list.title') }}</th>
          <th style="width: 25%">{{ $t('mission.list.description') }}</th>
          <th style="width: 20%">{{ $t('mission.list.creator') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-list-row v-for="mission in missions" :mission="mission" :key="mission.uid"></mission-list-row>
      </tbody>
      <tfoot v-show="missions.length >= 10">
        <tr>
          <th style="width: 15%">{{ $t('mission.list.startTime') }}</th>
          <th style="width: 25%">{{ $t('mission.list.title') }}</th>
          <th style="width: 25%">{{ $t('mission.list.description') }}</th>
          <th style="width: 20%">{{ $t('mission.list.creator') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import MissionListRow from './MissionListRow.vue'

export default {
  components: {
    MissionListRow
  },
  computed: {
    missions() {
      return this.$store.getters.missions
    }
  }
}
</script>
