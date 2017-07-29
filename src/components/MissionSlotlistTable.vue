<<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Role</th>
          <th>Player</th>
          <th>Comment</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <mission-slotlist-row v-for="slot in slotlist" :missionSlot="slot" :key="slot.id"></mission-slotlist-row>
      </tbody>
    </table>
  </div>
</template>

<script>
import MissionSlotlistRow from './MissionSlotlistRow.vue'

export default {
  components: {
    MissionSlotlistRow
  },
  computed: {
    slotlist() {
      return this.$store.getters.missionSlotlist
    }
  }
}
</script>
