<template>
  <div>
    <!-- Begin of content -->
    <div>
      <div>
        <h3>Create new mission</h3>
      </div>
      <div>
        <b-form @submit.stop.prevent="submitMissionCreate">
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Title" :state="missionCreateTitleState" :feedback="missionCreateTitleFeedback" description="Title of the mission, displayed in mission list and details">
                <b-form-input v-model="missionCreateTitle" type="text" required :formatter="missionCreateTitleFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Slug" :state="missionCreateSlugState" :feedback="missionCreateSlugFeedback" description="Slug to use for mission URL, must be unique">
                <b-input-group :right="missionCreateSlugAvailable">
                  <b-form-input v-model="missionCreateSlug" type="text" required :formatter="missionCreateSlugFormatter" lazy-formatter></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Short description" :state="missionCreateShortDescriptionState" :feedback="missionCreateShortDescriptionFeedback" description="Short (plaintext) description of the mission, providing a quick summary for the mission list">
                <b-form-input v-model="missionCreateShortDescription" textarea required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Description" :state="missionCreateDescriptionState" :feedback="missionCreateDescriptionFeedback" description="Detailed description of mission story, scenario, plot, tasks, etc. Everything your players should know before choosing to participate">
                <quill-editor v-model="missionCreateDescription" ref="missionCreateDescriptionEditor" :options="editorOptions" required></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Slotting time" :state="missionCreateSlottingTimeState" :feedback="missionCreateSlottingTimeFeedback" description="Date and time the missions slotting starts at">
                <b-form-input v-model="missionCreateSlottingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Start time" :state="missionCreateStartTimeState" :feedback="missionCreateStartTimeFeedback">
                <b-form-input v-model="missionCreateStartTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="End time" :state="missionCreateEndTimeState" :feedback="missionCreateEndTimeFeedback">
                <b-form-input v-model="missionCreateEndTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Briefing time" :state="missionCreateBriefingTimeState" :feedback="missionCreateBriefingTimeFeedback">
                <b-form-input v-model="missionCreateBriefingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Repository URL <em>(optional)</em>" :state="missionCreateRepositoryUrlState" :feedback="missionCreateRepositoryUrlFeedback">
                <b-form-input v-model="missionCreateRepositoryUrl" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Tech support <em>(optional)</em>" :state="missionCreateTechSupportState" :feedback="missionCreateTechSupportFeedback">
                <quill-editor v-model="missionCreateTechSupport" ref="missionCreateTechSupportEditor" :options="editorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Rules <em>(optional)</em>" :state="missionCreateRulesState" :feedback="missionCreateRulesFeedback">
                <quill-editor v-model="missionCreateRules" ref="missionCreateRulesEditor" :options="editorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row" v-show="user.community">
            <div class="col text-center">
              <b-form-fieldset label="Add mission to community?" :state="missionCreateAddToCommunityState" :feedback="missionCreateAddToCommunityFeedback" description="Adding a mission to your community makes it visible in the community's mission list">
                <b-form-checkbox v-model="missionCreateAddToCommunity"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div class="text-center">
        <button type="button" class="btn btn-success" @click="submitMissionCreate">
          <i class="fa fa-plus" aria-hidden="true"></i> Create mission
        </button>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
    </div>
    <!-- End of modals -->
    <!-- Beging of overlays -->
    <div>
      <div v-show="creatingMission">
        <loading-overlay message="Creating Mission..."></loading-overlay>
      </div>
    </div>
    <!-- End of overlays -->
  </div>
</template>

<script>
import moment from 'moment'
import utils from '../utils'

