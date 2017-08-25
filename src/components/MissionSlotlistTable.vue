<<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 1%">#</th>
          <th style="width: 25%">Role</th>
          <th style="width: 34%">Player</th>
          <th style="width: 30%">Description</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <mission-slotlist-row v-for="slot in slotlist" :missionSlot="slot" :key="slot.uid"></mission-slotlist-row>
      </tbody>
      <tfoot v-show="slotlist.length >= 10">
        <tr>
          <th style="width: 1%">#</th>
          <th style="width: 25%">Role</th>
          <th style="width: 34%">Player</th>
          <th style="width: 30%">Description</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </tfoot>
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
      return this.$store.getters.filteredMissionSlotlist
    }
  }
}
</script>
