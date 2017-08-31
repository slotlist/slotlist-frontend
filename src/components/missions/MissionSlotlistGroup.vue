<template>
  <div>
    <h5>{{ missionSlotGroup.title }}</h5>
    <div v-show="missionSlotGroup.description">{{ missionSlotGroup.description }}</div>
    <mission-slotlist-group-slots-table :missionSlots="missionSlotGroup.slots"></mission-slotlist-group-slots-table>
    <div class="text-center" v-if="isMissionEditor">
      <b-btn variant="success" @click="setMissionSlotGroupDetails" v-b-modal.missionSlotCreateModal>
        <i class="fa fa-plus" aria-hidden="true"></i> Create slot
      </b-btn>
      <click-confirm yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: 'Delete slot group?', yes: 'Confirm', no: 'Cancel'}">
        <b-btn variant="danger" @click="deleteMissionSlotGroup">
          <i class="fa fa-trash" aria-hidden="true"></i> Delete slot group
        </b-btn>
      </click-confirm>
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
    deleteMissionSlotGroup() {
      this.$store.dispatch('deleteMissionSlotGroup', {
        missionSlug: this.$route.params.missionSlug,
        slotGroupUid: this.missionSlotGroup.uid,
        slotGroupTitle: this.missionSlotGroup.title
      })
    },
    setMissionSlotGroupDetails() {
      this.$store.dispatch('setMissionSlotGroupDetails', this.missionSlotGroup);
    }
  }
}
</script>

<style scoped>
.click-confirm {
  display: inline;
}
</style>
