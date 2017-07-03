<<template>
  <div>
    <mission-slots-table></mission-slots-table>
  </div>
</template>

<script>
import MissionSlotsTable from './MissionSlotsTable.vue'

export default {
  components: {
    MissionSlotsTable
  },
  beforeCreate: function () {
    this.$store.dispatch('getMissionDetails', this.$route.params.missionId)
  },
  beforeDestroy: function () {
    this.$store.commit('clearMissionDetails')
  }
}
</script>