<template>
  <div>
    <mission-slot-registrations-table :slotDetails="slotDetails"></mission-slot-registrations-table>
    <div class="text-center">
      <div class="btn-group" role="group" aria-label="Mission slot registrations actions">
        <button type="button" class="btn btn-secondary" @click="refreshSlotRegistrations">
          <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
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
  methods: {
    refreshSlotRegistrations() {
      this.$store.dispatch('clearMissionSlotRegistrations')
      this.$store.dispatch('getMissionSlotRegistrations', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.slotDetails.uid,
        slotOrderNumber: this.slotDetails.orderNumber,
        slotTitle: this.slotDetails.title
      })
    }
  },
  props: [
    'slotDetails'
  ]
}
</script>
