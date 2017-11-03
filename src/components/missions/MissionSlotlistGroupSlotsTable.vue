<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 1%" v-if="anyMissionSlotSelected"></th>
          <th style="width: 6%">#</th>
          <th :style="missionSlotRoleStyle">{{ $t('mission.slot.role') }}</th>
          <th :style="missionSlotPlayerStyle">{{ $t('mission.slot.player') }}</th>
          <th style="width: 28%" v-if="hasAnyMissionSlotDescription">{{ $t('mission.slot.description') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-slotlist-group-slots-row v-for="missionSlot in missionSlotGroup.slots" :missionSlotDetails="missionSlot" :missionSlotGroup="missionSlotGroup" :hasAnyMissionSlotDescription="hasAnyMissionSlotDescription" :key="missionSlot.uid"></mission-slotlist-group-slots-row>
      </tbody>
      <tfoot v-show="missionSlotGroup.slots.length >= 10">
        <tr>
          <th style="width: 1%" v-if="anyMissionSlotSelected"></th>
          <th style="width: 6%">#</th>
          <th :style="missionSlotRoleStyle">{{ $t('mission.slot.role') }}</th>
          <th :style="missionSlotPlayerStyle">{{ $t('mission.slot.player') }}</th>
          <th style="width: 28%" v-if="hasAnyMissionSlotDescription">{{ $t('mission.slot.description') }}</th>
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
    'missionSlotGroup'
  ],
  computed: {
    anyMissionSlotSelected() {
      return !_.isEmpty(this.$store.getters.missionSlotSelection)
    },
    hasAnyMissionSlotDescription() {
      return _.some(this.missionSlotGroup.slots, (slot) => {
        return !_.isNil(slot.description)
      });
    },
    missionSlotPlayerStyle() {
      if (this.hasAnyMissionSlotDescription) {
        return 'width: 27%'
      } else {
        return 'width: 44%'
      }
    },
    missionSlotRoleStyle() {
      if (this.hasAnyMissionSlotDescription) {
        return 'width: 27%'
      } else {
        return 'width: 40%'
      }
    }
  }
}
</script>
