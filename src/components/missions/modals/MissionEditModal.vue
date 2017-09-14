<template>
  <div>
    <b-modal id="missionEditModal" ref="missionEditModal" size="lg" v-if="missionDetails" :title="$t('mission.modal.edit')" @shown="setMissionData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMission">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" :state="missionEditTitleState" :feedback="missionEditTitleFeedback">
                <b-form-input v-model="missionEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.description')" :state="missionEditdescriptionState" :feedback="missionEditdescriptionFeedback">
                <b-form-input v-model="missionEditData.description" textarea required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.detailedDescription')" :state="missionEditDetailedDescriptionState" :feedback="missionEditDetailedDescriptionFeedback">
                <quill-editor v-model="missionEditData.detailedDescription" ref="missionEditDetailedDescriptionEditor" :options="missionEditDetailedDescriptionQuillEditorOptions" required></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slottingTime')" :state="missionEditSlottingTimeState" :feedback="missionEditSlottingTimeFeedback">
                <b-form-input v-model="missionEditData.slottingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.startTime')" :state="missionEditStartTimeState" :feedback="missionEditStartTimeFeedback">
                <b-form-input v-model="missionEditData.startTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.endTime')" :state="missionEditEndTimeState" :feedback="missionEditEndTimeFeedback">
                <b-form-input v-model="missionEditData.endTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.briefingTime')" :state="missionEditBriefingTimeState" :feedback="missionEditBriefingTimeFeedback">
                <b-form-input v-model="missionEditData.briefingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.repositoryUrl.optional')" state="success" :description="$t('mission.repositoryUrl.description')">
                <quill-editor v-model="missionEditData.repositoryUrl" ref="missionEditrepositoryUrlEditor" :options="missionEditQuillEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.techSupport.optional')" state="success">
                <quill-editor v-model="missionEditData.techSupport" ref="missionEditTechSupportEditor" :options="missionEditQuillEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.rules.optional')" state="success">
                <quill-editor v-model="missionEditData.rules" ref="missionEditRulesEditor" :options="missionEditQuillEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.visibility')" state="success">
                <b-form-select v-model="missionEditData.visibility" :options="missionEditVisibilityOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission edit actions">
          <b-btn variant="success" @click="editMission">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

