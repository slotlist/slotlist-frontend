<template>
  <div>
    <b-modal id="missionSlotTemplateSlotEditModal" ref="missionSlotTemplateSlotEditModal" size="lg" v-if="missionSlotTemplateSlotDetails" :title="$t('mission.modal.slot.edit')" @shown="setMissionSlotTemplateSlotEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMissionSlotTemplateSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.title')" :state="missionSlotTemplateSlotEditTitleState" :feedback="missionSlotTemplateSlotEditTitleFeedback" :description="$t('mission.slot.title.description')">
                <b-form-input v-model="missionSlotTemplateSlotEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.description.optional')" state="success" :description="$t('mission.slot.description.description')">
                <b-form-input v-model="missionSlotTemplateSlotEditData.description" textarea></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.difficulty')" state="success" :description="$t('mission.slot.difficulty.description')">
                <b-form-select v-model="missionSlotTemplateSlotEditData.difficulty" :options="missionSlotTemplateSlotEditDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.reserve.slot')" state="success" :description="$t('mission.slot.reserve.description')">
                <b-form-checkbox v-model="missionSlotTemplateSlotEditData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.blocked.slot')" state="success" :description="$t('mission.slot.blocked.description')">
                <b-form-checkbox v-model="missionSlotTemplateSlotEditData.blocked"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.detailedDescription.optional')" state="success" :description="$t('mission.slot.detailedDescription.description')">
                <quill-editor v-model="missionSlotTemplateSlotEditData.detailedDescription" ref="missionSlotTemplateSlotEditDetailedDescriptionEditor" :options="missionSlotTemplateSlotEditDetailedDescriptionEditorOptions"></quill-editor>
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.moveAfter')" state="success" :description="$t('mission.slot.moveAfter.description')">
                <b-form-select v-model="missionSlotTemplateSlotEditMoveAfter" :options="missionSlotTemplateSlotEditMoveAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot template slot edit actions">
          <b-btn variant="success" @click="editMissionSlotTemplateSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotTemplateSlotEditModal">
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
      missionSlotTemplateSlotEditData: {
        detailedDescription: null,
        difficulty: 0,
        reserve: false,
        blocked: false,
        description: null,
        title: null
      },
      missionSlotTemplateSlotEditDetailedDescriptionEditorOptions: {
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
      },
      missionSlotTemplateSlotEditMoveAfter: 0
    }
  },
  computed: {
    missionSlotTemplateSlotDetails() {
      return this.$store.getters.missionSlotTemplateSlotDetails
    },
    missionSlotTemplateSlotEditDifficultyOptions() {
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
      ];
    },
    missionSlotTemplateSlotEditMoveAfterOptions() {
      const options = [{
        value: this.missionSlotTemplateSlotDetails.orderNumber - 1,
        text: this.$t('mission.slot.moveAfter.keep')
      }]

      if (_.isNil(this.missionSlotTemplateSlotGroupDetails) || _.isNil(this.missionSlotTemplateSlotGroupDetails.slots)) {
        return options
      }

      if (this.missionSlotTemplateSlotEditMoveAfter !== 0) {
        options.push({
          value: -1,
          text: this.$t('mission.slot.insertAfter.top')
        })
      }
      _.each(this.missionSlotTemplateSlotGroupDetails.slots, (slot) => {
        if (this.missionSlotTemplateSlotDetails.orderNumber !== slot.orderNumber && this.missionSlotTemplateSlotDetails.orderNumber - 1 !== slot.orderNumber) {
          options.push({
            value: slot.orderNumber,
            text: `#${slot.orderNumber} ${slot.title}`
          })
        }
      })

      return options
    },
    missionSlotTemplateSlotEditTitleFeedback() {
      return _.isString(this.missionSlotTemplateSlotEditData.title) && !_.isEmpty(this.missionSlotTemplateSlotEditData.title) ? '' : this.$t('mission.feedback.title.slot')
    },
    missionSlotTemplateSlotEditTitleState() {
      return _.isString(this.missionSlotTemplateSlotEditData.title) && !_.isEmpty(this.missionSlotTemplateSlotEditData.title) ? 'success' : 'danger'
    },
    missionSlotTemplateSlotGroupDetails() {
      return this.$store.getters.missionSlotTemplateSlotGroupDetails
    }
  },
  methods: {
    setMissionSlotTemplateSlotEditData() {
      this.missionSlotTemplateSlotEditData = {
        detailedDescription: this.missionSlotTemplateSlotDetails.detailedDescription,
        difficulty: this.missionSlotTemplateSlotDetails.difficulty,
        orderNumber: this.missionSlotTemplateSlotDetails.orderNumber,
        reserve: this.missionSlotTemplateSlotDetails.reserve,
        blocked: this.missionSlotTemplateSlotDetails.blocked,
        description: this.missionSlotTemplateSlotDetails.description,
        title: this.missionSlotTemplateSlotDetails.title
      }

      this.missionSlotTemplateSlotEditMoveAfter = this.missionSlotTemplateSlotDetails.orderNumber - 1
    },
    editMissionSlotTemplateSlot() {
      if (_.isEmpty(this.missionSlotTemplateSlotEditData.title)) {
        return
      }

      if (_.isString(this.missionSlotTemplateSlotEditData.detailedDescription) && _.isEmpty(this.missionSlotTemplateSlotEditData.detailedDescription)) {
        this.missionSlotTemplateSlotEditData.detailedDescription = null
      }
      if (_.isString(this.missionSlotTemplateSlotEditData.description) && _.isEmpty(this.missionSlotTemplateSlotEditData.description)) {
        this.missionSlotTemplateSlotEditData.description = null
      }

      this.hideMissionSlotTemplateSlotEditModal()

      this.$store.dispatch('editMissionSlotTemplateSlot', {
        slotOrderNumber: this.missionSlotTemplateSlotDetails.orderNumber,
        slotPayload: this.missionSlotTemplateSlotEditData,
        moveAfter: this.missionSlotTemplateSlotEditMoveAfter !== this.missionSlotTemplateSlotDetails.orderNumber - 1 ? this.missionSlotTemplateSlotEditMoveAfter : -2
      })
    },
    hideMissionSlotTemplateSlotEditModal() {
      this.$refs.missionSlotTemplateSlotEditModal.hide()
    }
  }
}
</script>