export default {
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
      missionCreateTitle: null,
      missionCreateSlug: null,
      missionCreateShortDescription: null,
      missionCreateDescription: null,
      missionCreateSlottingTime: null,
      missionCreateStartTime: null,
      missionCreateEndTime: null,
      missionCreateBriefingTime: null,
      missionCreateRepositoryUrl: null,
      missionCreateTechSupport: null,
      missionCreateRules: null,
      missionCreateAddToCommunity: true
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    creatingMission() {
      return this.$store.getters.creatingMission
    },
    missionCreateTitleState() {
      return _.isNil(this.missionCreateTitle) || _.isEmpty(this.missionCreateTitle) ? 'danger' : 'success'
    },
    missionCreateTitleFeedback() {
      return _.isNil(this.missionCreateTitle) || _.isEmpty(this.missionCreateTitle) ? 'Enter a title' : ''
    },
    missionCreateSlugState() {
      if (_.isNil(this.missionCreateSlug) || _.isEmpty(this.missionCreateSlug)) {
        return 'danger'
      } else if (this.checkingMissionSlugAvailability) {
        return 'warning'
      } else if (!this.missionSlugAvailable) {
        return 'danger'
      }

      return 'success'
    },
    missionCreateSlugFeedback() {
      if (_.isNil(this.missionCreateSlug) || _.isEmpty(this.missionCreateSlug)) {
        return 'Enter a slug'
      } else if (this.checkingMissionSlugAvailability) {
        return '<em>Checking mission slug availability...</em>'
      } else if (!this.missionSlugAvailable) {
        return 'Mission slug not available'
      }

      return ''
    },
    missionCreateSlugAvailable() {
      if (this.checkingMissionSlugAvailability) {
        return '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>'
      } else if (this.missionSlugAvailable) {
        return '<i class="fa fa-check" aria-hidden="true"></i>'
      }

      return '<i class="fa fa-close" aria-hidden="true"></i>'
    },
    checkingMissionSlugAvailability() {
      return this.$store.getters.checkingMissionSlugAvailability
    },
    missionSlugAvailable() {
      return this.$store.getters.missionSlugAvailable
    },
    missionCreateShortDescriptionState() {
      return _.isNil(this.missionCreateShortDescription) || _.isEmpty(this.missionCreateShortDescription) ? 'danger' : 'success'
    },
    missionCreateShortDescriptionFeedback() {
      return _.isNil(this.missionCreateShortDescription) || _.isEmpty(this.missionCreateShortDescription) ? 'Enter a short description' : ''
    },
    missionCreateDescriptionState() {
      return _.isNil(this.missionCreateDescription) || _.isEmpty(this.missionCreateDescription) ? 'danger' : 'success'
    },
    missionCreateDescriptionFeedback() {
      return _.isNil(this.missionCreateDescription) || _.isEmpty(this.missionCreateDescription) ? 'Enter a description' : ''
    },
    missionCreateSlottingTimeState() {
      return _.isNil(this.missionCreateSlottingTime) || _.isEmpty(this.missionCreateSlottingTime) || !moment(this.missionCreateSlottingTime).isValid() ? 'danger' : 'success'
    },
    missionCreateSlottingTimeFeedback() {
      return _.isNil(this.missionCreateSlottingTime) || _.isEmpty(this.missionCreateSlottingTime) || !moment(this.missionCreateSlottingTime).isValid() ? 'Enter a slotting time' : ''
    },
    missionCreateStartTimeState() {
      return _.isNil(this.missionCreateStartTime) || _.isEmpty(this.missionCreateStartTime) || !moment(this.missionCreateStartTime).isValid() ? 'danger' : 'success'
    },
    missionCreateStartTimeFeedback() {
      return _.isNil(this.missionCreateStartTime) || _.isEmpty(this.missionCreateStartTime) || !moment(this.missionCreateStartTime).isValid() ? 'Enter a start time' : ''
    },
    missionCreateEndTimeState() {
      return _.isNil(this.missionCreateEndTime) || _.isEmpty(this.missionCreateEndTime) || !moment(this.missionCreateEndTime).isValid() ? 'danger' : 'success'
    },
    missionCreateEndTimeFeedback() {
      return _.isNil(this.missionCreateEndTime) || _.isEmpty(this.missionCreateEndTime) || !moment(this.missionCreateEndTime).isValid() ? 'Enter an end time' : ''
    },
    missionCreateBriefingTimeState() {
      return _.isNil(this.missionCreateBriefingTime) || _.isEmpty(this.missionCreateBriefingTime) || !moment(this.missionCreateBriefingTime).isValid() ? 'danger' : 'success'
    },
    missionCreateBriefingTimeFeedback() {
      return _.isNil(this.missionCreateBriefingTime) || _.isEmpty(this.missionCreateBriefingTime) || !moment(this.missionCreateBriefingTime).isValid() ? 'Enter a briefing time' : ''
    },
    missionCreateRepositoryUrlState() {
      return 'success'
    },
    missionCreateRepositoryUrlFeedback() {
      return ''
    },
    missionCreateTechSupportState() {
      return 'success'
    },
    missionCreateTechSupportFeedback() {
      return ''
    },
    missionCreateRulesState() {
      return 'success'
    },
    missionCreateRulesFeedback() {
      return ''
    },
    missionCreateAddToCommunityState() {
      return 'success'
    },
    missionCreateAddToCommunityFeedback() {
      return ''
    }
  },
  methods: {
    missionCreateTitleFormatter(val) {
      if (_.isNil(this.missionCreateSlug) || _.isEmpty(this.missionCreateSlug)) {
        this.missionCreateSlug = utils.slug(val)
        this.$store.dispatch('checkMissionSlugAvailability', this.missionCreateSlug)
      }
      return val
    },
    missionCreateSlugFormatter(val) {
      if (!_.isNil(this.missionCreateSlug) && !_.isEmpty(this.missionCreateSlug)) {
        this.$store.dispatch('checkMissionSlugAvailability', this.missionCreateSlug)
      }

      return val
    },
    missionCreateTimeFormatter(val) {
      return moment(val).format('Y-MM-DD HH:mm')
    },
    submitMissionCreate() {
      const missionDetails = {
        title: this.missionCreateTitle,
        slug: this.missionCreateSlug,
        shortDescription: this.missionCreateShortDescription,
        description: this.missionCreateDescription,
        slottingTime: this.missionCreateSlottingTime,
        startTime: this.missionCreateStartTime,
        endTime: this.missionCreateEndTime,
        briefingTime: this.missionCreateBriefingTime,
        repositoryUrl: this.missionCreateRepositoryUrl,
        techSupport: this.missionCreateTechSupport,
        rules: this.missionCreateRules,
        addToCommunity: this.missionCreateAddToCommunity
      }

      if (_.isEmpty(missionDetails.repositoryUrl)) {
        missionDetails.repositoryUrl = null
      }
      if (_.isEmpty(missionDetails.techSupport)) {
        missionDetails.techSupport = null
      }
      if (_.isEmpty(missionDetails.rules)) {
        missionDetails.rules = null
      }

      this.$store.dispatch('createMission', missionDetails)
    }
  },
  created: function () {
    utils.setTitle('Mission Creator')
  }
}
</script>
