<template>
  <div>
    <b-modal id="missionSlotEditModal" ref="missionSlotEditModal" size="lg" v-if="missionSlotDetails" title="Edit slot" @shown="setMissionSlotEditData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMissionSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Title" :state="missionSlotEditTitleState" :feedback="missionSlotEditTitleFeedback">
                <b-form-input v-model="missionSlotEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Short description <em>(optional)</em>" state="success">
                <b-form-input v-model="missionSlotEditData.shortDescription" textarea></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Order number" description="Used for sorting slot in the mission slotlist" :state="missionSlotEditOrderNumberState" :feedback="missionSlotEditOrderNumberFeedback">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotEditData.orderNumber" type="number" min="1" :formatter="missionSlotEditOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Difficulty" state="success">
                <b-form-select v-model="missionSlotEditData.difficulty" :options="missionSlotEditDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Restricted slot" description="Restricted slots are not available to the public, but only to selected players" state="success">
                <b-form-checkbox v-model="missionSlotEditData.restricted"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Reserve slot" description="Reserve slots will only be filled if all other slots have been taken before" state="success">
                <b-form-checkbox v-model="missionSlotEditData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Description <em>(optional)</em>" state="success">
                <quill-editor v-model="missionSlotEditData.description" ref="missionSlotEditDescriptionEditor" :options="missionSlotEditDescriptionEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot edit actions">
          <b-btn variant="success" @click="editMissionSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> Submit
          </b-btn>
          <b-btn @click="hideMissionSlotEditModal">
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
      missionSlotEditData: {
        description: null,
        difficulty: 0,
        orderNumber: 1,
        reserve: false,
        restricted: false,
        shortDescription: null,
        title: null
      },
      missionSlotEditDescriptionEditorOptions: {
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': 1 }, { 'header': 2 }, { 'color': [] }],
            ['bold', 'italic'],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
            ['link', 'image'],
            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
        },
        theme: 'snow'
      },
      missionSlotEditDifficultyOptions: [
        {
          text: 'Beginner',
          value: 0
        },
        {
          text: 'Easy',
          value: 1
        },
        {
          text: 'Medium',
          value: 2
        },
        {
          text: 'Advanced',
          value: 3
        },
        {
          text: 'Expert',
          value: 4
        }
      ]
    }
  },
  computed: {
    missionSlotDetails() {
      return this.$store.getters.missionSlotDetails
    },
    missionSlotEditOrderNumberFeedback() {
      return this.missionSlotEditData.orderNumber < 0 ? 'Please enter an order number' : ''
    },
    missionSlotEditOrderNumberState() {
      return this.missionSlotEditData.orderNumber < 0 ? 'danger' : 'success'
    },
    missionSlotEditTitleFeedback() {
      return _.isString(this.missionSlotEditData.title) && !_.isEmpty(this.missionSlotEditData.title) ? '' : 'Please enter a slot title'
    },
    missionSlotEditTitleState() {
      return _.isString(this.missionSlotEditData.title) && !_.isEmpty(this.missionSlotEditData.title) ? 'success' : 'danger'
    }
  },
  methods: {
    setMissionSlotEditData() {
      this.missionSlotEditData = {
        description: this.missionSlotDetails.description,
        difficulty: this.missionSlotDetails.difficulty,
        orderNumber: this.missionSlotDetails.orderNumber,
        reserve: this.missionSlotDetails.reserve,
        restricted: this.missionSlotDetails.restricted,
        shortDescription: this.missionSlotDetails.shortDescription,
        title: this.missionSlotDetails.title
      }
    },
    editMissionSlot() {
      if (_.isEmpty(this.missionSlotEditData.title)) {
        return
      }

      if (_.isString(this.missionSlotEditData.description) && _.isEmpty(this.missionSlotEditData.description)) {
        this.missionSlotEditData.description = null
      }
      if (_.isString(this.missionSlotEditData.shortDescription) && _.isEmpty(this.missionSlotEditData.shortDescription)) {
        this.missionSlotEditData.shortDescription = null
      }

      const updatedMissionSlotDetails = {}
      _.each(this.missionSlotEditData, (value, key) => {
        if (!_.isEqual(value, this.missionSlotDetails[key])) {
          updatedMissionSlotDetails[key] = value
        }
      })

      this.hideMissionSlotEditModal()

      if (_.isEmpty(_.keys(updatedMissionSlotDetails))) {
        return
      }

      this.$store.dispatch('editMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        updatedSlotDetails: updatedMissionSlotDetails,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })
    },
    missionSlotEditOrderNumberFormatter(val) {
      if (_.isNumber(val)) {
        return val
      }

      return parseInt(val, 10)
    },
    hideMissionSlotEditModal() {
      this.$refs.missionSlotEditModal.hide()
    }
  }
}
</script>
