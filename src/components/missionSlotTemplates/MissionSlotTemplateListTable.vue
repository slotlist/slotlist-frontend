<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 40%">{{ $t('mission.list.title') }}</th>
          <th style="width: 25%">{{ $t('mission.list.creator') }}</th>
          <th style="width: 15%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots.groups')}}</th>
          <th style="width: 10%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots')}}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <mission-slot-template-list-row v-for="missionSlotTemplate in missionSlotTemplates" :missionSlotTemplate="missionSlotTemplate" :key="missionSlotTemplate.uid"></mission-slot-template-list-row>
      </tbody>
      <tfoot v-show="missionSlotTemplates.length >= 10">
        <tr>
          <th style="width: 40%">{{ $t('mission.list.title') }}</th>
          <th style="width: 25%">{{ $t('mission.list.creator') }}</th>
          <th style="width: 15%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots.groups')}}</th>
          <th style="width: 10%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots')}}</th>
          <th style="width: 10%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import MissionSlotTemplateListRow from './MissionSlotTemplateListRow.vue'

export default {
  components: {
    MissionSlotTemplateListRow
  },
  computed: {
    missionSlotTemplates() {
      return this.$store.getters.missionSlotTemplates
    }
  }
}
</script>
