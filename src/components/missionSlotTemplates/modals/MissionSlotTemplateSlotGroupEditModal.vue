<template>
  <div>
    <b-modal id="missionSlotTemplateSlotGroupEditModal" ref="missionSlotTemplateSlotGroupEditModal" v-if="missionSlotTemplateSlotGroupDetails" :title="$t('mission.modal.slotGroup.edit')" @shown="setMissionSlotTemplateSlotGroupEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMissionSlotTemplateSlotGroup">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.title')" :state="missionSlotTemplateSlotGroupEditTitleState" :feedback="missionSlotTemplateSlotGroupEditTitleFeedback" :description="$t('mission.slotGroup.title.description')">
                <b-form-input v-model="missionSlotTemplateSlotGroupEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.description.optional')" state="success" :description="$t('mission.slotGroup.description.description')">
                <b-form-input v-model="missionSlotTemplateSlotGroupEditData.description" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.moveAfter')" state="success" :description="$t('mission.slotGroup.moveAfter.description')">
                <b-form-select v-model="missionSlotTemplateSlotGroupEditMoveAfter" :options="missionSlotTemplateSlotGroupEditMoveAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot template slot group edit actions">
          <b-btn variant="success" @click="editMissionSlotTemplateSlotGroup">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotTemplateSlotGroupEditModal">
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
      missionSlotTemplateSlotGroupEditData: {
        description: null,
        title: null
      },
      missionSlotTemplateSlotGroupEditMoveAfter: 0
    }
  },
  computed: {
    missionSlotTemplateSlotGroupDetails() {
      return this.$store.getters.missionSlotTemplateSlotGroupDetails
    },
    missionSlotTemplateSlotGroupEditMoveAfterOptions() {
      const options = [{
        value: this.missionSlotTemplateSlotGroupDetails.orderNumber - 1,
        text: this.$t('mission.slotGroup.moveAfter.keep')
      }]

      if (_.isNil(this.missionSlotTemplateSlotGroups)) {
        return options
      }

      if (this.missionSlotTemplateSlotGroupEditMoveAfter !== 0) {
        options.push({
          value: -1,
          text: this.$t('mission.slotGroup.insertAfter.top')
        })
      }
      _.each(this.missionSlotTemplateSlotGroups, (slotGroup) => {
        if (this.missionSlotTemplateSlotGroupDetails.orderNumber !== slotGroup.orderNumber && this.missionSlotTemplateSlotGroupDetails.orderNumber - 1 !== slotGroup.orderNumber) {
          options.push({
            value: slotGroup.orderNumber,
            text: `#${slotGroup.orderNumber} ${slotGroup.title}`
          })
        }
      })

      return options
    },
    missionSlotTemplateSlotGroupEditTitleFeedback() {
      return _.isString(this.missionSlotTemplateSlotGroupEditData.title) && !_.isEmpty(this.missionSlotTemplateSlotGroupEditData.title) ? '' : this.$t('mission.feedback.title.slotGroup')
    },
    missionSlotTemplateSlotGroupEditTitleState() {
      return _.isString(this.missionSlotTemplateSlotGroupEditData.title) && !_.isEmpty(this.missionSlotTemplateSlotGroupEditData.title) ? 'success' : 'danger'
    },
    missionSlotTemplateSlotGroups() {
      return this.$store.getters.missionSlotTemplateDetails.slotGroups
    }
  },
  methods: {
    setMissionSlotTemplateSlotGroupEditData() {
      this.missionSlotTemplateSlotGroupEditData = {
        description: this.missionSlotTemplateSlotGroupDetails.description,
        title: this.missionSlotTemplateSlotGroupDetails.title
      }

      this.missionSlotTemplateSlotGroupEditMoveAfter = this.missionSlotTemplateSlotGroupDetails.orderNumber - 1
    },
    editMissionSlotTemplateSlotGroup() {
      if (_.isEmpty(this.missionSlotTemplateSlotGroupEditData.title)) {
        return
      }

      if (_.isString(this.missionSlotTemplateSlotGroupEditData.description) && _.isEmpty(this.missionSlotTemplateSlotGroupEditData.description)) {
        this.missionSlotTemplateSlotGroupEditData.description = null
      }

      this.hideMissionSlotTemplateSlotGroupEditModal()

      this.$store.dispatch('editMissionSlotTemplateSlotGroup', {
        slotGroupOrderNumber: this.missionSlotTemplateSlotGroupDetails.orderNumber,
        slotGroupPayload: this.missionSlotTemplateSlotGroupEditData,
        moveAfter: this.missionSlotTemplateSlotGroupEditMoveAfter !== this.missionSlotTemplateSlotGroupDetails.orderNumber - 1 ? this.missionSlotTemplateSlotGroupEditMoveAfter : -2
      })
    },
    hideMissionSlotTemplateSlotGroupEditModal() {
      this.$refs.missionSlotTemplateSlotGroupEditModal.hide()
    }
  }
}
</script>
