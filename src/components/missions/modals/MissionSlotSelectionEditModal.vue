<template>
  <div>
    <b-modal id="missionSlotSelectionEditModal" ref="missionSlotSelectionEditModal" size="lg" v-if="selectedMissionSlots" :title="$t('mission.modal.slot.selection.edit')" @shown="clearMissionSlotSelectionEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <div>
          <div v-html="$tc('mission.slot.selection.edit', selectedMissionSlots.length, { count: selectedMissionSlots.length })"></div>
          <br>
          <ul class="list-unstyled">
            <li v-for="slot in selectedMissionSlots" :key="slot.uid"><strong>#{{ slot.orderNumber }}</strong> - {{ slot.title }}</li>
          </ul>
        </div>
        <hr class="my-4">
        <b-form @submit.stop.prevent="editMissionSlotSelection">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.description')" state="success" :description="$t('mission.slot.description.description')">
                <b-form-input v-model="missionSlotSelectionEditData.description" textarea></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.difficulty')" state="success" :description="$t('mission.slot.difficulty.description')">
                <b-form-select v-model="missionSlotSelectionEditData.difficulty" :options="missionSlotEditDifficultyOptions" class="mb-3"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.restricted.slot')" state="success" :description="$t('mission.slot.restricted.description')">
                <b-form-checkbox v-model="missionSlotSelectionEditData.restricted"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.reserve.slot')" state="success" :description="$t('mission.slot.reserve.description')">
                <b-form-checkbox v-model="missionSlotSelectionEditData.reserve"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.blocked.slot')" state="success" :description="$t('mission.slot.blocked.description')">
                <b-form-checkbox v-model="missionSlotSelectionEditData.blocked"></b-form-checkbox>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.autoAssignable.slot')" state="success" :description="$t('mission.slot.autoAssignable.description')">
                <b-form-checkbox v-model="missionSlotSelectionEditData.autoAssignable"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row" v-if="missionSlotSelectionEditData.restricted">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slot.restricted.selection')" :state="missionSlotEditRestrictedCommunityState" :description="$t('mission.slot.restricted.selection.description')">
                <typeahead action="searchCommunities" actionIndicator="searchingCommunities" :onHit="restrictedSlotCommunitySelected"></typeahead>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot selection edit actions">
          <b-btn variant="success" @click="editMissionSlotSelection">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotSelectionEditModal">
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
      missionSlotSelectionEditData: {
        autoAssignable: false,
        blocked: false,
        description: null,
        difficulty: -1,
        reserve: false,
        restricted: false,
        restrictedCommunityUid: null
      }
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
    missionSlotEditRestrictedCommunityState() {
      return this.missionSlotSelectionEditData.restricted && _.isNil(this.missionSlotSelectionEditData.restrictedCommunityUid) ? 'danger' : 'success'
    },
    selectedMissionSlots() {
      return this.$store.getters.selectedMissionSlots
    }
  },
  methods: {
    clearMissionSlotSelectionEditData() {
      this.missionSlotSelectionEditData = {
        autoAssignable: false,
        blocked: false,
        description: null,
        difficulty: -1,
        reserve: false,
        restricted: false,
        restrictedCommunityUid: null
      }
    },
    editMissionSlotSelection() {
      if (this.missionSlotSelectionEditData.restricted && (_.isNil(this.missionSlotSelectionEditData.restrictedCommunityUid) || _.isEmpty(this.missionSlotSelectionEditData.restrictedCommunityUid))) {
        return
      }

      const updatedMissionSlotDetails = {}
      if (this.missionSlotSelectionEditData.autoAssignable) {
        updatedMissionSlotDetails.autoAssignable = this.missionSlotSelectionEditData.autoAssignable
      }
      if (this.missionSlotSelectionEditData.blocked) {
        updatedMissionSlotDetails.blocked = this.missionSlotSelectionEditData.blocked
      }
      if (!_.isNil(this.missionSlotSelectionEditData.description) && !_.isEmpty(this.missionSlotSelectionEditData.description)) {
        updatedMissionSlotDetails.description = this.missionSlotSelectionEditData.description
      }
      if (this.missionSlotSelectionEditData.difficulty >= 0) {
        updatedMissionSlotDetails.difficulty = this.missionSlotSelectionEditData.difficulty
      }
      if (this.missionSlotSelectionEditData.reserve) {
        updatedMissionSlotDetails.reserve = this.missionSlotSelectionEditData.reserve
      }
      if (this.missionSlotSelectionEditData.restricted && !_.isNil(this.missionSlotSelectionEditData.restrictedCommunityUid) && !_.isEmpty(this.missionSlotSelectionEditData.restrictedCommunityUid)) {
        updatedMissionSlotDetails.restrictedCommunityUid = this.missionSlotSelectionEditData.restrictedCommunityUid
      }

      this.hideMissionSlotSelectionEditModal()

      if (_.isEmpty(_.keys(updatedMissionSlotDetails))) {
        return
      }

      this.$store.dispatch('editSelectedMissionSlots', { missionSlug: this.$route.params.missionSlug, updatedMissionSlotDetails })
    },
    hideMissionSlotSelectionEditModal() {
      this.$refs.missionSlotSelectionEditModal.hide()
    },
    restrictedSlotCommunitySelected(item) {
      this.missionSlotSelectionEditData.restrictedCommunityUid = item.value.uid
    }
  }
}
</script>
