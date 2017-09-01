<template>
  <div>
    <b-modal id="missionSlotCreateModal" ref="missionSlotCreateModal" size="lg" v-if="missionSlotGroupDetails" :title="slotCreateTitle" @shown="clearMissionSlotCreateData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="createMissionSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Title" :state="missionSlotCreateTitleState" :feedback="missionSlotCreateTitleFeedback">
                <b-form-input v-model="missionSlotCreateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Short description <em>(optional)</em>" state="success">
                <b-form-input v-model="missionSlotCreateData.shortDescription" textarea></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Order number" description="Used for sorting slot in the mission slotlist" :state="missionSlotCreateOrderNumberState" :feedback="missionSlotCreateOrderNumberFeedback">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotCreateData.orderNumber" type="number" min="1" :formatter="missionSlotCreateOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Difficulty" state="success">
                <b-form-select v-model="missionSlotCreateData.difficulty" :options="missionSlotCreateDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Restricted slot" description="Restricted slots are not available to the public, but only to selected players" state="success">
                <b-form-checkbox v-model="missionSlotCreateData.restricted"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Reserve slot" description="Reserve slots will only be filled if all other slots have been taken before" state="success">
                <b-form-checkbox v-model="missionSlotCreateData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Description <em>(optional)</em>" state="success">
                <quill-editor v-model="missionSlotCreateData.description" ref="missionSlotCreateDescriptionEditor" :options="missionSlotCreateDescriptionEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot create actions">
          <b-btn variant="success" @click="createMissionSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> Submit
          </b-btn>
          <b-btn @click="hideMissionSlotCreateModal">
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
      missionSlotCreateData: {
        description: null,
        difficulty: 0,
        orderNumber: 1,
        reserve: false,
        restricted: false,
        shortDescription: null,
        title: null
      },
      missionSlotCreateDescriptionEditorOptions: {
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
      missionSlotCreateDifficultyOptions: [
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
    missionSlotCreateOrderNumberFeedback() {
      return this.missionSlotCreateData.orderNumber < 0 ? 'Please enter an order number' : ''
    },
    missionSlotCreateOrderNumberState() {
      return this.missionSlotCreateData.orderNumber < 0 ? 'danger' : 'success'
    },
    missionSlotCreateTitleFeedback() {
      return _.isString(this.missionSlotCreateData.title) && !_.isEmpty(this.missionSlotCreateData.title) ? '' : 'Please enter a slot title'
    },
    missionSlotCreateTitleState() {
      return _.isString(this.missionSlotCreateData.title) && !_.isEmpty(this.missionSlotCreateData.title) ? 'success' : 'danger'
    },
    missionSlotGroupDetails() {
      return this.$store.getters.missionSlotGroupDetails
    },
    slotCreateTitle() {
      return `Create slot in slot group #${this.missionSlotGroupDetails.orderNumber} ${this.missionSlotGroupDetails.title}`
    }
  },
  methods: {
    clearMissionSlotCreateData() {
      this.missionSlotCreateData = {
        description: null,
        difficulty: 0,
        orderNumber: 1,
        reserve: false,
        restricted: false,
        shortDescription: null,
        title: null
      }
    },
    createMissionSlot() {
      if (_.isEmpty(this.missionSlotCreateData.title)) {
        return
      }

      if (_.isString(this.missionSlotCreateData.description) && _.isEmpty(this.missionSlotCreateData.description)) {
        this.missionSlotCreateData.description = null
      }
      if (_.isString(this.missionSlotCreateData.shortDescription) && _.isEmpty(this.missionSlotCreateData.shortDescription)) {
        this.missionSlotCreateData.shortDescription = null
      }

      const payload = _.assign({ slotGroupUid: this.missionSlotGroupDetails.uid }, this.missionSlotCreateData)

      this.hideMissionSlotCreateModal()

      this.$store.dispatch('createMissionSlot', { missionSlug: this.$route.params.missionSlug, slotDetails: payload })
    },
    missionSlotCreateOrderNumberFormatter(val) {
      if (_.isNumber(val)) {
        return val
      }

      return parseInt(val, 10)
    },
    hideMissionSlotCreateModal() {
      this.$refs.missionSlotCreateModal.hide()
    }
  }
}
</script>
