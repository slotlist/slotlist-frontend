<template>
  <div>
    <div v-if="loaded">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">by</span>
          <router-link :to="{name: 'userDetails', params: {userUid: missionDetails.creator.uid}}">{{ missionDetails.creator.nickname }}</router-link>
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
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>Briefing
              <span class="text-muted">(ldrsp.)</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.briefingTime) }}</p>
          </div>
          <div class="col">
            <h5>Repository URL</h5>
            <p v-html="optionalRepositoryUrl"></p>
          </div>
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
      <div class="card" v-if="slotlistLoaded">
        <div class="card-block text-nowrap">
          <h1>Slotlist</h1>
          <mission-slotlist></mission-slotlist>
        </div>
      </div>
    </div>
    <b-modal ref="slotDetailsModal" id="slotDetailsModal" @hide="slotDetailsModalClosed">
      <div slot="modal-title">
        <h5>Slot details - #{{ slotDetails.orderNumber + 1 }} {{ slotDetails.title }}</h5>
      </div>
      <div class="container-fluid">
        <div class="row font-weight-bold">
          <div class="col col-1">#</div>
          <div class="col col-3">Role</div>
          <div class="col col-5">Player</div>
          <div class="col col-3">Difficulty</div>
        </div>
        <div class="row">
          <div class="col col-1">{{ slotDetails.orderNumber + 1 }}</div>
          <div class="col col-3">{{ slotDetails.title }} </div>
          <div class="col col-5" v-html="optionalAssignee"></div>
          <div class="col col-3">
            <i :class="difficultyIcon" aria-hidden="true"></i>
            <span :class="difficultyColor">{{ difficultyText }}</span>
          </div>
        </div>
        <div class="row font-weight-bold">
          <div class="col col-1"></div>
          <div class="col col-6">Description</div>
          <div class="col col-5">Status</div>
        </div>
        <div class="row">
          <div class="col col-1"></div>
          <div class="col col-6">{{ slotDetails.shortDescription}}</div>
          <div class="col col-5" v-html="slotStatus"></div>
        </div>
        <hr class="my-4" v-show="slotDetails.description">
        <div class="row font-weight-bold" v-show="slotDetails.description">
          <div class="col col-12">Detailed description</div>
        </div>
        <div class="row" v-show="slotDetails.description">
          <div class="col col-12" v-html="slotDetails.description"></div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot detail actions">
          <button type="button" class="btn btn-success" v-show="loggedIn && !slotDetails.registrationUid" :disabled="slotDetails.assignee" @click="slotDetailsRegister">
            <i class="fa fa-check-square-o" aria-hidden="true"></i> Register
          </button>
          <button type="button" class="btn btn-warning" v-show="loggedIn && slotDetails.registrationUid" @click="slotDetailsUnregister">
            <i class="fa fa-eraser" aria-hidden="true"></i> Unregister
          </button>
          <button type="button" class="btn btn-danger" v-if="isMissionEditor" @click="slotDetailsDelete">
            <i class="fa fa-trash" aria-hidden="true"></i> Delete
          </button>
          <button type="button" class="btn btn-secondary" @click="hideSlotDetailsModal">
            <i class="fa fa-times" aria-hidden="true"></i> Close</button>
        </div>
      </div>
    </b-modal>
    <b-modal ref="slotRegisterModal" id="slotRegisterModal" @shown="clearSlotRegistrationComment" @hide="slotRegisterModalClosed">
      <div slot="modal-title">
        <h5>Register for slot #{{ slotDetails.orderNumber + 1 }} {{ slotDetails.title }}</h5>
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">Confirm registration as
            <span class="font-weight-bold">{{ slotDetails.title }}</span>?</div>
        </div>
        <hr class="my-4">
        <div class="row">
          <div class="col col-12">
            <form @submit.stop.prevent="submitSlotRegistration">
              <b-form-input type="text" placeholder="Optional comment to the mission creator" v-model="slotRegistrationComment"></b-form-input>
            </form>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot register actions">
          <button type="button" class="btn btn-success" @click="submitSlotRegistration" :disabled="slotDetails.assignee">
            <i class="fa fa-check" aria-hidden="true"></i> Confirm
          </button>
          <button type="button" class="btn btn-secondary" @click="hideSlotRegisterModal">
            <i class="fa fa-times" aria-hidden="true"></i> Cancel
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal ref="slotDeletionModal" id="slotDeletionModal" @hide="slotDeletionModalClosed">
      <div slot="modal-title">
        <h5>Deletion of slot #{{ slotDetails.orderNumber + 1 }} {{ slotDetails.title }}</h5>
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">Confirm deletion of slot
            <span class="font-weight-bold">#{{ slotDetails.orderNumber + 1}} {{ slotDetails.title }}</span>?</div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot deletion actions">
          <button type="button" class="btn btn-danger" @click="submitSlotDeletion">
            <i class="fa fa-trash" aria-hidden="true"></i> Delete slot
          </button>
          <button type="button" class="btn btn-secondary" @click="hideSlotDeletionModal">
            <i class="fa fa-times" aria-hidden="true"></i> Cancel
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal ref="missionDeletionModal" id="missionDeletionModal">
      <div slot="modal-title">
        <h5>Deletion of mission</h5>
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">Confirm deletion of
            <span class="font-weight-bold">{{ missionDetails.title }}</span> mission?
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission deletion actions">
          <button type="button" class="btn btn-danger" @click="submitMissionDeletion">
            <i class="fa fa-trash" aria-hidden="true"></i> Delete mission
          </button>
          <button type="button" class="btn btn-secondary" @click="hideMissionDeletionModal">
            <i class="fa fa-times" aria-hidden="true"></i> Cancel
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
                <quill-editor class="ql-editor-large" v-model="missionEditDescription" ref="missionEditDescriptionEditor" :options="editorOptions" required></quill-editor>
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
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission edit actions">
          <button type="button" class="btn btn-success" @click="submitMissionEdit">
            <i class="fa fa-edit" aria-hidden="true"></i> Submit changes
          </button>
          <button type="button" class="btn btn-secondary" @click="hideMissionEditModal">
            <i class="fa fa-times" aria-hidden="true"></i> Cancel
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal ref="missionSlotUnregisterModal" id="missionSlotUnregisterModal" @hide="slotUnregisterModalClosed">
      <div slot="modal-title">
        <h5>Unregister from slot #{{ slotDetails.orderNumber + 1 }} {{ slotDetails.title }}</h5>
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">Confirm removal of registration for slot
            <span class="font-weight-bold">{{ slotDetails.title }}</span>?
          </div>
        </div>
        <div class="row" v-show="slotDetails.assignee && slotDetails.assignee.uid === user.uid">
          <div class="col-12">This will also remove you as the assignee of the slot.</div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot unregister actions">
          <button type="button" class="btn btn-warning" @click="submitMissionSlotUnregister">
            <i class="fa fa-eraser" aria-hidden="true"></i> Delete registration
          </button>
          <button type="button" class="btn btn-secondary" @click="hideMissionSlotUnregisterModal">
            <i class="fa fa-times" aria-hidden="true"></i> Cancel
          </button>
        </div>
      </div>
    </b-modal>
    <div v-if="!loaded || !slotlistLoaded">
      <loading-overlay message="Loading Mission details and slotlist..."></loading-overlay>
    </div>
    <div v-if="registeringForSlot">
      <loading-overlay message="Registering for Mission slot..."></loading-overlay>
    </div>
    <div v-if="unregisteringFromSlot">
      <loading-overlay message="Unregistering from Mission slot..."></loading-overlay>
    </div>
    <div v-if="deletingSlot">
      <loading-overlay message="Deleting Mission slot..."></loading-overlay>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionSlotlist from 'components/MissionSlotlist.vue'
