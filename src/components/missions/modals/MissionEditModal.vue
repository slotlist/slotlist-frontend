<template>
  <div>
    <b-modal id="missionEditModal" ref="missionEditModal" size="lg" v-if="missionDetails" title="Edit mission" @shown="setMissionData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMission">
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Title" :state="missionEditTitleState" :feedback="missionEditTitleFeedback">
                <b-form-input v-model="missionEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Short description" :state="missionEditShortDescriptionState" :feedback="missionEditShortDescriptionFeedback">
                <b-form-input v-model="missionEditData.shortDescription" textarea required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Description" :state="missionEditDescriptionState" :feedback="missionEditDescriptionFeedback">
                <quill-editor v-model="missionEditData.description" ref="missionEditDescriptionEditor" :options="missionEditQuillEditorOptions" required></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Slotting time" :state="missionEditSlottingTimeState" :feedback="missionEditSlottingTimeFeedback">
                <b-form-input v-model="missionEditData.slottingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Start time" :state="missionEditStartTimeState" :feedback="missionEditStartTimeFeedback">
                <b-form-input v-model="missionEditData.startTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="End time" :state="missionEditEndTimeState" :feedback="missionEditEndTimeFeedback">
                <b-form-input v-model="missionEditData.endTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset label="Briefing time" :state="missionEditBriefingTimeState" :feedback="missionEditBriefingTimeFeedback">
                <b-form-input v-model="missionEditData.briefingTime" type="text" required placeholder="YYYY-MM-DD hh:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Repository URL <em>(optional)</em>" state="success">
                <b-form-input v-model="missionEditData.repositoryUrl" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Tech support <em>(optional)</em>" state="success">
                <quill-editor v-model="missionEditData.techSupport" ref="missionEditTechSupportEditor" :options="missionEditQuillEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Rules <em>(optional)</em>" state="success">
                <quill-editor v-model="missionEditData.rules" ref="missionEditRulesEditor" :options="missionEditQuillEditorOptions"></quill-editor>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Visibility" state="success">
                <b-form-select v-model="missionEditData.visibility" :options="missionEditVisibilityOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission edit actions">
          <b-btn variant="success" @click="editMission">
            <i class="fa fa-plus" aria-hidden="true"></i> Submit
          </b-btn>
          <b-btn @click="hideMissionEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> Cancel
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment'

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
      missionEditQuillEditorOptions: {
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
      missionEditDifficultyOptions: [
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
      ]
    }
  },
  computed: {
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionEditBriefingTimeFeedback() {
      return _.isString(this.missionEditData.briefingTime)
        && !_.isEmpty(this.missionEditData.briefingTime)
        && moment(this.missionEditData.briefingTime).isValid ? '' : 'Please enter a briefing time'
    },
    missionEditBriefingTimeState() {
      return _.isString(this.missionEditData.briefingTime)
        && !_.isEmpty(this.missionEditData.briefingTime)
        && moment(this.missionEditData.briefingTime).isValid ? 'success' : 'danger'
    },
    missionEditDescriptionFeedback() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? '' : 'Please enter a description'
    },
    missionEditDescriptionState() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? 'success' : 'danger'
    },
    missionEditEndTimeFeedback() {
      return _.isString(this.missionEditData.endTime)
        && !_.isEmpty(this.missionEditData.endTime)
        && moment(this.missionEditData.endTime).isValid ? '' : 'Please enter a briefing time'
    },
    missionEditEndTimeState() {
      return _.isString(this.missionEditData.endTime)
        && !_.isEmpty(this.missionEditData.endTime)
        && moment(this.missionEditData.endTime).isValid ? 'success' : 'danger'
    },
    missionEditShortDescriptionFeedback() {
      return _.isString(this.missionEditData.shortDescription) && !_.isEmpty(this.missionEditData.shortDescription) ? '' : 'Please enter a short description'
    },
    missionEditShortDescriptionState() {
      return _.isString(this.missionEditData.shortDescription) && !_.isEmpty(this.missionEditData.shortDescription) ? 'success' : 'danger'
    },
    missionEditSlottingTimeFeedback() {
      return _.isString(this.missionEditData.slottingTime)
        && !_.isEmpty(this.missionEditData.slottingTime)
        && moment(this.missionEditData.slottingTime).isValid ? '' : 'Please enter a slotting time'
    },
    missionEditSlottingTimeState() {
      return _.isString(this.missionEditData.slottingTime)
        && !_.isEmpty(this.missionEditData.slottingTime)
        && moment(this.missionEditData.slottingTime).isValid ? 'success' : 'danger'
    },
    missionEditStartTimeFeedback() {
      return _.isString(this.missionEditData.startTime)
        && !_.isEmpty(this.missionEditData.startTime)
        && moment(this.missionEditData.startTime).isValid ? '' : 'Please enter a start time'
    },
    missionEditStartTimeState() {
      return _.isString(this.missionEditData.startTime)
        && !_.isEmpty(this.missionEditData.startTime)
        && moment(this.missionEditData.startTime).isValid ? 'success' : 'danger'
    },
    missionEditTitleFeedback() {
      return _.isString(this.missionEditData.title) && !_.isEmpty(this.missionEditData.title) ? '' : 'Please enter a mission title'
    },
    missionEditTitleState() {
      return _.isString(this.missionEditData.title) && !_.isEmpty(this.missionEditData.title) ? 'success' : 'danger'
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
        briefingTime: this.missionDetails.briefingTime,
        description: this.missionDetails.description,
        endTime: this.missionDetails.endTime,
        repositoryUrl: this.missionDetails.repositoryUrl,
        rules: this.missionDetails.rules,
        shortDescription: this.missionDetails.shortDescription,
        slottingTime: this.missionDetails.slottingTime,
        startTime: this.missionDetails.startTime,
        techSupport: this.missionDetails.techSupport,
        title: this.missionDetails.title,
        visibility: this.missionDetails.visibility
      }
    }
  }
}
</script>
