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
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.description.optional')" state="success" :description="$t('mission.slotGroup.description.description')">
                <b-form-input v-model="missionSlotGroupEditData.description" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.moveAfter')" state="success" :description="$t('mission.slotGroup.moveAfter.description')">
                <b-form-select v-model="missionSlotGroupEditMoveAfter" :options="missionSlotGroupEditMoveAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot group edit actions">
          <b-btn variant="success" @click="editMissionSlotGroup">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotGroupEditModal">
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
      missionSlotGroupEditData: {
        description: null,
        title: null
      },
      missionSlotGroupEditMoveAfter: 0
    }
  },
  computed: {
    missionSlotGroupDetails() {
      return this.$store.getters.missionSlotGroupDetails
    },
    missionSlotGroupEditMoveAfterOptions() {
      const options = [{
        value: this.missionSlotGroupDetails.orderNumber - 1,
        text: this.$t('mission.slotGroup.moveAfter.keep')
      }]

      if (_.isNil(this.missionSlotGroups)) {
        return options
      }

      if (this.missionSlotGroupEditMoveAfter !== 0) {
        options.push({
          value: -1,
          text: this.$t('mission.slotGroup.insertAfter.top')
        })
      }
      _.each(this.missionSlotGroups, (slotGroup) => {
        if (this.missionSlotGroupDetails.orderNumber !== slotGroup.orderNumber && this.missionSlotGroupDetails.orderNumber - 1 !== slotGroup.orderNumber) {
          options.push({
            value: slotGroup.orderNumber,
            text: `#${slotGroup.orderNumber} ${slotGroup.title}`
          })
        }
      })

      return options
    },
    missionSlotGroupEditTitleFeedback() {
      return _.isString(this.missionSlotGroupEditData.title) && !_.isEmpty(this.missionSlotGroupEditData.title) ? '' : this.$t('mission.feedback.title.slotGroup')
    },
    missionSlotGroupEditTitleState() {
      return _.isString(this.missionSlotGroupEditData.title) && !_.isEmpty(this.missionSlotGroupEditData.title) ? 'success' : 'danger'
    },
    missionSlotGroups() {
      return this.$store.getters.missionSlotGroups
    }
  },
  methods: {
    setMissionSlotGroupEditData() {
      this.missionSlotGroupEditData = {
        description: this.missionSlotGroupDetails.description,
        title: this.missionSlotGroupDetails.title
      }

      this.missionSlotGroupEditMoveAfter = this.missionSlotGroupDetails.orderNumber - 1
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

      if (this.missionSlotGroupEditMoveAfter !== this.missionSlotGroupDetails.orderNumber - 1) {
        updatedMissionSlotGroupDetails.moveAfter = _.max([this.missionSlotGroupEditMoveAfter, 0])
      }

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
    hideMissionSlotGroupEditModal() {
      this.$refs.missionSlotGroupEditModal.hide()
    }
  }
}
</script>
