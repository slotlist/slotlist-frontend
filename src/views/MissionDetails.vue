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
      <mission-slot-create-modal></mission-slot-create-modal>
      <mission-slot-details-modal></mission-slot-details-modal>
      <mission-slot-edit-modal></mission-slot-edit-modal>
      <mission-slot-group-create-modal></mission-slot-group-create-modal>
      <mission-slot-registration-modal></mission-slot-registration-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionSlotCreateModal from 'components/missions/modals/MissionSlotCreateModal.vue'
import MissionSlotDetailsModal from 'components/missions/modals/MissionSlotDetailsModal.vue'
import MissionSlotEditModal from 'components/missions/modals/MissionSlotEditModal.vue'
import MissionSlotGroupCreateModal from 'components/missions/modals/MissionSlotGroupCreateModal.vue'
import MissionSlotlist from 'components/missions/MissionSlotlist.vue'
import MissionSlotRegistrationModal from 'components/missions/modals/MissionSlotRegistrationModal.vue'
import utils from '../utils'

export default {
  components: {
    MissionSlotCreateModal,
    MissionSlotDetailsModal,
    MissionSlotEditModal,
    MissionSlotGroupCreateModal,
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
      missionSlotlistFilter: []
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    user() {
      return this.$store.getters.user
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
    slotDetails() {
      return this.$store.getters.missionSlotDetails
    }
  },
  methods: {
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
