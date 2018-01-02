<template>
  <div>
    <b-modal id="missionSlotAssignModal" ref="missionSlotAssignModal" v-if="missionSlotDetails" :title="missionSlotAssignTitle" @shown="clearMissionSlotAssignData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="assignMissionSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.assign.selection')" :state="missionSlotAssignUserState" :description="$t('mission.slot.assign.selection.description')">
                <typeahead ref="missionSlotAssignUserTypeahead" action="searchUsers" actionIndicator="searchingUsers" :onHit="assignUserSelected"></typeahead>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col text-center">
              <b-form-fieldset :label="$t('mission.slot.assign.force')" state="success" :description="$t('mission.slot.assign.force.description')">
                <b-form-checkbox v-model="missionSlotAssign.force"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col text-center">
              <b-form-fieldset :label="$t('notification.suppress')" state="success" :description="$t('notification.suppress.description')">
                <b-form-checkbox v-model="missionSlotAssignSuppressNotifications"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <b-btn variant="warning" @click="assignMissionSlot">
          <i class="fa fa-gavel" aria-hidden="true"></i> {{ $t('button.assign.mission.slot') }}
        </b-btn>
        <b-btn @click="hideMissionSlotAssignModal">
          <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.close') }}
        </b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  data() {
    return {
      missionSlotAssign: {
        userUid: null,
        force: true
      },
      missionSlotAssignSuppressNotifications: false
    }
  },
  computed: {
    missionSlotAssignTitle() {
      return this.$t('mission.modal.slot.assign', { slotInfo: `#${this.missionSlotDetails.orderNumber} ${this.missionSlotDetails.title}` })
    },
    missionSlotAssignUserState() {
      return _.isNil(this.missionSlotAssign.userUid) ? 'danger' : 'success'
    },
    missionSlotDetails() {
      return this.$store.getters.missionSlotDetails
    }
  },
  methods: {
    assignMissionSlot() {
      if (_.isNil(this.missionSlotAssign.userUid)) {
        return
      }

      this.hideMissionSlotAssignModal()

      this.$store.dispatch('assignMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        userUid: this.missionSlotAssign.userUid,
        force: this.missionSlotAssign.force,
        suppressNotifications: this.missionSlotAssignSuppressNotifications
      })
    },
    assignUserSelected(item) {
      this.missionSlotAssign.userUid = item.value.uid
    },
    clearMissionSlotAssignData() {
      this.missionSlotAssign = {
        userUid: null,
        force: true
      }

      this.missionSlotAssignSuppressNotifications = false

      this.$refs.missionSlotAssignUserTypeahead.reset()
    },
    hideMissionSlotAssignModal() {
      this.$refs.missionSlotAssignModal.hide()
    }
  }
}
</script>
