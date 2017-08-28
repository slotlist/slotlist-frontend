<template>
  <div>
    <div>
      <mission-slotlist-group v-for="missionSlotGroup in missionSlotGroups" :missionSlotGroup="missionSlotGroup" :key="missionSlotGroup.uid"></mission-slotlist-group>
    </div>
    <br>
    <div class="text-center">
      <div class="btn-group" role="group" aria-label="Mission slotlist actions">
        <button type="button" class="btn btn-success" v-if="isMissionEditor" @click="createMissionSlotGroup">
          <i class="fa fa-plus" aria-hidden="true"></i> Create slot group
        </button>
        <button type="button" class="btn btn-secondary" @click="refreshMissionSlotlist">
          <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
        </button>
      </div>
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
      return this.$store.getters.filteredMissionSlotGroups
    }
  },
  methods: {
    refreshMissionSlotlist() {
      this.$store.dispatch('getMissionSlotlist', this.$route.params.missionSlug)
    }
  }
}
</script>
