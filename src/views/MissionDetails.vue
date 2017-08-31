<template>
  <div>
    <!-- Begin of content -->
    <div v-if="missionDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">by</span>
          <router-link :to="{name: 'userDetails', params: {userUid: missionDetails.creator.uid}}">{{ formatUserWithTag(missionDetails.creator) }}</router-link>
        </h5>
        <br>
        <p class="lead text-justify">{{ missionDetails.shortDescription }}</p>
        <hr class="my-4">
        <div class="row text-center">
          <div class="col">
            <h5>Community</h5>
            <p>
              <router-link v-if="missionDetails.community" :to="{name: 'communityDetails', params: {communitySlug: missionDetails.community.slug}}">{{ missionDetails.community.name }}</router-link>
              <span v-if="!missionDetails.community" class="text-muted font-italic">not associated</span>
            </p>
          </div>
          <div class="col">
            <h5>Repository URL</h5>
            <p v-html="optionalRepositoryUrl"></p>
          </div>
          <div class="col">
            <h5>Visibility</h5>
            <p v-html="formattedMissionVisibility"></p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>Slotting time</h5>
            <p class="font-weight-bold text-success">{{ formatDateTime(missionDetails.slottingTime) }}</p>
          </div>
          <div class="col">
            <h5>Start time</h5>
            <p class="font-weight-bold text-danger">{{ formatDateTime(missionDetails.startTime) }}</p>
          </div>
          <div class="col">
            <h5>End time
              <span class="text-muted">(est.)</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.endTime) }}</p>
          </div>
          <div class="col">
            <h5>Briefing
              <span class="text-muted">(ldrsp.)</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.briefingTime) }}</p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>Techsupport</h5>
            <p v-html="optionalTechSupport"></p>
          </div>
          <div class="col">
            <h5>Rules</h5>
            <p v-html="optionalRules"></p>
          </div>
        </div>
        <hr class="my-4" v-if="isMissionEditor">
        <div class="row justify-content-center" v-if="isMissionEditor">
          <div class="btn-group" role="group" aria-label="Mission actions">
            <button type="button" class="btn btn-primary" @click="showMissionEditModal">
              <i class="fa fa-edit" aria-hidden="true"></i> Edit
            </button>
            <button type="button" class="btn btn-danger" v-if="isMissionCreator" @click="showMissionDeletionModal">
              <i class="fa fa-trash" aria-hidden="true"></i> Delete
            </button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <div class="html ql-editor text-justify" v-html="missionDetails.description"></div>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h1>Slotlist</h1>
          <div class="small">
            <b-form-group label="Filter" label-for="missionSlotlistFilter">
              <div role="group" id="missionSlotlistFilter">
                <b-form-checkbox v-model="missionSlotlistFilter" name="assigned" value="assigned">
                  assigned
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="hasRegistrations" value="hasRegistrations">
                  has registrations
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="open" value="open">
                  open
                </b-form-checkbox>
              </div>
            </b-form-group>
          </div>
          <mission-slotlist></mission-slotlist>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <b-modal ref="slotCreateModal" id="slotCreateModal" size="lg" @show="clearSlotCreateModal" @hide="slotCreateModalClosed">
        <div slot="modal-title">
          <h5>Create slot</h5>
        </div>
        <div class="container-fluid">
          <b-form @submit.stop.prevent="submitSlotCreate">
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Title" :state="slotCreateTitleState" :feedback="slotCreateTitleFeedback">
                  <b-form-input v-model="slotCreateTitle" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Short description <em>(optional)</em>" :state="slotCreateShortDescriptionState" :feedback="slotCreateShortDescriptionFeedback">
                  <b-form-input v-model="slotCreateShortDescription" textarea></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Order number" description="Starts at 0 (e.g. orderNumber 0 displayed as slot #1)" :state="slotCreateOrderNumberState" :feedback="slotCreateOrderNumberFeedback">
                  <b-form-input v-model="slotCreateOrderNumber" type="number" required :formatter="slotCreateOrderNumberFormatter"></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Difficulty" :state="slotCreateDifficultyState" :feedback="slotCreateDifficultyFeedback">
                  <b-form-select v-model="slotCreateDifficulty" :options="slotDifficultyOptions" class="mb-3" required></b-form-select>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Restricted slot" description="Restricted slots are not available to the public, but only to selected players" :state="slotCreateRestrictedState" :feedback="slotCreateRestrictedFeedback">
                  <b-form-checkbox v-model="slotCreateRestricted"></b-form-checkbox>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Reserve slot" description="Reserve slots will only be filled if all other slots have been taken before" :state="slotCreateReserveState" :feedback="slotCreateReserveFeedback">
                  <b-form-checkbox v-model="slotCreateReserve"></b-form-checkbox>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Description <em>(optional)</em>" :state="slotCreateDescriptionState" :feedback="slotCreateDescriptionFeedback">
                  <quill-editor v-model="slotCreateDescription" ref="slotCreateDescriptionEditor" :options="editorOptions"></quill-editor>
                </b-form-fieldset>
              </div>
            </div>
          </b-form>
        </div>
        <div slot="modal-footer">
          <div class="btn-group" role="group" aria-label="Mission slot create actions">
            <button type="button" class="btn btn-success" @click="submitSlotCreate">
              <i class="fa fa-plus" aria-hidden="true"></i> Submit
            </button>
            <button type="button" class="btn btn-secondary" @click="hideSlotCreateModal">
              <i class="fa fa-close" aria-hidden="true"></i> Cancel
            </button>
          </div>
        </div>
      </b-modal>
      <b-modal ref="slotEditModal" id="slotEditModal" v-if="slotDetails" size="lg" @show="populateSlotEditModal">
        <div slot="modal-title">
          <h5>Edit slot #{{ slotDetails.orderNumber }} {{ slotDetails.title }}</h5>
        </div>
        <div class="container-fluid">
          <b-form @submit.stop.prevent="submitSlotEdit">
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Title" :state="slotEditTitleState" :feedback="slotEditTitleFeedback">
                  <b-form-input v-model="slotEditTitle" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Short description <em>(optional)</em>" :state="slotEditShortDescriptionState" :feedback="slotEditShortDescriptionFeedback">
                  <b-form-input v-model="slotEditShortDescription" textarea></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Order number" description="Starts at 0 (e.g. orderNumber 0 displayed as slot #1)" :state="slotEditOrderNumberState" :feedback="slotEditOrderNumberFeedback">
                  <b-form-input v-model="slotEditOrderNumber" type="number" required :formatter="slotEditOrderNumberFormatter"></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Difficulty" :state="slotEditDifficultyState" :feedback="slotEditDifficultyFeedback">
                  <b-form-select v-model="slotEditDifficulty" :options="slotDifficultyOptions" class="mb-3" required></b-form-select>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Restricted slot" description="Restricted slots are not available to the public, but only to selected players" :state="slotEditRestrictedState" :feedback="slotEditRestrictedFeedback">
                  <b-form-checkbox v-model="slotEditRestricted"></b-form-checkbox>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Reserve slot" description="Reserve slots will only be filled if all other slots have been taken before" :state="slotEditReserveState" :feedback="slotEditReserveFeedback">
                  <b-form-checkbox v-model="slotEditReserve"></b-form-checkbox>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Description <em>(optional)</em>" :state="slotEditDescriptionState" :feedback="slotEditDescriptionFeedback">
                  <quill-editor v-model="slotEditDescription" ref="slotEditDescriptionEditor" :options="editorOptions"></quill-editor>
                </b-form-fieldset>
              </div>
            </div>
          </b-form>
        </div>
        <div slot="modal-footer">
          <div class="btn-group" role="group" aria-label="Mission slot edit actions">
            <button type="button" class="btn btn-success" @click="submitSlotEdit">
              <i class="fa fa-edit" aria-hidden="true"></i> Submit changes
            </button>
            <button type="button" class="btn btn-secondary" @click="hideSlotEditModal">
              <i class="fa fa-close" aria-hidden="true"></i> Cancel
            </button>
          </div>
        </div>
      </b-modal>
      <b-modal ref="missionEditModal" id="missionEditModal" size="lg" @show="populateMissionEditModal">
        <div slot="modal-title">
          <h5>Edit mission</h5>
        </div>
        <div class="container-fluid">
          <b-form @submit.stop.prevent="submitMissionEdit">
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Title" :state="missionEditTitleState" :feedback="missionEditTitleFeedback">
                  <b-form-input v-model="missionEditTitle" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Short description" :state="missionEditShortDescriptionState" :feedback="missionEditShortDescriptionFeedback">
                  <b-form-input v-model="missionEditShortDescription" textarea required></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Description" :state="missionEditDescriptionState" :feedback="missionEditDescriptionFeedback">
                  <quill-editor v-model="missionEditDescription" ref="missionEditDescriptionEditor" :options="editorOptions" required></quill-editor>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Slotting time" :state="missionEditSlottingTimeState" :feedback="missionEditSlottingTimeFeedback">
                  <b-form-input v-model="missionEditSlottingTime" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Start time" :state="missionEditStartTimeState" :feedback="missionEditStartTimeFeedback">
                  <b-form-input v-model="missionEditStartTime" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="End time" :state="missionEditEndTimeState" :feedback="missionEditEndTimeFeedback">
                  <b-form-input v-model="missionEditEndTime" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Briefing time" :state="missionEditBriefingTimeState" :feedback="missionEditBriefingTimeFeedback">
                  <b-form-input v-model="missionEditBriefingTime" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Repository URL <em>(optional)</em>" :state="missionEditRepositoryUrlState" :feedback="missionEditRepositoryUrlFeedback">
                  <b-form-input v-model="missionEditRepositoryUrl" type="text"></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Tech support <em>(optional)</em>" :state="missionEditTechSupportState" :feedback="missionEditTechSupportFeedback">
                  <quill-editor v-model="missionEditTechSupport" ref="missionEditTechSupportEditor" :options="editorOptions"></quill-editor>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Rules <em>(optional)</em>" :state="missionEditRulesState" :feedback="missionEditRulesFeedback">
                  <quill-editor v-model="missionEditRules" ref="missionEditRulesEditor" :options="editorOptions"></quill-editor>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Visibility" :state="missionEditVisibilityState" :feedback="missionEditVisibilityFeedback">
                  <b-form-select v-model="missionEditVisibility" :options="missionEditVisibilityOptions" class="mb-3" required></b-form-select>
                </b-form-fieldset>
              </div>
            </div>
          </b-form>
        </div>
        <div slot="modal-footer">
          <div class="btn-group" role="group" aria-label="Mission edit actions">
            <button type="button" class="btn btn-success" @click="submitMissionEdit">
              <i class="fa fa-edit" aria-hidden="true"></i> Submit changes
            </button>
            <button type="button" class="btn btn-secondary" @click="hideMissionEditModal">
              <i class="fa fa-close" aria-hidden="true"></i> Cancel
            </button>
          </div>
        </div>
      </b-modal>
      <mission-create-slot-group-modal></mission-create-slot-group-modal>
      <mission-slot-details-modal></mission-slot-details-modal>
      <mission-slot-registration-modal></mission-slot-registration-modal>
    </div>
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
      <div v-if="registeringForSlot">
        <loading-overlay message="Registering for Mission slot..."></loading-overlay>
      </div>
      <div v-if="unregisteringFromSlot">
        <loading-overlay message="Unregistering from Mission slot..."></loading-overlay>
      </div>
      <div v-if="creatingSlot">
        <loading-overlay message="Creating Mission slot..."></loading-overlay>
      </div>
      <div v-if="editingSlot">
        <loading-overlay message="Editing Mission slot..."></loading-overlay>
      </div>
      <div v-if="deletingSlot">
        <loading-overlay message="Deleting Mission slot..."></loading-overlay>
      </div>
      <div v-if="modifyingSlotRegistration">
        <loading-overlay message="Modifying Mission slot registration..."></loading-overlay>
      </div>
    </div>
    <!-- End of overlays -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionCreateSlotGroupModal from 'components/missions/modals/MissionCreateSlotGroupModal.vue'
import MissionSlotDetailsModal from 'components/missions/modals/MissionSlotDetailsModal.vue'
import MissionSlotlist from 'components/missions/MissionSlotlist.vue'
import MissionSlotRegistrationModal from 'components/missions/modals/MissionSlotRegistrationModal.vue'
import utils from '../utils'

export default {
  components: {
    MissionCreateSlotGroupModal,
    MissionSlotDetailsModal,
    MissionSlotlist,
    MissionSlotRegistrationModal
  },
  data() {
    return {
      editorOptions: {
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
      slotDifficultyOptions: [
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
      ],
      slotRegistrationComment: null,
      missionEditTitle: null,
      missionEditShortDescription: null,
      missionEditDescription: null,
      missionEditSlottingTime: null,
      missionEditStartTime: null,
      missionEditEndTime: null,
      missionEditBriefingTime: null,
      missionEditRepositoryUrl: null,
      missionEditTechSupport: null,
      missionEditRules: null,
      missionEditVisibility: null,
      slotCreateOrderNumber: null,
      slotCreateTitle: null,
      slotCreateDifficulty: null,
      slotCreateShortDescription: null,
      slotCreateDescription: null,
      slotCreateRestricted: false,
      slotCreateReserve: false,
      slotEditOrderNumber: null,
      slotEditTitle: null,
      slotEditDifficulty: null,
      slotEditShortDescription: null,
      slotEditDescription: null,
      slotEditRestricted: false,
      slotEditReserve: false,
      missionSlotlistFilter: []
    }
  },
  computed: {
    loaded() {
      return this.$store.getters.missionDetailsLoaded
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    user() {
      return this.$store.getters.user
    },
    slotlistLoaded() {
      return this.$store.getters.missionSlotlistLoaded
    },
    registeringForSlot() {
      return this.$store.getters.registeringForMissionSlot
    },
    unregisteringFromSlot() {
      return this.$store.getters.unregisteringFromMissionSlot
    },
    creatingSlot() {
      return this.$store.getters.creatingMissionSlot
    },
    editingSlot() {
      return this.$store.getters.editingMissionSlot
    },
    deletingSlot() {
      return this.$store.getters.deletingMissionSlot
    },
    modifyingSlotRegistration() {
      return this.$store.getters.modifyingMissionSlotRegistration
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    isMissionCreator() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`])
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    optionalRepositoryUrl() {
      return this.missionDetails.repositoryUrl || "<span class='text-muted font-italic'>not required</span>"
    },
    optionalTechSupport() {
      return this.missionDetails.techSupport || "<span class='text-muted font-italic'>not provided</span>"
    },
    optionalRules() {
      return this.missionDetails.rules || "<span class='text-muted font-italic'>not specified</span>"
    },
    slotDetails() {
      return this.$store.getters.missionSlotDetails
    },
    showSlotDetails() {
      return this.$store.getters.showMissionSlotDetails
    },
    showSlotCreate() {
      return this.$store.getters.showMissionSlotCreate
    },
    showSlotRegister() {
      return this.$store.getters.showMissionSlotRegister
    },
    showSlotDeletion() {
      return this.$store.getters.showMissionSlotDeletion
    },
    showSlotUnregister() {
      return this.$store.getters.showMissionSlotUnregister
    },
    showSlotRegistrationConfirmation() {
      return this.$store.getters.showMissionSlotRegistrationConfirmation
    },
    registrationAssign() {
      return this.$store.getters.showMissionSlotRegistrationConfirmationAssign
    },
    registrationDetails() {
      return this.$store.getters.missionSlotRegistration
    },
    registrationUser() {
      if (_.isNil(this.registrationDetails) || _.isNil(this.registrationDetails.user)) {
        return null
      }

      return this.formatUserWithTag(this.registrationDetails.user)
    },
    registrationButtonClass() {
      return this.registrationAssign ? 'btn btn-success' : 'btn btn-danger'
    },
    registrationIcon() {
      return this.registrationAssign ? 'fa fa-check' : 'fa fa-close'
    },
    formattedMissionVisibility() {
      switch (this.missionDetails.visibility) {
        case 'community':
          return `<span class="text-primary"><i class="fa fa-users" aria-hidden="true"></i> community members</span>`
        case 'hidden':
          return `<span class="text-danger"><i class="fa fa-edit" aria-hidden="true"></i> mission creator & editors only</span>`
        case 'private':
          return `<span class="text-warning"><i class="fa fa-user-secret" aria-hidden="true"></i> selected users</span>`
        case 'public':
          return `<span class="text-success"><i class="fa fa-globe" aria-hidden="true"></i> everyone</span>`
        default:
          return `<span class="text-muted font-italic"><i class="fa fa-question-circle" aria-hidden="true"></i> unknown</span>`
      }
    },
    optionalAssignee() {
      return _.isNil(this.slotDetails.assignee) ? '<span class="text-muted font-italic">not assigned</span>' : this.formatUserWithTag(this.slotDetails.assignee)
    },
    difficultyColor() {
      switch (this.slotDetails.difficulty) {
        case 0: return 'text-muted'
        case 1: return 'text-info'
        case 2: return 'text-primary'
        case 3: return 'text-warning'
        case 4: return 'text-danger'
        default: return ''
      }
    },
    difficultyIcon() {
      return `${this.difficultyColor} fa fa-thermometer-${this.slotDetails.difficulty} fa-lg`
    },
    difficultyText() {
      switch (this.slotDetails.difficulty) {
        case 0: return 'Beginner'
        case 1: return 'Easy'
        case 2: return 'Medium'
        case 3: return 'Advanced'
        case 4: return 'Expert'
        default: return ''
      }
    },
    slotStatus() {
      return `${this.slotRestricted} - ${this.slotReserve}`
    },
    slotRestricted() {
      if (this.slotDetails.restricted) {
        return '<span class="text-primary font-italic">restricted</span>'
      }

      return '<span>unrestricted</span>'
    },
    slotReserve() {
      if (this.slotDetails.reserve) {
        return '<span class="text-muted font-italic">reserve</span>'
      }

      return '<span>regular</span>'
    },
    missionEditTitleState() {
      return _.isNil(this.missionEditTitle) || _.isEmpty(this.missionEditTitle) ? 'danger' : 'success'
    },
    missionEditTitleFeedback() {
      return _.isNil(this.missionEditTitle) || _.isEmpty(this.missionEditTitle) ? 'Please enter a title' : ''
    },
    missionEditShortDescriptionState() {
      return _.isNil(this.missionEditShortDescription) || _.isEmpty(this.missionEditShortDescription) ? 'danger' : 'success'
    },
    missionEditShortDescriptionFeedback() {
      return _.isNil(this.missionEditShortDescription) || _.isEmpty(this.missionEditShortDescription) ? 'Please enter a short (plain text) description' : ''
    },
    missionEditDescriptionState() {
      return _.isNil(this.missionEditDescription) || _.isEmpty(this.missionEditDescription) ? 'danger' : 'success'
    },
    missionEditDescriptionFeedback() {
      return _.isNil(this.missionEditDescription) || _.isEmpty(this.missionEditDescription) ? 'Please enter a description' : ''
    },
    missionEditSlottingTimeState() {
      return _.isNil(this.missionEditSlottingTime) || _.isEmpty(this.missionEditSlottingTime) ? 'danger' : 'success'
    },
    missionEditSlottingTimeFeedback() {
      return _.isNil(this.missionEditSlottingTime) || _.isEmpty(this.missionEditSlottingTime) ? 'Please enter a slotting date & time' : ''
    },
    missionEditStartTimeState() {
      return _.isNil(this.missionEditStartTime) || _.isEmpty(this.missionEditStartTime) ? 'danger' : 'success'
    },
    missionEditStartTimeFeedback() {
      return _.isNil(this.missionEditStartTime) || _.isEmpty(this.missionEditStartTime) ? 'Please enter a start date & time' : ''
    },
    missionEditEndTimeState() {
      return _.isNil(this.missionEditEndTime) || _.isEmpty(this.missionEditEndTime) ? 'danger' : 'success'
    },
    missionEditEndTimeFeedback() {
      return _.isNil(this.missionEditEndTime) || _.isEmpty(this.missionEditEndTime) ? 'Please enter an (est.) end date & time' : ''
    },
    missionEditBriefingTimeState() {
      return _.isNil(this.missionEditBriefingTime) || _.isEmpty(this.missionEditBriefingTime) ? 'danger' : 'success'
    },
    missionEditBriefingTimeFeedback() {
      return _.isNil(this.missionEditBriefingTime) || _.isEmpty(this.missionEditBriefingTime) ? 'Please enter a (ldrsp.) briefing date & time' : ''
    },
    missionEditRepositoryUrlState() {
      return 'success'
    },
    missionEditRepositoryUrlFeedback() {
      return ''
    },
    missionEditTechSupportState() {
      return 'success'
    },
    missionEditTechSupportFeedback() {
      return ''
    },
    missionEditRulesState() {
      return 'success'
    },
    missionEditRulesFeedback() {
      return ''
    },
    missionEditVisibilityState() {
      return _.isNil(this.missionEditVisibility) || _.isEmpty(this.missionEditVisibility) ? 'danger' : 'success'
    },
    missionEditVisibilityFeedback() {
      return _.isNil(this.missionEditVisibility) || _.isEmpty(this.missionEditVisibility) ? 'Please select a visibility setting' : ''
    },
    missionEditVisibilityOptions() {
      let options = [
        {
          text: 'mission creator & editors only',
          value: 'hidden'
        },
        // Disabled for now since the backend doesn't fully support this setting yet
        /* {
          text: 'selected users',
          value: 'private'
        }, */
        {
          text: 'everyone',
          value: 'public'
        }
      ]

      if (!_.isNil(this.user.community)) {
        options = [
          {
            text: 'community members',
            value: 'community'
          },
          ...options
        ]
      }

      return options
    },
    slotCreateOrderNumberState() {
      return _.isNil(this.slotCreateOrderNumber) && !_.isNumber(this.slotCreateOrderNumber) ? 'danger' : 'success'
    },
    slotCreateOrderNumberFeedback() {
      return _.isNil(this.slotCreateOrderNumber) && !_.isNumber(this.slotCreateOrderNumber) ? 'Please enter an order number' : ''
    },
    slotCreateTitleState() {
      return _.isNil(this.slotCreateTitle) || _.isEmpty(this.slotCreateTitle) ? 'danger' : 'success'
    },
    slotCreateTitleFeedback() {
      return _.isNil(this.slotCreateTitle) || _.isEmpty(this.slotCreateTitle) ? 'Please enter a title' : ''
    },
    slotCreateDifficultyState() {
      return _.isNil(this.slotCreateDifficulty) || !_.isNumber(this.slotCreateDifficulty) ? 'danger' : 'success'
    },
    slotCreateDifficultyFeedback() {
      return _.isNil(this.slotCreateDifficulty) || !_.isNumber(this.slotCreateDifficulty) ? 'Please select a difficulty' : ''
    },
    slotCreateRestrictedState() {
      return 'success'
    },
    slotCreateRestrictedFeedback() {
      return ''
    },
    slotCreateReserveState() {
      return 'success'
    },
    slotCreateReserveFeedback() {
      return ''
    },
    slotCreateShortDescriptionState() {
      return 'success'
    },
    slotCreateShortDescriptionFeedback() {
      return ''
    },
    slotCreateDescriptionState() {
      return 'success'
    },
    slotCreateDescriptionFeedback() {
      return ''
    },
    slotEditOrderNumberState() {
      return _.isNil(this.slotEditOrderNumber) && !_.isNumber(this.slotEditOrderNumber) ? 'danger' : 'success'
    },
    slotEditOrderNumberFeedback() {
      return _.isNil(this.slotEditOrderNumber) && !_.isNumber(this.slotEditOrderNumber) ? 'Please enter an order number' : ''
    },
    slotEditTitleState() {
      return _.isNil(this.slotEditTitle) || _.isEmpty(this.slotEditTitle) ? 'danger' : 'success'
    },
    slotEditTitleFeedback() {
      return _.isNil(this.slotEditTitle) || _.isEmpty(this.slotEditTitle) ? 'Please enter a title' : ''
    },
    slotEditDifficultyState() {
      return _.isNil(this.slotEditDifficulty) || !_.isNumber(this.slotEditDifficulty) ? 'danger' : 'success'
    },
    slotEditDifficultyFeedback() {
      return _.isNil(this.slotEditDifficulty) || !_.isNumber(this.slotEditDifficulty) ? 'Please select a difficulty' : ''
    },
    slotEditRestrictedState() {
      return 'success'
    },
    slotEditRestrictedFeedback() {
      return ''
    },
    slotEditReserveState() {
      return 'success'
    },
    slotEditReserveFeedback() {
      return ''
    },
    slotEditShortDescriptionState() {
      return 'success'
    },
    slotEditShortDescriptionFeedback() {
      return ''
    },
    slotEditDescriptionState() {
      return 'success'
    },
    slotEditDescriptionFeedback() {
      return ''
    },
  },
  methods: {
    slotCreateOrderNumberFormatter(val) {
      if (_.isNumber(val)) {
        return val
      }

      return parseInt(val, 10)
    },
    slotEditOrderNumberFormatter(val) {
      if (_.isNumber(val)) {
        return val
      }

      return parseInt(val, 10)
    },
    slotDetailsModalClosed() {
      this.$store.dispatch('clearMissionSlotDetails')
      this.$store.dispatch('clearMissionSlotRegistrations')
    },
    slotCreateModalClosed() {
      this.$store.dispatch('clearMissionSlotCreate')
    },
    slotRegisterModalClosed() {
      this.$store.dispatch('clearMissionSlotRegister')
    },
    slotUnregisterModalClosed() {
      this.$store.dispatch('clearMissionSlotUnregister')
    },
    slotDetailsRegister() {
      this.$refs.slotDetailsModal.hide()
      this.$store.dispatch('showMissionSlotRegister', this.slotDetails)
    },
    slotDetailsUnregister() {
      this.$refs.slotDetailsModal.hide()
      this.$store.dispatch('showMissionSlotUnregister', this.slotDetails)
    },
    slotDetailsDelete() {
      this.$refs.slotDetailsModal.hide()
      this.$store.dispatch('showMissionSlotDeletion', this.slotDetails)
    },
    slotDetailsEdit() {
      this.$refs.slotDetailsModal.hide()
      this.$refs.slotEditModal.show()
    },
    hideSlotDetailsModal() {
      this.$refs.slotDetailsModal.hide()
    },
    hideSlotRegisterModal() {
      this.$refs.slotRegisterModal.hide()
    },
    submitSlotRegistration() {
      this.$refs.slotRegisterModal.hide()
      this.$store.dispatch('registerForMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.slotDetails.uid,
        slotOrderNumber: this.slotDetails.orderNumber,
        slotTitle: this.slotDetails.title,
        comment: this.slotRegistrationComment
      })
    },
    clearSlotRegistrationComment() {
      this.slotRegistrationComment = null
    },
    hideSlotDeletionModal() {
      this.$refs.slotDeletionModal.hide()
    },
    slotDeletionModalClosed() {
      this.$store.dispatch('clearMissionSlotDeletion')
    },
    submitSlotDeletion() {
      this.$refs.slotDeletionModal.hide()
      this.$store.dispatch('deleteMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.slotDetails.uid,
        slotOrderNumber: this.slotDetails.orderNumber,
        slotTitle: this.slotDetails.title
      })
    },
    showMissionDeletionModal() {
      this.$refs.missionDeletionModal.show()
    },
    hideMissionDeletionModal() {
      this.$refs.missionDeletionModal.hide()
    },
    submitMissionDeletion() {
      this.$refs.missionDeletionModal.hide()
      this.$store.dispatch('deleteMission', {
        missionSlug: this.$route.params.missionSlug,
        missionTitle: this.missionDetails.title
      })
    },
    populateMissionEditModal() {
      this.missionEditTitle = this.missionDetails.title
      this.missionEditShortDescription = this.missionDetails.shortDescription
      this.missionEditDescription = this.missionDetails.description
      this.missionEditSlottingTime = this.missionDetails.slottingTime
      this.missionEditStartTime = this.missionDetails.startTime
      this.missionEditEndTime = this.missionDetails.endTime
      this.missionEditBriefingTime = this.missionDetails.briefingTime
      this.missionEditRepositoryUrl = this.missionDetails.repositoryUrl
      this.missionEditTechSupport = this.missionDetails.techSupport
      this.missionEditRules = this.missionDetails.rules
      this.missionEditVisibility = this.missionDetails.visibility
    },
    showMissionEditModal() {
      this.$refs.missionEditModal.show()
    },
    hideMissionEditModal() {
      this.$refs.missionEditModal.hide()
    },
    submitMissionEdit() {
      this.$refs.missionEditModal.hide()

      const localMissionDetails = {
        title: this.missionEditTitle,
        shortDescription: this.missionEditShortDescription,
        description: this.missionEditDescription,
        slottingTime: this.missionEditSlottingTime,
        startTime: this.missionEditStartTime,
        endTime: this.missionEditEndTime,
        briefingTime: this.missionEditBriefingTime,
        repositoryUrl: this.missionEditRepositoryUrl,
        techSupport: this.missionEditTechSupport,
        rules: this.missionEditRules,
        visibility: this.missionEditVisibility
      }

      if (_.isEmpty(localMissionDetails.repositoryUrl)) {
        localMissionDetails.repositoryUrl = null
      }
      if (_.isEmpty(localMissionDetails.techSupport)) {
        localMissionDetails.techSupport = null
      }
      if (_.isEmpty(localMissionDetails.rules)) {
        localMissionDetails.rules = null
      }

      const updatedMissionDetails = {}
      _.each(localMissionDetails, (value, key) => {
        if (!_.isEqual(value, this.missionDetails[key])) {
          updatedMissionDetails[key] = value
        }
      })

      this.$store.dispatch('editMission', {
        missionSlug: this.$route.params.missionSlug,
        missionTitle: this.missionDetails.title,
        updatedMissionDetails
      })
    },
    showMissionSlotUnregisterModal() {
      this.$refs.missionSlotUnregisterModal.show()
    },
    hideMissionSlotUnregisterModal() {
      this.$refs.missionSlotUnregisterModal.hide()
    },
    submitMissionSlotUnregister() {
      this.$refs.missionSlotUnregisterModal.hide()
      this.$store.dispatch('unregisterFromMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.slotDetails.uid,
        slotOrderNumber: this.slotDetails.orderNumber,
        slotTitle: this.slotDetails.title,
        registrationUid: this.slotDetails.registrationUid
      })
    },
    populateSlotEditModal() {
      this.slotEditOrderNumber = this.slotDetails.orderNumber
      this.slotEditTitle = this.slotDetails.title
      this.slotEditDifficulty = this.slotDetails.difficulty
      this.slotEditShortDescription = this.slotDetails.shortDescription
      this.slotEditDescription = this.slotDetails.description
      this.slotEditRestricted = this.slotDetails.restricted
      this.slotEditReserve = this.slotDetails.reserve
    },
    hideSlotEditModal() {
      this.$refs.slotEditModal.hide()
    },
    submitSlotEdit() {
      this.$refs.slotEditModal.hide()

      const localSlotDetails = {
        orderNumber: this.slotEditOrderNumber,
        title: this.slotEditTitle,
        difficulty: this.slotEditDifficulty,
        shortDescription: this.slotEditShortDescription,
        description: this.slotEditDescription,
        restricted: this.slotEditRestricted,
        reserve: this.slotEditReserve
      }

      if (_.isEmpty(localSlotDetails.shortDescription)) {
        localSlotDetails.shortDescription = null
      }
      if (_.isEmpty(localSlotDetails.description)) {
        localSlotDetails.description = null
      }
      if (_.isString(localSlotDetails.orderNumber)) {
        localSlotDetails.orderNumber = parseInt(localSlotDetails.orderNumber, 10)
      }
      if (_.isString(localSlotDetails.difficulty)) {
        localSlotDetails.difficulty = parseInt(localSlotDetails.difficulty, 10)
      }

      const updatedSlotDetails = {}
      _.each(localSlotDetails, (value, key) => {
        if (!_.isEqual(value, this.slotDetails[key])) {
          updatedSlotDetails[key] = value
        }
      })

      this.$store.dispatch('editMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.slotDetails.uid,
        slotOrderNumber: this.slotDetails.orderNumber,
        slotTitle: this.slotDetails.title,
        updatedSlotDetails
      })
    },
    clearSlotCreateModal() {
      this.slotCreateOrderNumber = null
      this.slotCreateTitle = null
      this.slotCreateDifficulty = null
      this.slotCreateShortDescription = null
      this.slotCreateDescription = null
      this.slotCreateRestricted = false
      this.slotCreateReserve = false
    },
    hideSlotCreateModal() {
      this.$refs.slotCreateModal.hide()
    },
    submitSlotCreate() {
      this.$refs.slotCreateModal.hide()

      const slotDetails = {
        orderNumber: this.slotCreateOrderNumber,
        title: this.slotCreateTitle,
        difficulty: this.slotCreateDifficulty,
        shortDescription: this.slotCreateShortDescription,
        description: this.slotCreateDescription,
        restricted: this.slotCreateRestricted,
        reserve: this.slotCreateReserve
      }

      if (_.isEmpty(slotDetails.shortDescription)) {
        slotDetails.shortDescription = null
      }
      if (_.isEmpty(slotDetails.description)) {
        slotDetails.description = null
      }
      if (_.isString(slotDetails.orderNumber)) {
        slotDetails.orderNumber = parseInt(slotDetails.orderNumber, 10)
      }
      if (_.isString(slotDetails.difficulty)) {
        slotDetails.difficulty = parseInt(slotDetails.difficulty, 10)
      }

      this.$store.dispatch('createMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotDetails
      })
    },
    slotRegistrationConfirmationModalClosed() {
      this.$store.dispatch('clearMissionSlotRegistrationConfirmation')
    },
    submitRegistrationConfirmation() {
      this.$store.dispatch('modifyMissionSlotRegistration', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.registrationDetails.slotUid,
        registrationUid: this.registrationDetails.uid,
        confirm: this.registrationAssign
      })

      this.$refs.slotRegistrationConfirmationModal.hide()
    },
    hideSlotRegistrationConfirmationModal() {
      this.$refs.slotRegistrationConfirmationModal.hide()
    }
  },
  watch: {
    showSlotDetails(val) {
      if (val) {
        this.$store.dispatch('getMissionSlotRegistrations', {
          missionSlug: this.$route.params.missionSlug,
          slotUid: this.slotDetails.uid,
          slotOrderNumber: this.slotDetails.orderNumber,
          slotTitle: this.slotDetails.title
        })

        this.$refs.slotDetailsModal.show()
      }
    },
    showSlotCreate(val) {
      if (val) {
        this.$refs.slotCreateModal.show()
      }
    },
    showSlotRegister(val) {
      if (val) {
        this.$refs.slotRegisterModal.show()
      }
    },
    showSlotDeletion(val) {
      if (val) {
        this.$refs.slotDeletionModal.show()
      }
    },
    showSlotUnregister(val) {
      if (val) {
        this.$refs.missionSlotUnregisterModal.show()
      }
    },
    showSlotRegistrationConfirmation(val) {
      if (val) {
        this.$refs.slotRegistrationConfirmationModal.show()
      }
    },
    missionSlotlistFilter(val) {
      this.$store.dispatch('filterMissionSlotlist', val)
    }
  },
  beforeCreate: function() {
    this.$store.dispatch('getMissionDetails', { missionSlug: this.$route.params.missionSlug })
    this.$store.dispatch('getMissionSlotlist', { missionSlug: this.$route.params.missionSlug })
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMissionDetails')
  }
}
</script>

<style>
.ql-container .ql-editor {
  min-height: 25em;
  padding-bottom: 1em;
  max-height: 25em;
}

.html {
  overflow-y: auto;
  border-top: none;
}
</style>