export default {
  data() {
    return {
      missionEditData: {
        briefingTime: null,
        detailedDescription: null,
        endTime: null,
        repositoryUrl: null,
        rules: null,
        description: null,
        slottingTime: null,
        startTime: null,
        techSupport: null,
        title: null,
        visibility: null
      },
      missionEditDetailedDescriptionQuillEditorOptions: {
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
      missionEditQuillEditorOptions: {
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
      }
    }
  },
  computed: {
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionEditBriefingTimeFeedback() {
      return _.isString(this.missionEditData.briefingTime)
        && !_.isEmpty(this.missionEditData.briefingTime)
        && moment(this.missionEditData.briefingTime).isValid ? '' : this.$t('mission.feedback.dateTime')
    },
    missionEditBriefingTimeState() {
      return _.isString(this.missionEditData.briefingTime)
        && !_.isEmpty(this.missionEditData.briefingTime)
        && moment(this.missionEditData.briefingTime).isValid ? 'success' : 'danger'
    },
    missionEditDetailedDescriptionFeedback() {
      return _.isString(this.missionEditData.detailedDescription) && !_.isEmpty(this.missionEditData.detailedDescription) ? '' : this.$t('mission.feedback.detailedDescription')
    },
    missionEditDetailedDescriptionState() {
      return _.isString(this.missionEditData.detailedDescription) && !_.isEmpty(this.missionEditData.detailedDescription) ? 'success' : 'danger'
    },
    missionEditEndTimeFeedback() {
      return _.isString(this.missionEditData.endTime)
        && !_.isEmpty(this.missionEditData.endTime)
        && moment(this.missionEditData.endTime).isValid ? '' : this.$t('mission.feedback.dateTime')
    },
    missionEditEndTimeState() {
      return _.isString(this.missionEditData.endTime)
        && !_.isEmpty(this.missionEditData.endTime)
        && moment(this.missionEditData.endTime).isValid ? 'success' : 'danger'
    },
    missionEditdescriptionFeedback() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? '' : this.$t('mission.feedback.description')
    },
    missionEditdescriptionState() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? 'success' : 'danger'
    },
    missionEditSlottingTimeFeedback() {
      return _.isString(this.missionEditData.slottingTime)
        && !_.isEmpty(this.missionEditData.slottingTime)
        && moment(this.missionEditData.slottingTime).isValid ? '' : this.$t('mission.feedback.dateTime')
    },
    missionEditSlottingTimeState() {
      return _.isString(this.missionEditData.slottingTime)
        && !_.isEmpty(this.missionEditData.slottingTime)
        && moment(this.missionEditData.slottingTime).isValid ? 'success' : 'danger'
    },
    missionEditStartTimeFeedback() {
      return _.isString(this.missionEditData.startTime)
        && !_.isEmpty(this.missionEditData.startTime)
        && moment(this.missionEditData.startTime).isValid ? '' : this.$t('mission.feedback.dateTime')
    },
    missionEditStartTimeState() {
      return _.isString(this.missionEditData.startTime)
        && !_.isEmpty(this.missionEditData.startTime)
        && moment(this.missionEditData.startTime).isValid ? 'success' : 'danger'
    },
    missionEditTitleFeedback() {
      return _.isString(this.missionEditData.title) && !_.isEmpty(this.missionEditData.title) ? '' : this.$t('mission.feedback.title')
    },
    missionEditTitleState() {
      return _.isString(this.missionEditData.title) && !_.isEmpty(this.missionEditData.title) ? 'success' : 'danger'
    },
    missionEditVisibilityOptions() {
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
    },
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    editMission() {
      if (_.isEmpty(this.missionEditData.title)) {
        return
      }

      if (_.isString(this.missionEditData.repositoryUrl) && _.isEmpty(this.missionEditData.repositoryUrl)) {
        this.missionEditData.repositoryUrl = null
      }
      if (_.isString(this.missionEditData.rules) && _.isEmpty(this.missionEditData.rules)) {
        this.missionEditData.rules = null
      }
      if (_.isString(this.missionEditData.techSupport) && _.isEmpty(this.missionEditData.techSupport)) {
        this.missionEditData.techSupport = null
      }

      const updatedMissionDetails = {}
      _.each(this.missionEditData, (value, key) => {
        if (!_.isEqual(value, this.missionDetails[key])) {
          if (key.toLowerCase().indexOf("time") !== -1) {
            value = moment(value).utc().format()
          }
          updatedMissionDetails[key] = value
        }
      })

      this.hideMissionEditModal()

      if (_.isEmpty(_.keys(updatedMissionDetails))) {
        return
      }

      this.$store.dispatch('editMission', {
        missionSlug: this.$route.params.missionSlug,
        updatedMissionDetails: updatedMissionDetails,
        missionTitle: this.missionDetails.title
      })
    },
    hideMissionEditModal() {
      this.$refs.missionEditModal.hide()
    },
    missionEditTimeFormatter(val) {
      return moment(val).format('Y-MM-DD HH:mm')
    },
    setMissionData() {
      this.missionEditData = {
        briefingTime: moment(this.missionDetails.briefingTime).format('Y-MM-DD HH:mm'),
        detailedDescription: this.missionDetails.detailedDescription,
        endTime: moment(this.missionDetails.endTime).format('Y-MM-DD HH:mm'),
        repositoryUrl: this.missionDetails.repositoryUrl,
        rules: this.missionDetails.rules,
        description: this.missionDetails.description,
        slottingTime: moment(this.missionDetails.slottingTime).format('Y-MM-DD HH:mm'),
        startTime: moment(this.missionDetails.startTime).format('Y-MM-DD HH:mm'),
        techSupport: this.missionDetails.techSupport,
        title: this.missionDetails.title,
        visibility: this.missionDetails.visibility
      }
    }
  }
}
</script>
