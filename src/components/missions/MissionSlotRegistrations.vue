<template>
  <div>
    <mission-slot-registrations-table></mission-slot-registrations-table>
    <div class="row" v-if="isMissionEditor">
      <div class="col text-center">
        <b-form-fieldset :label="$t('notification.suppress')" state="success" :description="$t('notification.suppress.description')">
          <b-form-checkbox v-model="missionSlotRegistrationSuppressNotifications"></b-form-checkbox>
        </b-form-fieldset>
      </div>
    </div>
    <div class="text-center">
      <div class="btn-group" role="group" aria-label="Mission slot registrations actions">
        <b-btn variant="secondary" @click="refreshMissionSlotRegistrations">
          <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
        </b-btn>
      </div>
    </div>
  </div>
</template>

<script>
import MissionSlotRegistrationsTable from './MissionSlotRegistrationsTable.vue'

export default {
  components: {
    MissionSlotRegistrationsTable
  },
  props: [
    'missionSlotDetails'
  ],
  data() {
    return {
      missionSlotRegistrationSuppressNotifications: false
    }
  },
  beforeCreate: function() {
    this.$store.dispatch('setMissionSlotRegistrationSuppressNotifications', { suppressNotifications: false })
  },
  computed: {
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    }
  },
  methods: {
    refreshMissionSlotRegistrations() {
      this.$store.dispatch('getMissionSlotRegistrations', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })
    }
  },
  watch: {
    missionSlotRegistrationSuppressNotifications(val) {
      this.$store.dispatch('setMissionSlotRegistrationSuppressNotifications', { suppressNotifications: val })
    }
  }
}
</script>
