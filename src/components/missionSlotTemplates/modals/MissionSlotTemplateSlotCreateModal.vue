<template>
  <div>
    <b-modal id="missionSlotTemplateSlotCreateModal" ref="missionSlotTemplateSlotCreateModal" size="lg" v-if="missionSlotTemplateSlotGroupDetails" :title="slotCreateTitle" @shown="clearMissionSlotTemplateSlotCreateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="addMissionSlotTemplateSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.title')" :state="missionSlotTemplateSlotCreateTitleState" :feedback="missionSlotTemplateSlotCreateTitleFeedback" :description="$t('mission.slot.title.description')">
                <b-form-input v-model="missionSlotTemplateSlotCreateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.description.optional')" state="success" :description="$t('mission.slot.description.description')">
                <b-form-input v-model="missionSlotTemplateSlotCreateData.description" textarea></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.difficulty')" state="success" :description="$t('mission.slot.difficulty.description')">
                <b-form-select v-model="missionSlotTemplateSlotCreateData.difficulty" :options="missionSlotTemplateSlotCreateDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.reserve.slot')" state="success" :description="$t('mission.slot.reserve.description')">
                <b-form-checkbox v-model="missionSlotTemplateSlotCreateData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.blocked.slot')" state="success" :description="$t('mission.slot.blocked.description')">
                <b-form-checkbox v-model="missionSlotTemplateSlotCreateData.blocked"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.detailedDescription.optional')" state="success" :description="$t('mission.slot.detailedDescription.description')">
                <quill-editor v-model="missionSlotTemplateSlotCreateData.detailedDescription" ref="missionSlotTemplateSlotCreateDetailedDescriptionEditor" :options="missionSlotTemplateSlotCreateDetailedDescriptionEditorOptions"></quill-editor>
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.insertAfter')" state="success" :description="$t('mission.slot.insertAfter.description')">
                <b-form-select v-model="missionSlotTemplateSlotCreateData.insertAfter" :options="missionSlotTemplateSlotCreateInsertAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot template slot create actions">
          <b-btn variant="success" @click="addMissionSlotTemplateSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotTemplateSlotCreateModal">
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
      missionSlotTemplateSlotCreateData: {
        detailedDescription: null,
        difficulty: 0,
        insertAfter: 0,
        reserve: false,
        blocked: false,
        description: null,
        title: null
      },
      missionSlotTemplateSlotCreateDetailedDescriptionEditorOptions: {
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': 1 }, { 'header': 2 }, { 'color': [] }],
            ['bold', 'italic'],
            [{ 'align': [] }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageResize: {
            modules: ['Resize', 'DisplaySize']
          }
        },
        theme: 'snow'
      }
    }
  },
  computed: {
    missionSlotTemplateSlotCreateDifficultyOptions() {
      return [
        {
          text: this.$t('mission.slot.difficulty.beginner'),
          value: 0
        },
        {
          text: this.$t('mission.slot.difficulty.easy'),
          value: 1
        },
        {
          text: this.$t('mission.slot.difficulty.medium'),
          value: 2
        },
        {
          text: this.$t('mission.slot.difficulty.advanced'),
          value: 3
        },
        {
          text: this.$t('mission.slot.difficulty.expert'),
          value: 4
        }
      ]
    },
    missionSlotTemplateSlotCreateInsertAfterOptions() {
      const options = [{
        value: 0,
        text: this.$t('mission.slotGroup.insertAfter.top')
      }]

      if (_.isNil(this.missionSlotTemplateSlotGroupDetails) || _.isNil(this.missionSlotTemplateSlotGroupDetails.slots)) {
        return options
      }

      _.each(this.missionSlotTemplateSlotGroupDetails.slots, (slot) => {
        options.push({
          value: slot.orderNumber,
          text: `#${slot.orderNumber} ${slot.title}`
        })
      })

      return options
    },
    missionSlotTemplateSlotCreateRestrictedCommunityState() {
      return this.missionSlotTemplateSlotCreateData.restricted && _.isNil(this.missionSlotTemplateSlotCreateData.restrictedCommunityUid) ? 'danger' : 'success'
    },
    missionSlotTemplateSlotCreateTitleFeedback() {
      return _.isString(this.missionSlotTemplateSlotCreateData.title) && !_.isEmpty(this.missionSlotTemplateSlotCreateData.title) ? '' : this.$t('mission.feedback.title.slot')
    },
    missionSlotTemplateSlotCreateTitleState() {
      return _.isString(this.missionSlotTemplateSlotCreateData.title) && !_.isEmpty(this.missionSlotTemplateSlotCreateData.title) ? 'success' : 'danger'
    },
    missionSlotTemplateSlotGroupDetails() {
      return this.$store.getters.missionSlotTemplateSlotGroupDetails
    },
    slotCreateTitle() {
      return `${this.$t('mission.modal.slot.create')} #${this.missionSlotTemplateSlotGroupDetails.orderNumber} ${this.missionSlotTemplateSlotGroupDetails.title}`
    }
  },
  methods: {
    clearMissionSlotTemplateSlotCreateData() {
      this.missionSlotTemplateSlotCreateData = {
        detailedDescription: null,
        difficulty: 0,
        insertAfter: _.isNil(this.missionSlotTemplateSlotGroupDetails) || _.isNil(this.missionSlotTemplateSlotGroupDetails.slots) || _.isEmpty(this.missionSlotTemplateSlotGroupDetails.slots) ? 0 : _.last(this.missionSlotTemplateSlotGroupDetails.slots).orderNumber,
        reserve: false,
        blocked: false,
        description: null,
        title: null
      }
    },
    addMissionSlotTemplateSlot() {
      if (_.isEmpty(this.missionSlotTemplateSlotCreateData.title)) {
        return
      }

      if (_.isString(this.missionSlotTemplateSlotCreateData.detailedDescription) && _.isEmpty(this.missionSlotTemplateSlotCreateData.detailedDescription)) {
        this.missionSlotTemplateSlotCreateData.detailedDescription = null
      }
      if (_.isString(this.missionSlotTemplateSlotCreateData.description) && _.isEmpty(this.missionSlotTemplateSlotCreateData.description)) {
        this.missionSlotTemplateSlotCreateData.description = null
      }
      if (_.isString(this.missionSlotTemplateSlotCreateData.restrictedCommunityUid) && _.isEmpty(this.missionSlotTemplateSlotCreateData.restrictedCommunityUid)) {
        this.missionSlotTemplateSlotCreateData.restrictedCommunityUid = null
      }

      this.hideMissionSlotTemplateSlotCreateModal()

      this.$store.dispatch('addMissionSlotTemplateSlot', this.missionSlotTemplateSlotCreateData)
    },
    hideMissionSlotTemplateSlotCreateModal() {
      this.$refs.missionSlotTemplateSlotCreateModal.hide()
    }
  }
}
</script>
