<template>
  <div>
    <mission-slotlist-table></mission-slotlist-table>
    <div class="text-center">
      <button type="button" class="btn btn-primary" v-if="isMissionEditor" @click="createSlot">Create Slot</button>
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
    }
  }
}
</script>
