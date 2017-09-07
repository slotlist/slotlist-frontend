<template>
  <div>
    <b-modal id="missionSlotEditModal" ref="missionSlotEditModal" size="lg" v-if="missionSlotDetails" :title="$t('mission.modal.slot.edit')" @shown="setMissionSlotEditData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMissionSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" :state="missionSlotEditTitleState" :feedback="missionSlotEditTitleFeedback">
                <b-form-input v-model="missionSlotEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.shortDescription.optional')" state="success">
                <b-form-input v-model="missionSlotEditData.shortDescription" textarea></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.orderNumber')" :description="$t('mission.slot.orderNumber.description')" :state="missionSlotEditOrderNumberState" :feedback="missionSlotEditOrderNumberFeedback">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotEditData.orderNumber" type="number" min="1" :formatter="missionSlotEditOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.difficulty')" state="success">
                <b-form-select v-model="missionSlotEditData.difficulty" :options="missionSlotEditDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.restricted.slot')" :description="$t('mission.slot.restricted.description')" state="success">
                <b-form-checkbox v-model="missionSlotEditData.restricted"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.reserve.slot')" :description="$t('mission.slot.reserve.description')" state="success">
                <b-form-checkbox v-model="missionSlotEditData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.description.optional')" state="success">
                <quill-editor v-model="missionSlotEditData.description" ref="missionSlotEditDescriptionEditor" :options="missionSlotEditDescriptionEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot edit actions">
          <b-btn variant="success" @click="editMissionSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit' ) }}
          </b-btn>
          <b-btn @click="hideMissionSlotEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel' ) }}
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
            ['link', 'image', 'video'],
            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageDrop: true,
          imageResize: {
            modules: ['Resize', 'DisplaySize']
          }
        },
        theme: 'snow'
      },
      missionSlotEditDifficultyOptions: [
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
    }
  },
  computed: {
    missionSlotDetails() {
      return this.$store.getters.missionSlotDetails
    },
    missionSlotEditOrderNumberFeedback() {
      return this.missionSlotEditData.orderNumber < 0 ? this.$t('mission.feedback.orderNumber') : ''
    },
    missionSlotEditOrderNumberState() {
      return this.missionSlotEditData.orderNumber < 0 ? 'danger' : 'success'
    },
    missionSlotEditTitleFeedback() {
      return _.isString(this.missionSlotEditData.title) && !_.isEmpty(this.missionSlotEditData.title) ? '' : this.$t('mission.feedback.title.slot')
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
