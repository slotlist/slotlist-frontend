<template>
  <div>
    <b-modal id="missionEditModal" ref="missionEditModal" size="lg" v-if="missionDetails" :title="$t('mission.modal.edit')" @shown="setMissionData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMission">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" :state="missionEditTitleState" :feedback="missionEditTitleFeedback">
                <b-form-input v-model="missionEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.shortDescription')" :state="missionEditShortDescriptionState" :feedback="missionEditShortDescriptionFeedback">
                <b-form-input v-model="missionEditData.shortDescription" textarea required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.description')" :state="missionEditDescriptionState" :feedback="missionEditDescriptionFeedback">
                <quill-editor v-model="missionEditData.description" ref="missionEditDescriptionEditor" :options="missionEditDescriptionQuillEditorOptions" required></quill-editor>
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
              <b-form-fieldset :label="$t('mission.repositoryUrl.optional')" :state="missionEditRepositoryUrlState" :feedback="missionEditRepositoryUrlFeedback">
                <b-form-input v-model="missionEditData.repositoryUrl" type="text"></b-form-input>
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
        description: null,
        endTime: null,
        repositoryUrl: null,
        rules: null,
        shortDescription: null,
        slottingTime: null,
        startTime: null,
        techSupport: null,
        title: null,
        visibility: null
      },
      missionEditDescriptionQuillEditorOptions: {
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
    isMissionEditRepositoryUrlValidUrl() {
      // Taken from: https://stackoverflow.com/a/5717133 @ 2017-08-04 09:43
      const urlPattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
      return urlPattern.test(this.missionEditData.repositoryUrl)
    },
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
    missionEditDescriptionFeedback() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? '' : this.$t('mission.feedback.description')
    },
    missionEditDescriptionState() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? 'success' : 'danger'
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
    missionEditRepositoryUrlFeedback() {
      if (_.isNil(this.missionEditData.repositoryUrl) || _.isEmpty(this.missionEditData.repositoryUrl)) {
        return ''
      }

      return this.isMissionEditRepositoryUrlValidUrl ? '' : this.$t('mission.feedback.repositoryUrl')
    },
    missionEditRepositoryUrlState() {
      if (_.isNil(this.missionEditData.repositoryUrl) || _.isEmpty(this.missionEditData.repositoryUrl)) {
        return 'success'
      }

      return this.isMissionEditRepositoryUrlValidUrl ? 'success' : 'danger'
    },
    missionEditShortDescriptionFeedback() {
      return _.isString(this.missionEditData.shortDescription) && !_.isEmpty(this.missionEditData.shortDescription) ? '' : this.$t('mission.feedback.shortDescription')
    },
    missionEditShortDescriptionState() {
      return _.isString(this.missionEditData.shortDescription) && !_.isEmpty(this.missionEditData.shortDescription) ? 'success' : 'danger'
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
        description: this.missionDetails.description,
        endTime: moment(this.missionDetails.endTime).format('Y-MM-DD HH:mm'),
        repositoryUrl: this.missionDetails.repositoryUrl,
        rules: this.missionDetails.rules,
        shortDescription: this.missionDetails.shortDescription,
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
