<template>
  <div>
    <div>
      <h3>{{ $t('mission.creator.title') }}</h3>
    </div>
    <div>
      <b-form @submit.stop.prevent="submitMissionCreate">
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.title')" :description="$t('mission.title.description')" :state="missionCreateTitleState" :feedback="missionCreateTitleFeedback">
              <b-form-input v-model="missionCreateTitle" type="text" required :formatter="missionCreateTitleFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.slug')" :description="$t('mission.slug.description')" :state="missionCreateSlugState" :feedback="missionCreateSlugFeedback">
              <b-input-group :right="missionCreateSlugAvailable">
                <b-form-input v-model="missionCreateSlug" type="text" required :formatter="missionCreateSlugFormatter" lazy-formatter></b-form-input>
              </b-input-group>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.description')" :description="$t('mission.description.description')" :state="missionCreatedescriptionState" :feedback="missionCreatedescriptionFeedback">
              <b-form-input v-model="missionCreatedescription" textarea required></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.detailedDescription')" :description="$t('mission.detailedDescription.description')" :state="missionCreateDetailedDescriptionState" :feedback="missionCreateDetailedDescriptionFeedback">
              <quill-editor v-model="missionCreateDetailedDescription" ref="missionCreateDetailedDescriptionEditor" :options="descriptionEditorOptions" required></quill-editor>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.slottingTime')" :description="$t('mission.slottingTime.description')" :state="missionCreateSlottingTimeState" :feedback="missionCreateSlottingTimeFeedback">
              <b-form-input v-model="missionCreateSlottingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.startTime')" :state="missionCreateStartTimeState" :feedback="missionCreateStartTimeFeedback">
              <b-form-input v-model="missionCreateStartTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.endTime')" :state="missionCreateEndTimeState" :feedback="missionCreateEndTimeFeedback">
              <b-form-input v-model="missionCreateEndTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.briefingTime')" :state="missionCreateBriefingTimeState" :feedback="missionCreateBriefingTimeFeedback">
              <b-form-input v-model="missionCreateBriefingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.repositoryUrl.optional')" state="success" :description="$t('mission.repositoryUrl.description')">
              <quill-editor v-model="missionCreateRepositoryUrl" ref="missionCreateRepositoryUrlEditor" :options="editorOptions"></quill-editor>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.techSupport.optional')" :state="missionCreateTechSupportState" :feedback="missionCreateTechSupportFeedback">
              <quill-editor v-model="missionCreateTechSupport" ref="missionCreateTechSupportEditor" :options="editorOptions"></quill-editor>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.rules.optional')" :state="missionCreateRulesState" :feedback="missionCreateRulesFeedback">
              <quill-editor v-model="missionCreateRules" ref="missionCreateRulesEditor" :options="editorOptions"></quill-editor>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col text-center" v-show="user.community">
            <b-form-fieldset :label="$t('mission.creator.addToCommunity')" :description="$t('mission.creator.addToCommunity.description')" :state="missionCreateAddToCommunityState" :feedback="missionCreateAddToCommunityFeedback">
              <b-form-checkbox v-model="missionCreateAddToCommunity"></b-form-checkbox>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.visibility')" :state="missionCreateVisibilityState" :feedback="missionCreateVisibilityFeedback">
              <b-form-select v-model="missionCreateVisibility" :options="missionCreateVisibilityOptions" class="mb-3" required></b-form-select>
            </b-form-fieldset>
          </div>
        </div>
      </b-form>
    </div>
    <div class="text-center">
      <b-btn variant="success" @click="submitMissionCreate">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import utils from '../utils'

