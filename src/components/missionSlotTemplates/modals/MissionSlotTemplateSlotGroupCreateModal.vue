<template>
  <div>
    <b-modal id="missionSlotTemplateSlotGroupCreateModal" ref="missionSlotTemplateSlotGroupCreateModal" :title="$t('mission.modal.slotGroup.create')" @shown="clearMissionSlotTemplateSlotGroupCreateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="addMissionSlotTemplateSlotGroup">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.title')" :state="missionSlotTemplateSlotGroupCreateTitleState" :feedback="missionSlotTemplateSlotGroupCreateTitleFeedback" :description="$t('mission.slotGroup.title.description')">
                <b-form-input v-model="missionSlotTemplateSlotGroupCreateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.description.optional')" state="success" :description="$t('mission.slotGroup.description.description')">
                <b-form-input v-model="missionSlotTemplateSlotGroupCreateData.description" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.insertAfter')" state="success" :description="$t('mission.slotGroup.insertAfter.description')">
                <b-form-select v-model="missionSlotTemplateSlotGroupCreateData.insertAfter" :options="missionSlotTemplateSlotGroupCreateInsertAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot template slot group create actions">
          <b-btn variant="success" @click="addMissionSlotTemplateSlotGroup">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotTemplateSlotGroupCreateModal">
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
      missionSlotTemplateSlotGroupCreateData: {
        description: null,
        title: null,
        insertAfter: 0
      }
    }
  },
  computed: {
    missionSlotGroups() {
      return this.missionSlotTemplateDetails.slotGroups
    },
    missionSlotTemplateDetails() {
      return this.$store.getters.missionSlotTemplateDetails
    },
    missionSlotTemplateSlotGroupCreateInsertAfterOptions() {
      const options = [{
        value: 0,
        text: this.$t('mission.slotGroup.insertAfter.top')
      }]

      if (_.isNil(this.missionSlotGroups)) {
        return options
      }

      _.each(this.missionSlotGroups, (slotGroup) => {
        options.push({
          value: slotGroup.orderNumber,
          text: `#${slotGroup.orderNumber} ${slotGroup.title}`
        })
      })

      return options
    },
    missionSlotTemplateSlotGroupCreateTitleFeedback() {
      return _.isString(this.missionSlotTemplateSlotGroupCreateData.title) && !_.isEmpty(this.missionSlotTemplateSlotGroupCreateData.title) ? '' : this.$t('mission.feedback.title.slotGroup')
    },
    missionSlotTemplateSlotGroupCreateTitleState() {
      return _.isString(this.missionSlotTemplateSlotGroupCreateData.title) && !_.isEmpty(this.missionSlotTemplateSlotGroupCreateData.title) ? 'success' : 'danger'
    }
  },
  methods: {
    clearMissionSlotTemplateSlotGroupCreateData() {
      this.missionSlotTemplateSlotGroupCreateData = {
        description: null,
        title: null,
        insertAfter: _.isNil(this.missionSlotGroups) || _.isEmpty(this.missionSlotGroups) ? 0 : _.last(this.missionSlotGroups).orderNumber
      };
    },
    addMissionSlotTemplateSlotGroup() {
      if (_.isEmpty(this.missionSlotTemplateSlotGroupCreateData.title)) {
        return
      }

      if (_.isString(this.missionSlotTemplateSlotGroupCreateData.description) && _.isEmpty(this.missionSlotTemplateSlotGroupCreateData.description)) {
        this.missionSlotTemplateSlotGroupCreateData.description = null
      }

      this.hideMissionSlotTemplateSlotGroupCreateModal();

      this.$store.dispatch("addMissionSlotTemplateSlotGroup", this.missionSlotTemplateSlotGroupCreateData)
    },
    hideMissionSlotTemplateSlotGroupCreateModal() {
      this.$refs.missionSlotTemplateSlotGroupCreateModal.hide();
    }
  }
}
</script>
