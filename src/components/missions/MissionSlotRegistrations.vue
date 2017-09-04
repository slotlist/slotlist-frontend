<template>
  <div>
    <mission-slot-registrations-table></mission-slot-registrations-table>
    <div class="text-center">
      <div class="btn-group" role="group" aria-label="Mission slot registrations actions">
        <button type="button" class="btn btn-secondary" @click="refreshMissionSlotRegistrations">
          <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MissionSlotRegistrationsTable from './MissionSlotRegistrationsTable.vue'

export default {
  components: {
    MissionSlotRegistrationsTable
  },
  props: [
    'missionSlotDetails'
  ],
  methods: {
    refreshMissionSlotRegistrations() {
      this.$store.dispatch('getMissionSlotRegistrations', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })
    }
  }
}
</script>
