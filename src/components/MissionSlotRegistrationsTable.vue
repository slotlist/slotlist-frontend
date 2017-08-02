<<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 30%">Player</th>
          <th style="width: 35%">Comment</th>
          <th style="width: 24%">Registered</th>
          <th style="width: 1%">Confirmed</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <mission-slot-registrations-row v-for="registration in registrations" :registration="registration" :key="registration.uid"></mission-slot-registrations-row>
      </tbody>
      <tfoot v-show="registrations.length >= 10">
        <tr>
          <th style="width: 30%">Player</th>
          <th style="width: 35%">Comment</th>
          <th style="width: 21%">Registered</th>
          <th style="width: 1%">Confirmed</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import MissionSlotRegistrationsRow from './MissionSlotRegistrationsRow.vue'

export default {
  components: {
    MissionSlotRegistrationsRow
  },
  computed: {
    registrations() {
      return this.$store.getters.missionSlotRegistrations
    }
  }
}
</script>