export default {
  data() {
    return {
      descriptionEditorOptions: {
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': 1 }, { 'header': 2 }, { 'color': [] }],
            ['bold', 'italic'],
            [{ 'align': [] }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
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
      editorOptions: {
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
      missionCreateTitle: null,
      missionCreateSlug: null,
      missionCreatedescription: null,
      missionCreateDetailedDescription: null,
      missionCreateSlottingTime: null,
      missionCreateStartTime: null,
      missionCreateEndTime: null,
      missionCreateBriefingTime: null,
      missionCreateRepositoryUrl: null,
      missionCreateTechSupport: null,
      missionCreateRules: null,
      missionCreateAddToCommunity: true,
      missionCreateVisibility: 'hidden'
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    missionCreateTitleState() {
      return _.isNil(this.missionCreateTitle) || _.isEmpty(this.missionCreateTitle) ? 'danger' : 'success'
    },
    missionCreateTitleFeedback() {
      return _.isNil(this.missionCreateTitle) || _.isEmpty(this.missionCreateTitle) ? this.$t('mission.feedback.title') : ''
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
        return this.$t('mission.feedback.slug')
      } else if (this.checkingMissionSlugAvailability) {
        return this.$t('mission.feedback.slug.checking')
      } else if (!this.missionSlugAvailable) {
        return this.$t('mission.feedback.slug.notAvailable')
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
    missionCreatedescriptionState() {
      return _.isNil(this.missionCreatedescription) || _.isEmpty(this.missionCreatedescription) ? 'danger' : 'success'
    },
    missionCreatedescriptionFeedback() {
      return _.isNil(this.missionCreatedescription) || _.isEmpty(this.missionCreatedescription) ? this.$t('mission.feedback.description') : ''
    },
    missionCreateDetailedDescriptionState() {
      return _.isNil(this.missionCreateDetailedDescription) || _.isEmpty(this.missionCreateDetailedDescription) ? 'danger' : 'success'
    },
    missionCreateDetailedDescriptionFeedback() {
      return _.isNil(this.missionCreateDetailedDescription) || _.isEmpty(this.missionCreateDetailedDescription) ? this.$t('mission.feedback.detailedDescription') : ''
    },
    missionCreateSlottingTimeState() {
      return _.isNil(this.missionCreateSlottingTime) || _.isEmpty(this.missionCreateSlottingTime) || !moment(this.missionCreateSlottingTime).isValid() ? 'danger' : 'success'
    },
    missionCreateSlottingTimeFeedback() {
      return _.isNil(this.missionCreateSlottingTime) || _.isEmpty(this.missionCreateSlottingTime) || !moment(this.missionCreateSlottingTime).isValid() ? this.$t('mission.feedback.dateTime') : ''
    },
    missionCreateStartTimeState() {
      return _.isNil(this.missionCreateStartTime) || _.isEmpty(this.missionCreateStartTime) || !moment(this.missionCreateStartTime).isValid() ? 'danger' : 'success'
    },
    missionCreateStartTimeFeedback() {
      return _.isNil(this.missionCreateStartTime) || _.isEmpty(this.missionCreateStartTime) || !moment(this.missionCreateStartTime).isValid() ? this.$t('mission.feedback.dateTime') : ''
    },
    missionCreateEndTimeState() {
      return _.isNil(this.missionCreateEndTime) || _.isEmpty(this.missionCreateEndTime) || !moment(this.missionCreateEndTime).isValid() ? 'danger' : 'success'
    },
    missionCreateEndTimeFeedback() {
      return _.isNil(this.missionCreateEndTime) || _.isEmpty(this.missionCreateEndTime) || !moment(this.missionCreateEndTime).isValid() ? this.$t('mission.feedback.dateTime') : ''
    },
    missionCreateBriefingTimeState() {
      return _.isNil(this.missionCreateBriefingTime) || _.isEmpty(this.missionCreateBriefingTime) || !moment(this.missionCreateBriefingTime).isValid() ? 'danger' : 'success'
    },
    missionCreateBriefingTimeFeedback() {
      return _.isNil(this.missionCreateBriefingTime) || _.isEmpty(this.missionCreateBriefingTime) || !moment(this.missionCreateBriefingTime).isValid() ? this.$t('mission.feedback.dateTime') : ''
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
    },
    missionCreateVisibilityState() {
      return _.isNil(this.missionCreateVisibility) || _.isEmpty(this.missionCreateVisibility) ? 'danger' : 'success'
    },
    missionCreateVisibilityFeedback() {
      return _.isNil(this.missionCreateVisibility) || _.isEmpty(this.missionCreateVisibility) ? this.$t('mission.feedback.visibility') : ''
    },
    missionCreateVisibilityOptions() {
      let options = [
        {
          text: this.$t('mission.visibility.hidden'),
          value: 'hidden'
        },
        // Disabled for now since the backend doesn't fully support this setting yet
        /* {
          text: this.$t('mission.visibility.private'),
          value: 'private'
        }, */
        {
          text: this.$t('mission.visibility.public'),
          value: 'public'
        }
      ]

      if (!_.isNil(this.user.community)) {
        options = [
          {
            text: this.$t('mission.visibility.community'),
            value: 'community'
          },
          ...options
        ]
      }

      return options
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
        description: this.missionCreatedescription,
        detailedDescription: this.missionCreateDetailedDescription,
        slottingTime: moment(this.missionCreateSlottingTime).utc().format(),
        startTime: moment(this.missionCreateStartTime).utc().format(),
        endTime: moment(this.missionCreateEndTime).utc().format(),
        briefingTime: moment(this.missionCreateBriefingTime).utc().format(),
        repositoryUrl: this.missionCreateRepositoryUrl,
        techSupport: this.missionCreateTechSupport,
        rules: this.missionCreateRules,
        addToCommunity: this.missionCreateAddToCommunity,
        visibility: this.missionCreateVisibility
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
  created: function() {
    utils.setTitle(this.$t('mission.creator.title.browser'))
  }
}
</script>
