<template>
  <div>
    <b-modal id="missionSlotGroupCreateModal" ref="missionSlotGroupCreateModal" :title="$t('mission.modal.slotGroup.create')" @shown="clearMissionSlotGroupCreateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="createMissionSlotGroup">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" :state="missionSlotGroupCreateTitleState" :feedback="missionSlotGroupCreateTitleFeedback">
                <b-form-input v-model="missionSlotGroupCreateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.orderNumber')" :description="$t('mission.slotGroup.orderNumber.description')" :state="missionSlotGroupCreateOrderNumberState" :feedback="missionSlotGroupCreateOrderNumberFeedback">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotGroupCreateData.orderNumber" type="number" min="1" :formatter="missionSlotGroupCreateOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.description.optional')" state="success">
                <b-form-input v-model="missionSlotGroupCreateData.description" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot group create actions">
          <b-btn variant="success" @click="createMissionSlotGroup">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotGroupCreateModal">
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
      missionSlotGroupCreateData: {
        description: null,
        orderNumber: 1,
        title: null
      }
    }
  },
  computed: {
    missionSlotGroupCreateOrderNumberFeedback() {
      return this.missionSlotGroupCreateData.orderNumber < 0 ? this.$t('mission.feedback.orderNumber') : ''
    },
    missionSlotGroupCreateOrderNumberState() {
      return this.missionSlotGroupCreateData.orderNumber < 0 ? 'danger' : 'success'
    },
    missionSlotGroupCreateTitleFeedback() {
      return _.isString(this.missionSlotGroupCreateData.title) && !_.isEmpty(this.missionSlotGroupCreateData.title) ? '' : this.$t('mission.feedback.title.slotGroup')
    },
    missionSlotGroupCreateTitleState() {
      return _.isString(this.missionSlotGroupCreateData.title) && !_.isEmpty(this.missionSlotGroupCreateData.title) ? 'success' : 'danger'
    }
  },
  methods: {
    clearMissionSlotGroupCreateData() {
      this.missionSlotGroupCreateData = {
        description: null,
        orderNumber: 1,
        title: ''
      };
    },
    createMissionSlotGroup() {
      if (_.isEmpty(this.missionSlotGroupCreateData.title)) {
        return
      }

      if (_.isString(this.missionSlotGroupCreateData.description) && _.isEmpty(this.missionSlotGroupCreateData.description)) {
        this.missionSlotGroupCreateData.description = null
      }

      this.hideMissionSlotGroupCreateModal();

      this.$store.dispatch("createMissionSlotGroup", { missionSlug: this.$route.params.missionSlug, slotGroupDetails: this.missionSlotGroupCreateData })
    },
    missionSlotGroupCreateOrderNumberFormatter(val) {
      if (_.isNumber(val)) {
        return val
      }

      return parseInt(val, 10)
    },
    hideMissionSlotGroupCreateModal() {
      this.$refs.missionSlotGroupCreateModal.hide();
    }
  }
}
</script>
