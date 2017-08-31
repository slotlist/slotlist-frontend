<template>
  <div>
    <b-modal id="createMissionSlotGroupModal" ref="createMissionSlotGroupModal" title="Create slot group" @shown="clearCreateMissionSlotGroupData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="createMissionSlotGroup">
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Title" :state="createMissionSlotGroupTitleState" :feedback="createMissionSlotGroupTitleFeedback">
                <b-form-input v-model="createMissionSlotGroupData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Order number" description="Used for sorting slot groups in the mission slotlist" :state="createMissionSlotGroupOrderNumberState" :feedback="createMissionSlotGroupOrderNumberFeedback">
                <b-input-group left="#">
                  <b-form-input v-model="createMissionSlotGroupData.orderNumber" type="number" min="1" :formatter="createMissionSlotGroupOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Description <em>(optional)</em>" state="success">
                <b-form-input v-model="createMissionSlotGroupData.description" type="text"></b-form-input>
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
          <b-btn @click="hideCreateMissionSlotGroupModal">
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
      createMissionSlotGroupData: {
        description: null,
        orderNumber: 1,
        title: ''
      }
    }
  },
  computed: {
    createMissionSlotGroupOrderNumberFeedback() {
      return this.createMissionSlotGroupData.orderNumber < 0 ? 'Please enter an order number' : ''
    },
    createMissionSlotGroupOrderNumberState() {
      return this.createMissionSlotGroupData.orderNumber < 0 ? 'danger' : 'success'
    },
    createMissionSlotGroupTitleFeedback() {
      return _.isString(this.createMissionSlotGroupData.title) && !_.isEmpty(this.createMissionSlotGroupData.title) ? '' : 'Please enter a slot group title'
    },
    createMissionSlotGroupTitleState() {
      return _.isString(this.createMissionSlotGroupData.title) && !_.isEmpty(this.createMissionSlotGroupData.title) ? 'success' : 'danger'
    }
  },
  methods: {
    clearCreateMissionSlotGroupData() {
      this.createMissionSlotGroupData = {
        description: null,
        orderNumber: 1,
        title: ''
      };
    },
    createMissionSlotGroup() {
      if (_.isEmpty(this.createMissionSlotGroupData.title)) {
        return
      }

      if (_.isString(this.createMissionSlotGroupData.description) && _.isEmpty(this.createMissionSlotGroupData.description)) {
        this.createMissionSlotGroupData.description = null
      }

      this.hideCreateMissionSlotGroupModal();

      console.log("createMissionSlotGroup", this.createMissionSlotGroupData)
    },
    createMissionSlotGroupOrderNumberFormatter(val) {
      if (_.isNumber(val)) {
        return val
      }

      return parseInt(val, 10)
    },
    hideCreateMissionSlotGroupModal() {
      this.$refs.createMissionSlotGroupModal.hide();
    }
  }
}
</script>
