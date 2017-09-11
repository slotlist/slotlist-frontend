<template>
  <div>
    <b-modal id="missionSlotRegistrationModal" ref="missionSlotRegistrationModal" v-if="missionSlotDetails" :title="$t('mission.modal.slot.register')" @shown="clearMissionSlotRegistrationModalData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="registerForMissionSlot">
          <div class="row">
            <div class="col-12" v-html="translatedModalText"></div>
          </div>
          <hr class="my-4">
          <div class="row">
            <div class="col col-12">
              <b-form-fieldset :label="$t('mission.registration.comment.optional')" :description="$t('mission.registration.comment.description')" state="success">
                <b-form-input v-model="missionSlotRegistrationData.comment" type="text" maxlength="128"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot registration actions">
          <b-btn variant="success" @click="registerForMissionSlot" :disabled="missionSlotDetails.assignee ? true : false">
            <i class="fa fa-check" aria-hidden="true"></i> {{ $t('button.confirm') }}
          </b-btn>
          <b-btn @click="hideMissionSlotRegistrationModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  data() {
    return {
      missionSlotRegistrationData: {
        comment: null
      }
    }
  },
  computed: {
    missionSlotDetails() {
      return this.$store.getters.missionSlotDetails
    },
    translatedModalText() {
      return this.$t('mission.modal.slot.register.text', { slotInfo: `<span class="font-weight-bold">#${this.missionSlotDetails.orderNumber} ${this.missionSlotDetails.title}</span>` })
    }
  },
  methods: {
    clearMissionSlotRegistrationModalData() {
      this.missionSlotRegistrationData = {
        comment: null
      }
    },
    hideMissionSlotRegistrationModal() {
      this.$refs.missionSlotRegistrationModal.hide()
    },
    registerForMissionSlot() {
      if (_.isString(this.missionSlotRegistrationData.comment) && _.isEmpty(this.missionSlotRegistrationData.comment)) {
        this.missionSlotRegistrationData.comment = null
      }

      this.hideMissionSlotRegistrationModal()

      this.$store.dispatch('registerForMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        comment: this.missionSlotRegistrationData.comment,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })
    }
  }
}
</script>
