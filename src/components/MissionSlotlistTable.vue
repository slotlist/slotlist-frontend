<<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Role</th>
          <th>Player</th>
          <th>Comment</th>
        </tr>
      </thead>
        <mission-slotlist-row v-for="slot in slotlist" :info="slot" :key="slot.id"></mission-slotlist-row>
      <tbody>
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
      return this.$store.getters.slotlist
    }
  }
}
</script>
