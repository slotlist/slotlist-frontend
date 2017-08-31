<template>
  <div>
    <b-modal id="missionSlotGroupCreateModal" ref="missionSlotGroupCreateModal" title="Create slot group" @shown="clearMissionSlotGroupCreateData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="createMissionSlotGroup">
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Title" :state="missionSlotGroupCreateTitleState" :feedback="missionSlotGroupCreateTitleFeedback">
                <b-form-input v-model="missionSlotGroupCreateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Order number" description="Used for sorting slot groups in the mission slotlist" :state="missionSlotGroupCreateOrderNumberState" :feedback="missionSlotGroupCreateOrderNumberFeedback">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotGroupCreateData.orderNumber" type="number" min="1" :formatter="missionSlotGroupCreateOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Description <em>(optional)</em>" state="success">
                <b-form-input v-model="missionSlotGroupCreateData.description" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot group create actions">
          <b-btn variant="success" @click="createMissionSlotGroup">
            <i class="fa fa-plus" aria-hidden="true"></i> Submit
          </b-btn>
          <b-btn @click="hideMissionSlotGroupCreateModal">
            <i class="fa fa-close" aria-hidden="true"></i> Cancel
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
      return this.missionSlotGroupCreateData.orderNumber < 0 ? 'Please enter an order number' : ''
    },
    missionSlotGroupCreateOrderNumberState() {
      return this.missionSlotGroupCreateData.orderNumber < 0 ? 'danger' : 'success'
    },
    missionSlotGroupCreateTitleFeedback() {
      return _.isString(this.missionSlotGroupCreateData.title) && !_.isEmpty(this.missionSlotGroupCreateData.title) ? '' : 'Please enter a slot group title'
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

      console.log("createMissionSlotGroup", this.missionSlotGroupCreateData)
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
