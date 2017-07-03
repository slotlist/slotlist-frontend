<template>
  <div>
    <mission-slots></mission-slots>
  </div>
</template>

<script>
import MissionSlots from 'components/MissionSlots.vue'

export default {
  components: {
    MissionSlots
  },
  beforeCreate: function () {
    this.$store.dispatch('getMissionDetails', this.$route.params.missionId)
  },
  beforeDestroy: function () {
    this.$store.commit('clearMissionDetails')
  }
}
</script>