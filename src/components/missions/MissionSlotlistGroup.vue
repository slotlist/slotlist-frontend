<template>
  <div>
    <h4>{{ missionSlotGroup.title }}</h4>
    <div v-show="missionSlotGroup.description">{{ missionSlotGroup.description }}</div>
    <mission-slotlist-group-slots-table :missionSlots="missionSlotGroup.slots"></mission-slotlist-group-slots-table>
    <div class="text-center" v-if="isMissionEditor">
      <div class="btn-group" role="group" aria-label="Mission slot group actions">
        <button type="button" class="btn btn-primary" @click="createMissionSlot">
          <i class="fa fa-plus" aria-hidden="true"></i> Create slot
        </button>
        <button type="button" class="btn btn-danger" @click="deleteMissionSlotGroup">
          <i class="fa fa-trash" aria-hidden="true"></i> Delete slot group
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MissionSlotlistGroupSlotsTable from './MissionSlotlistGroupSlotsTable.vue'

export default {
  components: {
    MissionSlotlistGroupSlotsTable
  },
  props: [
    'missionSlotGroup'
  ],
  computed: {
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    }
  },
  methods: {
    createMissionSlot() {
      console.log("createMissionSlot")
    },
    deleteMissionSlotGroup() {
      console.log(`deleteMissionSlotGroup ${this.missionSlotGroup.uid}`)
    }
  }
}
</script>
