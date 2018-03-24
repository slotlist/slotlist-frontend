<template>
  <div>
    <div>
      <h3>{{ $t('announcement.creator.title') }}</h3>
    </div>
    <div>
      <b-form @submit.stop.prevent="createAnnouncement">
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('announcement.title')" :state="announcementCreateTitleState" :feedback="announcementCreateTitleFeedback" :description="$t('announcement.title.description')">
              <b-form-input v-model="announcementCreateData.title" type="text" required></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('announcement.content')" :state="announcementCreateContentState" :feedback="announcementCreateContentFeedback" :description="$t('announcement.content.description')">
              <quill-editor v-model="announcementCreateData.content" ref="announcementCreateContentEditor" :options="contentEditorOptions" required></quill-editor>
              <editor-explanation></editor-explanation>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('announcement.visibleFrom')" :state="announcementCreateVisibleFromState" :feedback="announcementCreateVisibleFromFeedback" :description="$t('announcement.visibleFrom.description')">
              <b-form-input v-model="announcementCreateData.visibleFrom" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="announcementCreateTimeFormatter" @blur="announcementCreateTimeBlur" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('announcement.announcementType')" state="success" :description="$t('announcement.announcementType.description')">
              <b-form-select v-model="announcementCreateData.announcementType" :options="announcementCreateAnnouncementTypeOptions" class="mb-3" required></b-form-select>
            </b-form-fieldset>
          </div>
          <div class="col text-center">
            <b-form-fieldset :label="$t('announcement.sendNotifications')" state="success" :description="$t('announcement.sendNotifications.description')">
              <b-form-checkbox v-model="announcementCreateData.sendNotifications"></b-form-checkbox>
            </b-form-fieldset>
          </div>
        </div>
      </b-form>
    </div>
    <div class="text-center">
      <b-btn variant="success" @click="createAnnouncement">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.announcement') }}
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
      announcementCreateData: {
        content: null,
        sendNotifications: true,
        title: null,
        announcementType: 'generic',
        visibleFrom: null
      },
      announcementCreateAnnouncementTypeOptions: [
        {
          text: this.$t('announcement.announcementType.generic'),
          value: 'generic'
        },
        {
          text: this.$t('announcement.announcementType.update'),
          value: 'update'
        }
      ],
      contentEditorOptions: {
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
          }
        },
        theme: 'snow'
      }
    }
  },
  created: function() {
    utils.setTitle(this.$t('announcement.creator.title.browser'))
  },
  computed: {
    announcementCreateContentFeedback() {
      return _.isNil(this.announcementCreateData.content) || _.isEmpty(this.announcementCreateData.content) ? this.$t('announcement.feedback.content') : ''
    },
    announcementCreateContentState() {
      return _.isNil(this.announcementCreateData.content) || _.isEmpty(this.announcementCreateData.content) ? 'danger' : 'success'
    },
    announcementCreateTitleFeedback() {
      return _.isNil(this.announcementCreateData.title) || _.isEmpty(this.announcementCreateData.title) ? this.$t('announcement.feedback.title') : ''
    },
    announcementCreateTitleState() {
      return _.isNil(this.announcementCreateData.title) || _.isEmpty(this.announcementCreateData.title) ? 'danger' : 'success'
    },
    announcementCreateVisibleFromFeedback() {
      if (_.isNil(this.announcementCreateData.visibleFrom) || _.isEmpty(this.announcementCreateData.visibleFrom)) {
        return ''
      }

      return moment(this.announcementCreateData.visibleFrom).isValid() ? '' : this.$t('announcement.feedback.visibleFrom')
    },
    announcementCreateVisibleFromState() {
      if (_.isNil(this.announcementCreateData.visibleFrom) || _.isEmpty(this.announcementCreateData.visibleFrom)) {
        return 'success'
      }

      return moment(this.announcementCreateData.visibleFrom).isValid() ? 'success' : 'danger'
    }
  },
  methods: {
    announcementCreateTimeBlur() {
      if (_.isEmpty(this.announcementCreateData.visibleFrom)) {
        return
      }

      if (moment(this.announcementCreateData.visibleFrom).isAfter(moment())) {
        this.announcementCreateData.sendNotifications = false
      }
    },
    announcementCreateTimeFormatter(val) {
      if (_.isEmpty(val)) {
        return val
      }

      return moment(val).format('Y-MM-DD HH:mm')
    },
    createAnnouncement() {
      if (_.isEmpty(this.announcementCreateData.content) || _.isEmpty(this.announcementCreateData.title)) {
        return
      }

      if (_.isEmpty(this.announcementCreateData.visibleFrom)) {
        this.announcementCreateData.visibleFrom = null
      }

      this.$store.dispatch('createAnnouncement', { announcementDetails: this.announcementCreateData })
    }
  }
}
</script>