import utils from '../utils'

export default {
  components: {
    MissionSlotlist
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
      missionEditRules: null
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
    deletingSlot() {
      return this.$store.getters.deletingMissionSlot
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
    showSlotRegister() {
      return this.$store.getters.showMissionSlotRegister
    },
    showSlotDeletion() {
      return this.$store.getters.showMissionSlotDeletion
    },
    showSlotUnregister() {
      return this.$store.getters.showMissionSlotUnregister
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
      return _.isNil(this.missionEditTitle) || _.isEmpty(this.missionEditTitle) ? 'warning' : 'success'
    },
    missionEditTitleFeedback() {
      return _.isNil(this.missionEditTitle) || _.isEmpty(this.missionEditTitle) ? 'Please enter a title' : ''
    },
    missionEditShortDescriptionState() {
      return _.isNil(this.missionEditShortDescription) || _.isEmpty(this.missionEditShortDescription) ? 'warning' : 'success'
    },
    missionEditShortDescriptionFeedback() {
      return _.isNil(this.missionEditShortDescription) || _.isEmpty(this.missionEditShortDescription) ? 'Please enter a short (plain text) description' : ''
    },
    missionEditDescriptionState() {
      return _.isNil(this.missionEditDescription) || _.isEmpty(this.missionEditDescription) ? 'warning' : 'success'
    },
    missionEditDescriptionFeedback() {
      return _.isNil(this.missionEditDescription) || _.isEmpty(this.missionEditDescription) ? 'Please enter a description' : ''
    },
    missionEditSlottingTimeState() {
      return _.isNil(this.missionEditSlottingTime) || _.isEmpty(this.missionEditSlottingTime) ? 'warning' : 'success'
    },
    missionEditSlottingTimeFeedback() {
      return _.isNil(this.missionEditSlottingTime) || _.isEmpty(this.missionEditSlottingTime) ? 'Please enter a slotting date & time' : ''
    },
    missionEditStartTimeState() {
      return _.isNil(this.missionEditStartTime) || _.isEmpty(this.missionEditStartTime) ? 'warning' : 'success'
    },
    missionEditStartTimeFeedback() {
      return _.isNil(this.missionEditStartTime) || _.isEmpty(this.missionEditStartTime) ? 'Please enter a start date & time' : ''
    },
    missionEditEndTimeState() {
      return _.isNil(this.missionEditEndTime) || _.isEmpty(this.missionEditEndTime) ? 'warning' : 'success'
    },
    missionEditEndTimeFeedback() {
      return _.isNil(this.missionEditEndTime) || _.isEmpty(this.missionEditEndTime) ? 'Please enter an (est.) end date & time' : ''
    },
    missionEditBriefingTimeState() {
      return _.isNil(this.missionEditBriefingTime) || _.isEmpty(this.missionEditBriefingTime) ? 'warning' : 'success'
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
    }
  },
  methods: {
    slotDetailsModalClosed() {
      this.$store.dispatch('clearMissionSlotDetails')
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
        rules: this.missionEditRules
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
  },
  watch: {
    showSlotDetails(val) {
      if (val) {
        this.$refs.slotDetailsModal.show()
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
  },
  beforeCreate: function () {
    this.$store.dispatch('getMissionDetails', this.$route.params.missionSlug)
    this.$store.dispatch('getMissionSlotlist', this.$route.params.missionSlug)
    this.$store.dispatch('clearMissionSlotDetails')
    this.$store.dispatch('clearMissionSlotRegister')
    this.$store.dispatch('clearMissionSlotUnregister')
  },
  created: function () {
    utils.setTitle('Mission')
  },
  beforeDestroy: function () {
    this.$store.dispatch('clearMissionDetails')
    this.$store.dispatch('clearMissionSlotlist')
    this.$store.dispatch('clearMissionSlotDetails')
    this.$store.dispatch('clearMissionSlotRegister')
    this.$store.dispatch('clearMissionSlotUnregister')
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
