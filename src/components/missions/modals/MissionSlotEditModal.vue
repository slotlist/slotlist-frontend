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
              <b-form-fieldset :label="$t('mission.slot.difficulty')" state="success" :description="$t('mission.slot.difficulty.description')">
                <b-form-select v-model="missionSlotEditData.difficulty" :options="missionSlotEditDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.externalAssignee.optional')" state="success" :description="$t('mission.slot.externalAssignee.description')">
                <b-form-input v-model="missionSlotEditData.externalAssignee" type="text" :disabled="missionSlotDetails.assignee !== null"></b-form-input>
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
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.blocked.slot')" state="success" :description="$t('mission.slot.blocked.description')">
                <b-form-checkbox v-model="missionSlotEditData.blocked"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.autoAssignable.slot')" state="success" :description="$t('mission.slot.autoAssignable.description')">
                <b-form-checkbox v-model="missionSlotEditData.autoAssignable"></b-form-checkbox>
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
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
          <span class="text-success" style="font-size: 1rem; font-weight: 400; line-height: 1.5">{{ $t('mission.requiredDLCs') }}</span>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.apex"><i class="icon-arma-3-apex-dlc"></i> {{ $t('mission.requiredDLCs.apex') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.helicopters"><i class="icon-arma-3-helicopters-dlc"></i> {{ $t('mission.requiredDLCs.helicopters') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.jets"><i class="icon-arma-3-jets-dlc"></i> {{ $t('mission.requiredDLCs.jets') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.karts"><i class="icon-arma-3-karts-dlc"></i> {{ $t('mission.requiredDLCs.karts') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.lawsofwar"><i class="icon-arma-3-laws-of-war-dlc"></i> {{ $t('mission.requiredDLCs.laws-of-war') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.marksmen"><i class="icon-arma-3-marksmen-dlc"></i> {{ $t('mission.requiredDLCs.marksmen') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.tacops"><i class="icon-arma-3-tac-ops-dlc"></i> {{ $t('mission.requiredDLCs.tac-ops') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotEditRequiredDLCs.tanks"><i class="icon-arma-3-tanks-dlc"></i> {{ $t('mission.requiredDLCs.tanks') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.moveAfter')" state="success" :description="$t('mission.slot.moveAfter.description')">
                <b-form-select v-model="missionSlotEditMoveAfter" :options="missionSlotEditMoveAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot edit actions">
          <b-btn variant="success" @click="editMissionSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotEditModal">
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
      missionSlotEditData: {
        autoAssignable: false,
        detailedDescription: null,
        difficulty: 0,
        reserve: false,
        blocked: false,
        restricted: false,
        restrictedCommunityUid: null,
        description: null,
        title: null,
        externalAssignee: null
      },
      missionSlotEditRequiredDLCs: {
        apex: false,
        helicopters: false,
        jets: false,
        karts: false,
        lawsofwar: false,
        marksmen: false,
        tacops: false,
        tanks: false
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
      missionSlotEditMoveAfter: 0
    }
  },
  computed: {
    missionSlotDetails() {
      return this.$store.getters.missionSlotDetails
    },
    missionSlotEditDifficultyOptions() {
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
    missionSlotEditMoveAfterOptions() {
      const options = [{
        value: this.missionSlotDetails.orderNumber - 1,
        text: this.$t('mission.slot.moveAfter.keep')
      }]

      if (_.isNil(this.missionSlotGroupDetails) || _.isNil(this.missionSlotGroupDetails.slots)) {
        return options
      }

      if (this.missionSlotGroupEditMoveAfter !== 0) {
        options.push({
          value: -1,
          text: this.$t('mission.slot.insertAfter.top')
        })
      }
      _.each(this.missionSlotGroupDetails.slots, (slot) => {
        if (this.missionSlotDetails.orderNumber !== slot.orderNumber && this.missionSlotDetails.orderNumber - 1 !== slot.orderNumber) {
          options.push({
            value: slot.orderNumber,
            text: `#${slot.orderNumber} ${slot.title}`
          })
        }
      })

      return options
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
    missionSlotGroupDetails() {
      return this.$store.getters.missionSlotGroupDetails
    },
    restrictedSlotTypeaheadInitialValue() {
      return _.isNil(this.missionSlotDetails.restrictedCommunity) ? null : this.missionSlotDetails.restrictedCommunity.name
    }
  },
  methods: {
    setMissionSlotEditData() {
      this.missionSlotEditData = {
        autoAssignable: this.missionSlotDetails.autoAssignable,
        detailedDescription: this.missionSlotDetails.detailedDescription,
        difficulty: this.missionSlotDetails.difficulty,
        orderNumber: this.missionSlotDetails.orderNumber,
        reserve: this.missionSlotDetails.reserve,
        blocked: this.missionSlotDetails.blocked,
        restricted: !_.isNil(this.missionSlotDetails.restrictedCommunity),
        restrictedCommunityUid: _.isNil(this.missionSlotDetails.restrictedCommunity) ? null : this.missionSlotDetails.restrictedCommunity.uid,
        description: this.missionSlotDetails.description,
        title: this.missionSlotDetails.title,
        externalAssignee: this.missionSlotDetails.externalAssignee
      }

      this.missionSlotEditRequiredDLCs = {
        apex: this.hasSlotRequiredDLC('apex'),
        helicopters: this.hasSlotRequiredDLC('helicopters'),
        jets: this.hasSlotRequiredDLC('jets'),
        karts: this.hasSlotRequiredDLC('karts'),
        lawsofwar: this.hasSlotRequiredDLC('laws-of-war'),
        marksmen: this.hasSlotRequiredDLC('marksmen'),
        tacops: this.hasSlotRequiredDLC('tac-ops'),
        tanks: this.hasSlotRequiredDLC('tanks')
      }

      this.missionSlotEditMoveAfter = this.missionSlotDetails.orderNumber - 1
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
      if (_.isString(this.missionSlotEditData.externalAssignee) && _.isEmpty(this.missionSlotEditData.externalAssignee)) {
        this.missionSlotEditData.externalAssignee = null
      }

      const updatedMissionSlotRequiredDLCs = []
      _.each(_.keys(this.missionSlotEditRequiredDLCs), (dlc) => {
        if (!this.missionSlotEditRequiredDLCs[dlc]) {
          return
        }

        if (dlc === 'lawsofwar') {
          updatedMissionSlotRequiredDLCs.push('laws-of-war')
        } else if (dlc === 'tacops') {
          updatedMissionSlotRequiredDLCs.push('tac-ops')
        } else {
          updatedMissionSlotRequiredDLCs.push(dlc)
        }
      })

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

      if (this.missionSlotEditMoveAfter !== this.missionSlotDetails.orderNumber - 1) {
        updatedMissionSlotDetails.moveAfter = _.max([this.missionSlotEditMoveAfter, 0])
      }

      if (!_.isEqual(this.missionSlotDetails.requiredDLCs, updatedMissionSlotRequiredDLCs)) {
        updatedMissionSlotDetails.requiredDLCs = updatedMissionSlotRequiredDLCs
      }

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
    hasSlotRequiredDLC(dlc) {
      if (_.isNil(this.missionSlotDetails)) {
        return false
      }

      if (_.isEmpty(this.missionSlotDetails.requiredDLCs)) {
        return false
      }

      return (_.indexOf(this.missionSlotDetails.requiredDLCs, dlc) >= 0)
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
