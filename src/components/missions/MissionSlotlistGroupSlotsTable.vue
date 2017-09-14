<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 1%">#</th>
          <th :style="missionSlotRoleStyle">{{ $t('mission.slot.role') }}</th>
          <th :style="missionSlotPlayerStyle">{{ $t('mission.slot.player') }}</th>
          <th style="width: 30%" v-if="hasAnyMissionSlotDescription">{{ $t('mission.slot.description') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-slotlist-group-slots-row v-for="missionSlot in missionSlots" :missionSlotDetails="missionSlot" :key="missionSlot.uid" :hasAnyMissionSlotDescription="hasAnyMissionSlotDescription"></mission-slotlist-group-slots-row>
      </tbody>
      <tfoot v-show="missionSlots.length >= 10">
        <tr>
          <th style="width: 1%">#</th>
          <th :style="missionSlotRoleStyle">{{ $t('mission.slot.role') }}</th>
          <th :style="missionSlotPlayerStyle">{{ $t('mission.slot.player') }}</th>
          <th style="width: 30%" v-if="hasAnyMissionSlotDescription">{{ $t('mission.slot.description') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import * as _ from 'lodash'

import MissionSlotlistGroupSlotsRow from './MissionSlotlistGroupSlotsRow.vue'

export default {
  components: {
    MissionSlotlistGroupSlotsRow
  },
  props: [
    'missionSlots'
  ],
  computed: {
    hasAnyMissionSlotDescription() {
      return _.some(this.missionSlots, (slot) => {
        return !_.isNil(slot.description)
      });
    },
    missionSlotPlayerStyle() {
      if (this.hasAnyMissionSlotDescription) {
        return 'width: 34%'
      } else {
        return 'width: 49%'
      }
    },
    missionSlotRoleStyle() {
      if (this.hasAnyMissionSlotDescription) {
        return 'width: 25%'
      } else {
        return 'width: 40%'
      }
    }
  }
}
</script>
