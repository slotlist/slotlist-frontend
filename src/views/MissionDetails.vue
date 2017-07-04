<template>
  <div>
    <mission-slotlist></mission-slotlist>
  </div>
</template>

<script>
import MissionSlotlist from 'components/MissionSlotlist.vue'
import utils from '../utils'

export default {
  components: {
    MissionSlotlist
  },
  beforeCreate: function () {
    this.$store.dispatch('getMissionDetails', this.$route.params.missionId)
  },
  created: function () {
    utils.setTitle('Testmission')
  },
  beforeDestroy: function () {
    this.$store.commit('clearMissionDetails')
  }
}
</script>
