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
        <mission-slots-row v-for="slot in slots" :info="slot" :key="slot.id"></mission-slots-row>
      <tbody>
      </tbody>
    </table>
  </div>
</template>

<script>
import MissionSlotsRow from './MissionSlotsRow.vue'

export default {
  components: {
    MissionSlotsRow
  },
  computed: {
    slots() {
      return this.$store.getters.slots
    }
  }
}
</script>