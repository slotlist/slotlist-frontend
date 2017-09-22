<template>
  <div>
    <b-modal id="missionSlotCreateModal" ref="missionSlotCreateModal" size="lg" v-if="missionSlotGroupDetails" :title="slotCreateTitle" @shown="clearMissionSlotCreateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="createMissionSlot">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.title')" :state="missionSlotCreateTitleState" :feedback="missionSlotCreateTitleFeedback" :description="$t('mission.slot.title.description')">
                <b-form-input v-model="missionSlotCreateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.description.optional')" state="success" :description="$t('mission.slot.description.description')">
                <b-form-input v-model="missionSlotCreateData.description" textarea></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.orderNumber')" :state="missionSlotCreateOrderNumberState" :feedback="missionSlotCreateOrderNumberFeedback" :description="$t('mission.slot.orderNumber.description')">
                <b-input-group left="#">
                  <b-form-input v-model="missionSlotCreateData.orderNumber" type="number" min="1" :formatter="missionSlotCreateOrderNumberFormatter" required></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.difficulty')" state="success" :description="$t('mission.slot.difficulty.description')">
                <b-form-select v-model="missionSlotCreateData.difficulty" :options="missionSlotCreateDifficultyOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.restricted.slot')" state="success" :description="$t('mission.slot.restricted.description')">
                <b-form-checkbox v-model="missionSlotCreateData.restricted"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.reserve.slot')" state="success" :description="$t('mission.slot.reserve.description')">
                <b-form-checkbox v-model="missionSlotCreateData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row" v-if="missionSlotCreateData.restricted">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.restricted.selection')" :state="missionSlotCreateRestrictedCommunityState" :description="$t('mission.slot.restricted.selection.description')">
                <typeahead action="searchCommunities" actionIndicator="searchingCommunities" :onHit="restrictedSlotCommunitySelected"></typeahead>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.detailedDescription.optional')" state="success" :description="$t('mission.slot.detailedDescription.description')">
                <quill-editor v-model="missionSlotCreateData.detailedDescription" ref="missionSlotCreateDetailedDescriptionEditor" :options="missionSlotCreateDetailedDescriptionEditorOptions"></quill-editor>
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot create actions">
          <b-btn variant="success" @click="createMissionSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit' ) }}
          </b-btn>
          <b-btn @click="hideMissionSlotCreateModal">
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
      missionSlotCreateData: {
        detailedDescription: null,
        difficulty: 0,
        orderNumber: 1,
        reserve: false,
        restricted: false,
        restrictedCommunityUid: null,
        description: null,
        title: null
      },
      missionSlotCreateDetailedDescriptionEditorOptions: {
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
      missionSlotCreateDifficultyOptions: [
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
    missionSlotCreateOrderNumberFeedback() {
      return this.missionSlotCreateData.orderNumber < 0 ? this.$t('mission.feedback.orderNumber') : ''
    },
    missionSlotCreateOrderNumberState() {
      return this.missionSlotCreateData.orderNumber < 0 ? 'danger' : 'success'
    },
    missionSlotCreateRestrictedCommunityState() {
      return this.missionSlotCreateData.restricted && _.isNil(this.missionSlotCreateData.restrictedCommunityUid) ? 'danger' : 'success'
    },
    missionSlotCreateTitleFeedback() {
      return _.isString(this.missionSlotCreateData.title) && !_.isEmpty(this.missionSlotCreateData.title) ? '' : this.$t('mission.feedback.title.slot')
    },
    missionSlotCreateTitleState() {
      return _.isString(this.missionSlotCreateData.title) && !_.isEmpty(this.missionSlotCreateData.title) ? 'success' : 'danger'
    },
    missionSlotGroupDetails() {
      return this.$store.getters.missionSlotGroupDetails
    },
    slotCreateTitle() {
      return `${this.$t('mission.modal.slot.create')} #${this.missionSlotGroupDetails.orderNumber} ${this.missionSlotGroupDetails.title}`
    }
  },
  methods: {
    clearMissionSlotCreateData() {
      this.missionSlotCreateData = {
        detailedDescription: null,
        difficulty: 0,
        orderNumber: 1,
        reserve: false,
        restricted: false,
        restrictedCommunityUid: null,
        description: null,
        title: null
      }
    },
    createMissionSlot() {
      if (_.isEmpty(this.missionSlotCreateData.title)) {
        return
      } else if (this.missionSlotCreateData.restricted && (_.isNil(this.missionSlotCreateData.restrictedCommunityUid) || _.isEmpty(this.missionSlotCreateData.restrictedCommunityUid))) {
        return
      }

      if (_.isString(this.missionSlotCreateData.detailedDescription) && _.isEmpty(this.missionSlotCreateData.detailedDescription)) {
        this.missionSlotCreateData.detailedDescription = null
      }
      if (_.isString(this.missionSlotCreateData.description) && _.isEmpty(this.missionSlotCreateData.description)) {
        this.missionSlotCreateData.description = null
      }
      if (_.isString(this.missionSlotCreateData.restrictedCommunityUid) && _.isEmpty(this.missionSlotCreateData.restrictedCommunityUid)) {
        this.missionSlotCreateData.restrictedCommunityUid = null
      }

      const payload = _.assign({ slotGroupUid: this.missionSlotGroupDetails.uid }, _.omit(this.missionSlotCreateData, 'restricted'))

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
    },
    restrictedSlotCommunitySelected(item) {
      this.missionSlotCreateData.restrictedCommunityUid = item.value.uid
    }
  }
}
</script>
