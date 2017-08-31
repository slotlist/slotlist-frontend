<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 1%">#</th>
          <th style="width: 25%">Role</th>
          <th style="width: 34%">Player</th>
          <th style="width: 30%">Description</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <mission-slotlist-group-slots-row v-for="missionSlot in missionSlots" :missionSlotDetails="missionSlot" :key="missionSlot.uid"></mission-slotlist-group-slots-row>
      </tbody>
      <tfoot v-show="missionSlots.length >= 10">
        <tr>
          <th style="width: 1%">#</th>
          <th style="width: 25%">Role</th>
          <th style="width: 34%">Player</th>
          <th style="width: 30%">Description</th>
          <th style="width: 10%" class="text-center">Actions</th>
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
