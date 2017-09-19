<template>
  <div>
    <b-modal id="missionSlotGroupEditModal" ref="missionSlotGroupEditModal" v-if="missionSlotGroupDetails" :title="$t('mission.modal.slotGroup.edit')" @shown="setMissionSlotGroupEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMissionSlotGroup">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.title')" :state="missionSlotGroupEditTitleState" :feedback="missionSlotGroupEditTitleFeedback" :description="$t('mission.slotGroup.title.description')">
                <b-form-input v-model="missionSlotGroupEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.orderNumber')" :state="missionSlotGroupEditOrderNumberState" :feedback="missionSlotGroupEditOrderNumberFeedback" :description="$t('mission.slotGroup.orderNumber.description')">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotGroupEditData.orderNumber" type="number" min="1" :formatter="missionSlotGroupEditOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.description.optional')" state="success" :description="$t('mission.slotGroup.description.description')">
                <b-form-input v-model="missionSlotGroupEditData.description" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot group edit actions">
          <b-btn variant="success" @click="editMissionSlotGroup">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit' ) }}
          </b-btn>
          <b-btn @click="hideMissionSlotGroupEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel' ) }}
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
      missionSlotGroupEditData: {
        orderNumber: 1,
        description: null,
        title: null
      }
    }
  },
  computed: {
    missionSlotGroupDetails() {
      return this.$store.getters.missionSlotGroupDetails
    },
    missionSlotGroupEditOrderNumberFeedback() {
      return this.missionSlotGroupEditData.orderNumber < 0 ? this.$t('mission.feedback.orderNumber') : ''
    },
    missionSlotGroupEditOrderNumberState() {
      return this.missionSlotGroupEditData.orderNumber < 0 ? 'danger' : 'success'
    },
    missionSlotGroupEditTitleFeedback() {
      return _.isString(this.missionSlotGroupEditData.title) && !_.isEmpty(this.missionSlotGroupEditData.title) ? '' : this.$t('mission.feedback.title.slotGroup')
    },
    missionSlotGroupEditTitleState() {
      return _.isString(this.missionSlotGroupEditData.title) && !_.isEmpty(this.missionSlotGroupEditData.title) ? 'success' : 'danger'
    }
  },
  methods: {
    setMissionSlotGroupEditData() {
      this.missionSlotGroupEditData = {
        orderNumber: this.missionSlotGroupDetails.orderNumber,
        description: this.missionSlotGroupDetails.description,
        title: this.missionSlotGroupDetails.title
      }
    },
    editMissionSlotGroup() {
      if (_.isEmpty(this.missionSlotGroupEditData.title)) {
        return
      }

      if (_.isString(this.missionSlotGroupEditData.description) && _.isEmpty(this.missionSlotGroupEditData.description)) {
        this.missionSlotGroupEditData.description = null
      }

      const updatedMissionSlotGroupDetails = {}
      _.each(this.missionSlotGroupEditData, (value, key) => {
        if (!_.isEqual(value, this.missionSlotGroupDetails[key])) {
          updatedMissionSlotGroupDetails[key] = value
        }
      })

      this.hideMissionSlotGroupEditModal()

      if (_.isEmpty(_.keys(updatedMissionSlotGroupDetails))) {
        return
      }

      this.$store.dispatch('editMissionSlotGroup', {
        missionSlug: this.$route.params.missionSlug,
        slotGroupUid: this.missionSlotGroupDetails.uid,
        updatedSlotGroupDetails: updatedMissionSlotGroupDetails
      })
    },
    missionSlotGroupEditOrderNumberFormatter(val) {
      if (_.isNumber(val)) {
        return val
      }

      return parseInt(val, 10)
    },
    hideMissionSlotGroupEditModal() {
      this.$refs.missionSlotGroupEditModal.hide()
    }
  }
}
</script>
