<template>
  <div>
    <mission-slotlist-group v-for="missionSlotGroup in missionSlotGroups" :missionSlotGroup="missionSlotGroup" :key="missionSlotGroup.uid"></mission-slotlist-group>
    <br>
    <div class="text-center">
      <b-btn variant="success" v-if="isMissionEditor" v-b-modal.createMissionSlotGroupModal>
        <i class="fa fa-plus" aria-hidden="true"></i> Create slot group
      </b-btn>
      <b-btn @click="refreshMissionSlotlist">
        <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
      </b-btn>
    </div>
  </div>
</template>

<script>
import MissionSlotlistGroup from './MissionSlotlistGroup.vue'

export default {
  components: {
    MissionSlotlistGroup
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    missionSlotGroups() {
      return this.$store.getters.missionSlotGroups
    }
  },
  methods: {
    refreshMissionSlotlist() {
      this.$store.dispatch('getMissionSlotlist', { missionSlug: this.$route.params.missionSlug })
    }
  }
}
</script>
