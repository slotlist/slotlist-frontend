<template>
  <div>
    <mission-slotlist-table></mission-slotlist-table>
    <div class="text-center">
      <div class="btn-group" role="group" aria-label="Mission slotlist actions">
        <button type="button" class="btn btn-secondary" @click="refreshSlotlist">
          <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
        </button>
        <button type="button" class="btn btn-primary" v-if="isMissionEditor" @click="createSlot">
          <i class="fa fa-plus" aria-hidden="true"></i> Create Slot
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MissionSlotlistTable from './MissionSlotlistTable.vue'

export default {
  components: {
    MissionSlotlistTable
  },
  computed: {
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    }
  },
  methods: {
    createSlot() {
      console.log('createSlot')
    },
    refreshSlotlist() {
      this.$store.dispatch('clearMissionSlotlist')
      this.$store.dispatch('getMissionSlotlist', this.$route.params.missionSlug)
    }
  }
}
</script>
