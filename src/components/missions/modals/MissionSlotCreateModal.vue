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
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.blocked.slot')" state="success" :description="$t('mission.slot.blocked.description')">
                <b-form-checkbox v-model="missionSlotCreateData.blocked"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.autoAssignable.slot')" state="success" :description="$t('mission.slot.autoAssignable.description')" :feedback="missionSlotCreateAutoAssignableFeedback">
                <b-form-checkbox v-model="missionSlotCreateData.autoAssignable" :disabled="areMissionSlotAutoAssignable"></b-form-checkbox>
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
          <span class="text-success" style="font-size: 1rem; font-weight: 400; line-height: 1.5">{{ $t('mission.requiredDLCs') }}</span>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.aow"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/aow.png" width="16px" alt="Art of War" /> {{ $t('mission.requiredDLCs.aow') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.apex"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/apex.png" width="16px" alt="Apex" /> {{ $t('mission.requiredDLCs.apex') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.contact"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/contact.png" width="16px" alt="Contact" /> {{ $t('mission.requiredDLCs.contact') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.csla"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/csla.png" width="16px" alt="CSLA Iron Curtain" /> {{ $t('mission.requiredDLCs.csla') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.gm"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/gm.png" width="16px" alt="Global Mobilization" /> {{ $t('mission.requiredDLCs.gm') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.helicopters"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/helicopters.png" width="16px" alt="Helicopters" /> {{ $t('mission.requiredDLCs.helicopters') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.jets"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/jets.png" width="16px" alt="Jets" /> {{ $t('mission.requiredDLCs.jets') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.karts"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/karts.png" width="16px" alt="Karts" /> {{ $t('mission.requiredDLCs.karts') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.lawsofwar"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/laws-of-war.png" width="16px" alt="Laws of War" /> {{ $t('mission.requiredDLCs.laws-of-war') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.marksmen"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/marksmen.png" width="16px" alt="Marksmen" /> {{ $t('mission.requiredDLCs.marksmen') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.tacops"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tac-ops.png" width="16px" alt="Tac-Ops" /> {{ $t('mission.requiredDLCs.tac-ops') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.tanks"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tanks.png" width="16px" alt="Tanks" /> {{ $t('mission.requiredDLCs.tanks') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.vn"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/vn.png" width="16px" alt="S.O.G. Prairie Fire" /> {{ $t('mission.requiredDLCs.vn') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.ef"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/ef.png" width="16px" alt="Expeditionary Forces" /> {{ $t('mission.requiredDLCs.ef') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionSlotCreateRequiredDLCs.rf"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/rf.png" width="16px" alt="Reaction Forces" /> {{ $t('mission.requiredDLCs.rf') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.insertAfter')" state="success" :description="$t('mission.slot.insertAfter.description')">
                <b-form-select v-model="missionSlotCreateData.insertAfter" :options="missionSlotCreateInsertAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot create actions">
          <b-btn variant="success" @click="createMissionSlot">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotCreateModal">
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
      missionSlotCreateData: {
        autoAssignable: false,
        detailedDescription: null,
        difficulty: 0,
        insertAfter: 0,
        reserve: false,
        blocked: false,
        restricted: false,
        restrictedCommunityUid: null,
        description: null,
        title: null
      },
      missionSlotCreateRequiredDLCs: {
        aow: false,
        apex: false,
        contact: false,
        csla: false,
        ef: false,
        gm: false,
        helicopters: false,
        jets: false,
        karts: false,
        lawsofwar: false,
        marksmen: false,
        rf: false,
        tacops: false,
        tanks: false,
        vn: false
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
    areMissionSlotAutoAssignable() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return this.missionDetails.slotsAutoAssignable
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionSlotCreateAutoAssignableFeedback() {
      if (!this.areMissionSlotAutoAssignable) {
        return ''
      }

      return this.$t('mission.feedback.slot.autoAssignable.mission')
    },
    missionSlotCreateInsertAfterOptions() {
      const options = [{
        value: 0,
        text: this.$t('mission.slotGroup.insertAfter.top')
      }]

      if (_.isNil(this.missionSlotGroupDetails) || _.isNil(this.missionSlotGroupDetails.slots)) {
        return options
      }

      _.each(this.missionSlotGroupDetails.slots, (slot) => {
        options.push({
          value: slot.orderNumber,
          text: `#${slot.orderNumber} ${slot.title}`
        })
      })

      return options
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
        autoAssignable: this.areMissionSlotAutoAssignable,
        detailedDescription: null,
        difficulty: 0,
        insertAfter: _.isNil(this.missionSlotGroupDetails) || _.isNil(this.missionSlotGroupDetails.slots) || _.isEmpty(this.missionSlotGroupDetails.slots) ? 0 : _.last(this.missionSlotGroupDetails.slots).orderNumber,
        reserve: false,
        blocked: false,
        restricted: false,
        restrictedCommunityUid: null,
        description: null,
        title: null
      }

      this.missionSlotCreateRequiredDLCs = {
        aow: false,
        apex: false,
        contact: false,
        csla: false,
        ef: false,
        gm: false,
        helicopters: false,
        jets: false,
        karts: false,
        lawsofwar: false,
        marksmen: false,
        rf: false,
        tacops: false,
        tanks: false,
        vn: false
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

      const missionSlotRequiredDLCs = []
      _.each(_.keys(this.missionSlotCreateRequiredDLCs), (dlc) => {
        if (!this.missionSlotCreateRequiredDLCs[dlc]) {
          return
        }

        if (dlc === 'lawsofwar') {
          missionSlotRequiredDLCs.push('laws-of-war')
        } else if (dlc === 'tacops') {
          missionSlotRequiredDLCs.push('tac-ops')
        } else {
          missionSlotRequiredDLCs.push(dlc)
        }
      })

      const payload = _.assign({ slotGroupUid: this.missionSlotGroupDetails.uid, requiredDLCs: missionSlotRequiredDLCs }, _.omit(this.missionSlotCreateData, 'restricted'))

      this.hideMissionSlotCreateModal()

      this.$store.dispatch('createMissionSlot', { missionSlug: this.$route.params.missionSlug, slotDetails: payload })
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
