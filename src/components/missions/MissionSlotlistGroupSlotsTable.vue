<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 1%">#</th>
          <th style="width: 25%">{{ $t('mission.slot.role') }}</th>
          <th style="width: 34%">{{ $t('mission.slot.player') }}</th>
          <th style="width: 30%">{{ $t('mission.slot.description') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-slotlist-group-slots-row v-for="missionSlot in missionSlots" :missionSlotDetails="missionSlot" :key="missionSlot.uid"></mission-slotlist-group-slots-row>
      </tbody>
      <tfoot v-show="missionSlots.length >= 10">
        <tr>
          <th style="width: 1%">#</th>
          <th style="width: 25%">{{ $t('mission.slot.role') }}</th>
          <th style="width: 34%">{{ $t('mission.slot.player') }}</th>
          <th style="width: 30%">{{ $t('mission.slot.description') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import MissionSlotlistGroupSlotsRow from './MissionSlotlistGroupSlotsRow.vue'

export default {
  components: {
    MissionSlotlistGroupSlotsRow
  },
  props: [
    'missionSlots'
  ]
}
</script>
