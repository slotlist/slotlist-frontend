<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 6%">#</th>
          <th :style="missionSlotRoleStyle">{{ $t('mission.slot.role') }}</th>
          <th style="width: 50%" v-if="hasAnyMissionSlotDescription">{{ $t('mission.slot.description') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-slot-template-slotlist-group-slots-row v-for="(missionSlot, index) in missionSlotGroup.slots" :index="index" :missionSlotCount="missionSlotGroup.slots.length" :missionSlotDetails="missionSlot" :missionSlotGroup="missionSlotGroup" :hasAnyMissionSlotDescription="hasAnyMissionSlotDescription" :key="missionSlot.uid"></mission-slot-template-slotlist-group-slots-row>
      </tbody>
      <tfoot v-show="missionSlotGroup.slots.length >= 10">
        <tr>
          <th style="width: 6%">#</th>
          <th :style="missionSlotRoleStyle">{{ $t('mission.slot.role') }}</th>
          <th style="width: 50%" v-if="hasAnyMissionSlotDescription">{{ $t('mission.slot.description') }}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import * as _ from 'lodash'

import MissionSlotTemplateSlotlistGroupSlotsRow from './MissionSlotTemplateSlotlistGroupSlotsRow.vue'

export default {
  components: {
    MissionSlotTemplateSlotlistGroupSlotsRow
  },
  props: [
    'missionSlotGroup'
  ],
  computed: {
    hasAnyMissionSlotDescription() {
      return _.some(this.missionSlotGroup.slots, (slot) => {
        return !_.isNil(slot.description)
      });
    },
    missionSlotRoleStyle() {
      if (this.hasAnyMissionSlotDescription) {
        return 'width: 34%'
      } else {
        return 'width: 84%'
      }
    }
  }
}
</script>
