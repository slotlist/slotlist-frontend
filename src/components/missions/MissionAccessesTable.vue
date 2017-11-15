<template>
  <div>
    <table class="table table-striped" v-if="missionAccesses">
      <thead>
        <tr>
          <th style="width: 20%">{{ $t('mission.access.list.type') }}</th>
          <th style="width: 70%">{{ $t('mission.access.list.name') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-accesses-row v-for="missionAccess in missionAccesses" :missionAccess="missionAccess" :key="missionAccess.uid"></mission-accesses-row>
      </tbody>
      <tfoot v-show="missionAccesses.length >= 10">
        <tr>
          <th style="width: 20%">{{ $t('mission.access.list.type') }}</th>
          <th style="width: 70%">{{ $t('mission.access.list.name') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import MissionAccessesRow from './MissionAccessesRow.vue'

export default {
  components: {
    MissionAccessesRow
  },
  props: [
    'missionAccesses'
  ]
}
</script>
