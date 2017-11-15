<template>
  <div>
    <b-modal id="missionDuplicateModal" ref="missionDuplicateModal" v-if="missionDetails" :title="$t('mission.modal.duplicate')" @shown="clearMissionData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="duplicateMission">
          <div class="row">
            <div class="col">
              <p v-html="$t('mission.duplicate.description')"></p>
            </div>
          </div>
          <hr class="my-4">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slug')" :state="missionDuplicateSlugState" :feedback="missionDuplicateSlugFeedback" :description="$t('mission.duplicate.slug.description')">
                <b-input-group :right="missionDuplicateSlugAvailable">
                  <b-form-input v-model="missionDuplicateData.slug" type="text" required :formatter="missionDuplicateSlugFormatter" lazy-formatter></b-form-input>
                </b-input-group>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" state="success" :description="$t('mission.duplicate.title.description')">
                <b-form-input v-model="missionDuplicateData.title" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slottingTime')" :state="missionDuplicateSlottingTimeState" :feedback="missionDuplicateSlottingTimeFeedback" :description="$t('mission.duplicate.slottingTime.description')">
                <b-form-input v-model="missionDuplicateData.slottingTime" type="text" placeholder="YYYY-MM-DD HH:mm" :formatter="missionDuplicateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.startTime')" :state="missionDuplicateStartTimeState" :feedback="missionDuplicateStartTimeFeedback" :description="$t('mission.duplicate.startTime.description')">
                <b-form-input v-model="missionDuplicateData.startTime" type="text" placeholder="YYYY-MM-DD HH:mm" :formatter="missionDuplicateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.endTime')" :state="missionDuplicateEndTimeState" :feedback="missionDuplicateEndTimeFeedback" :description="$t('mission.duplicate.endTime.description')">
                <b-form-input v-model="missionDuplicateData.endTime" type="text" placeholder="YYYY-MM-DD HH:mm" :formatter="missionDuplicateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.briefingTime')" :state="missionDuplicateBriefingTimeState" :feedback="missionDuplicateBriefingTimeFeedback" :description="$t('mission.duplicate.briefingTime.description')">
                <b-form-input v-model="missionDuplicateData.briefingTime" type="text" placeholder="YYYY-MM-DD HH:mm" :formatter="missionDuplicateTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.visibility')" state="success" :description="$t('mission.duplicate.visibility.description')">
                <b-form-select v-model="missionDuplicateData.visibility" :options="missionDuplicateVisibilityOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col text-center" v-if="user.community">
              <b-form-fieldset :label="$t('mission.creator.addToCommunity')" state="success" :description="missionDuplicateAddToCommunityDescription">
                <b-form-checkbox v-model="missionDuplicateData.addToCommunity"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission duplicate actions">
          <b-btn variant="success" @click="duplicateMission">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionDuplicateModal">
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
      missionDuplicateData: {
        addToCommunity: true,
        briefingTime: null,
        endTime: null,
        slottingTime: null,
        slug: null,
        startTime: null,
        title: null,
        visibility: 'hidden'
      }
    }
  },
  computed: {
    checkingMissionSlugAvailability() {
      return this.$store.getters.checkingMissionSlugAvailability
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionDuplicateAddToCommunityDescription() {
      return this.$t('mission.creator.addToCommunity.description', { communityInfo: `[${this.user.community.tag}] ${this.user.community.name}` })
    },
    missionDuplicateBriefingTimeFeedback() {
      if (_.isNil(this.missionDuplicateData.briefingTime) || _.isEmpty(this.missionDuplicateData.briefingTime)) {
        return ''
      }

      const briefingTime = moment(this.missionDuplicateData.briefingTime)
      if (!briefingTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      return ''
    },
    missionDuplicateBriefingTimeState() {
      if (_.isNil(this.missionDuplicateData.briefingTime) || _.isEmpty(this.missionDuplicateData.briefingTime)) {
        return 'success'
      }

      const briefingTime = moment(this.missionDuplicateData.briefingTime)
      if (!briefingTime.isValid()) {
        return 'danger'
      }

      return 'success'
    },
    missionDuplicateEndTimeFeedback() {
      if (_.isNil(this.missionDuplicateData.endTime) || _.isEmpty(this.missionDuplicateData.endTime)) {
        return ''
      }

      const endTime = moment(this.missionDuplicateData.endTime)
      if (!endTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      const startTime = moment(this.missionDuplicateData.startTime)
      if (!startTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      if (endTime < startTime) {
        return this.$t('mission.feedback.dateTime.afterStart')
      }

      return ''
    },
    missionDuplicateEndTimeState() {
      if (_.isNil(this.missionDuplicateData.endTime) || _.isEmpty(this.missionDuplicateData.endTime)) {
        return 'success'
      }

      const endTime = moment(this.missionDuplicateData.endTime)
      if (!endTime.isValid()) {
        return 'danger'
      }

      const startTime = moment(this.missionDuplicateData.startTime)
      if (!startTime.isValid()) {
        return 'danger'
      }

      if (endTime < startTime) {
        return 'danger'
      }

      return 'success'
    },
    missionDuplicateSlottingTimeFeedback() {
      if (_.isNil(this.missionDuplicateData.slottingTime) || _.isEmpty(this.missionDuplicateData.slottingTime)) {
        return ''
      }

      const slottingTime = moment(this.missionDuplicateData.slottingTime)
      if (!slottingTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      return ''
    },
    missionDuplicateSlottingTimeState() {
      if (_.isNil(this.missionDuplicateData.slottingTime) || _.isEmpty(this.missionDuplicateData.slottingTime)) {
        return 'success'
      }

      const slottingTime = moment(this.missionDuplicateData.slottingTime)
      if (!slottingTime.isValid()) {
        return 'danger'
      }

      return 'success'
    },
    missionDuplicateSlugAvailable() {
      if (this.checkingMissionSlugAvailability) {
        return '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>'
      } else if (this.missionSlugAvailable) {
        return '<i class="fa fa-check" aria-hidden="true"></i>'
      }

      return '<i class="fa fa-close" aria-hidden="true"></i>'
    },
    missionDuplicateSlugFeedback() {
      if (_.isNil(this.missionDuplicateData.slug) || _.isEmpty(this.missionDuplicateData.slug)) {
        return this.$t('mission.feedback.slug')
      } else if (this.checkingMissionSlugAvailability) {
        return this.$t('mission.feedback.slug.checking')
      } else if (!this.missionSlugAvailable) {
        return this.$t('mission.feedback.slug.notAvailable')
      }

      return ''
    },
    missionDuplicateSlugState() {
      if (_.isNil(this.missionDuplicateData.slug) || _.isEmpty(this.missionDuplicateData.slug)) {
        return 'danger'
      } else if (this.checkingMissionSlugAvailability) {
        return 'warning'
      } else if (!this.missionSlugAvailable) {
        return 'danger'
      }

      return 'success'
    },
    missionDuplicateStartTimeFeedback() {
      if (_.isNil(this.missionDuplicateData.startTime) || _.isEmpty(this.missionDuplicateData.startTime)) {
        return ''
      }

      const startTime = moment(this.missionDuplicateData.startTime)
      if (!startTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      const slottingTime = moment(this.missionDuplicateData.slottingTime)
      if (!slottingTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      if (startTime < slottingTime) {
        return this.$t('mission.feedback.dateTime.afterSlotting')
      }

      return ''
    },
    missionDuplicateStartTimeState() {
      if (_.isNil(this.missionDuplicateData.startTime) || _.isEmpty(this.missionDuplicateData.startTime)) {
        return 'success'
      }

      const startTime = moment(this.missionDuplicateData.startTime)
      if (!startTime.isValid()) {
        return 'danger'
      }

      const slottingTime = moment(this.missionDuplicateData.slottingTime)
      if (!slottingTime.isValid()) {
        return 'danger'
      }

      if (startTime < slottingTime) {
        return 'danger'
      }

      return 'success'
    },
    missionDuplicateVisibilityOptions() {
      let options = [
        {
          text: this.$t('mission.visibility.hidden'),
          value: 'hidden'
        },
        {
          text: this.$t('mission.visibility.private'),
          value: 'private'
        },
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
    missionSlugAvailable() {
      return this.$store.getters.missionSlugAvailable
    },
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    clearMissionData() {
      this.missionDuplicateData = {
        addToCommunity: true,
        briefingTime: null,
        endTime: null,
        slottingTime: null,
        slug: null,
        startTime: null,
        title: null,
        visibility: 'hidden'
      }
    },
    missionDuplicateSlugFormatter(val) {
      if (!_.isNil(this.missionDuplicateData.slug) && !_.isEmpty(this.missionDuplicateData.slug)) {
        this.$store.dispatch('checkMissionSlugAvailability', this.missionDuplicateData.slug)
      }

      return val
    },
    duplicateMission() {
      if (_.isEmpty(this.missionDuplicateData.slug)) {
        return
      }

      const missionDuplicatePayload = {
        addToCommunity: this.missionDuplicateData.addToCommunity,
        slug: this.missionDuplicateData.slug,
        visibility: this.missionDuplicateData.visibility
      }

      const updatedBriefingTime = moment(this.missionDuplicateData.briefingTime)
      if (updatedBriefingTime.isValid()) {
        missionDuplicatePayload.briefingTime = updatedBriefingTime.utc().format()
      }
      const updatedEndTime = moment(this.missionDuplicateData.endTime)
      if (updatedEndTime.isValid()) {
        missionDuplicatePayload.endTime = updatedEndTime.utc().format()
      }
      const updatedSlottingTime = moment(this.missionDuplicateData.slottingTime)
      if (updatedSlottingTime.isValid()) {
        missionDuplicatePayload.slottingTime = updatedSlottingTime.utc().format()
      }
      const updatedStartTime = moment(this.missionDuplicateData.startTime)
      if (updatedStartTime.isValid()) {
        missionDuplicatePayload.startTime = updatedStartTime.utc().format()
      }

      if (_.isString(this.missionDuplicateData.title) && !_.isEmpty(this.missionDuplicateData.title)) {
        missionDuplicatePayload.title = this.missionDuplicateData.title
      }

      this.hideMissionDuplicateModal()

      this.$store.dispatch('duplicateMission', {
        missionSlug: this.$route.params.missionSlug,
        missionDuplicatePayload
      })
    },
    hideMissionDuplicateModal() {
      this.$refs.missionDuplicateModal.hide()
    },
    missionDuplicateTimeFormatter(val) {
      return moment(val).format('Y-MM-DD HH:mm')
    }
  }
}
</script>
