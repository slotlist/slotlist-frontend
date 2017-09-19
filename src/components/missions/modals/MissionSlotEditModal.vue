<template>
  <div>
    <b-modal id="missionSlotEditModal" ref="missionSlotEditModal" size="lg" v-if="missionSlotDetails" :title="$t('mission.modal.slot.edit')" @shown="setMissionSlotEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMissionSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.title')" :state="missionSlotEditTitleState" :feedback="missionSlotEditTitleFeedback" :description="$t('mission.slot.title.description')">
                <b-form-input v-model="missionSlotEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.description.optional')" state="success" :description="$t('mission.slot.description.description')">
                <b-form-input v-model="missionSlotEditData.description" textarea></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.orderNumber')" :state="missionSlotEditOrderNumberState" :feedback="missionSlotEditOrderNumberFeedback" :description="$t('mission.slot.orderNumber.description')">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotEditData.orderNumber" type="number" min="1" :formatter="missionSlotEditOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.difficulty')" state="success" :description="$t('mission.slot.difficulty.description')">
                <b-form-select v-model="missionSlotEditData.difficulty" :options="missionSlotEditDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.restricted.slot')" state="success" :description="$t('mission.slot.restricted.description')">
                <b-form-checkbox v-model="missionSlotEditData.restricted"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.reserve.slot')" state="success" :description="$t('mission.slot.reserve.description')">
                <b-form-checkbox v-model="missionSlotEditData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row" v-if="missionSlotEditData.restricted">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.restricted.selection')" :state="missionSlotEditRestrictedCommunityState" :description="$t('mission.slot.restricted.selection.description')">
                <typeahead action="searchCommunities" actionIndicator="searchingCommunities" :onHit="restrictedSlotCommunitySelected" :initialValue="restrictedSlotTypeaheadInitialValue"></typeahead>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.detailedDescription.optional')" state="success" :description="$t('mission.slot.detailedDescription.description')">
                <quill-editor v-model="missionSlotEditData.detailedDescription" ref="missionSlotEditDetailedDescriptionEditor" :options="missionSlotEditDetailedDescriptionEditorOptions"></quill-editor>
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
        detailedDescription: null,
        difficulty: 0,
        orderNumber: 1,
        reserve: false,
        restricted: false,
        restrictedCommunityUid: null,
        description: null,
        title: null
      },
      missionSlotEditDetailedDescriptionEditorOptions: {
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
    missionSlotEditRestrictedCommunityState() {
      return this.missionSlotEditData.restricted && _.isNil(this.missionSlotEditData.restrictedCommunityUid) ? 'danger' : 'success'
    },
    missionSlotEditTitleFeedback() {
      return _.isString(this.missionSlotEditData.title) && !_.isEmpty(this.missionSlotEditData.title) ? '' : this.$t('mission.feedback.title.slot')
    },
    missionSlotEditTitleState() {
      return _.isString(this.missionSlotEditData.title) && !_.isEmpty(this.missionSlotEditData.title) ? 'success' : 'danger'
    },
    restrictedSlotTypeaheadInitialValue() {
      return _.isNil(this.missionSlotDetails.restrictedCommunity) ? null : this.missionSlotDetails.restrictedCommunity.name
    }
  },
  methods: {
    setMissionSlotEditData() {
      this.missionSlotEditData = {
        detailedDescription: this.missionSlotDetails.detailedDescription,
        difficulty: this.missionSlotDetails.difficulty,
        orderNumber: this.missionSlotDetails.orderNumber,
        reserve: this.missionSlotDetails.reserve,
        restricted: !_.isNil(this.missionSlotDetails.restrictedCommunity),
        restrictedCommunityUid: _.isNil(this.missionSlotDetails.restrictedCommunity) ? null : this.missionSlotDetails.restrictedCommunity.uid,
        description: this.missionSlotDetails.description,
        title: this.missionSlotDetails.title
      }
    },
    editMissionSlot() {
      if (_.isEmpty(this.missionSlotEditData.title)) {
        return
      } else if (this.missionSlotEditData.restricted && (_.isNil(this.missionSlotEditData.restrictedCommunityUid) || _.isEmpty(this.missionSlotEditData.restrictedCommunityUid))) {
        return
      }

      if (_.isString(this.missionSlotEditData.detailedDescription) && _.isEmpty(this.missionSlotEditData.detailedDescription)) {
        this.missionSlotEditData.detailedDescription = null
      }
      if (_.isString(this.missionSlotEditData.description) && _.isEmpty(this.missionSlotEditData.description)) {
        this.missionSlotEditData.description = null
      }

      const updatedMissionSlotDetails = {}
      _.each(this.missionSlotEditData, (value, key) => {
        if (key.toLowerCase() === 'restricted') {
          if (!value && !_.isNil(this.missionSlotDetails.restrictedCommunity)) {
            updatedMissionSlotDetails.restrictedCommunityUid = null
          }
          return
        } else if (key.toLowerCase() === 'restrictedcommunityuid') {
          const oldRestrictedCommunityUid = _.isNil(this.missionSlotDetails.restrictedCommunity) ? null : this.missionSlotDetails.restrictedCommunity.uid
          if (!_.isEqual(value, oldRestrictedCommunityUid)) {
            updatedMissionSlotDetails.restrictedCommunityUid = value
          }
          return
        } else if (!_.isEqual(value, this.missionSlotDetails[key])) {
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
    },
    restrictedSlotCommunitySelected(item) {
      this.missionSlotEditData.restrictedCommunityUid = item.value.uid
    }
  }
}
</script>
