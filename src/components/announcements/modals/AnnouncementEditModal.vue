<template>
  <div>
    <b-modal id="announcementEditModal" ref="announcementEditModal" size="lg" v-if="announcementDetails" :title="$t('announcement.modal.edit')" @shown="setAnnouncementEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editAnnouncement">
          <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('announcement.title')" :state="announcementEditTitleState" :feedback="announcementEditTitleFeedback" :description="$t('announcement.title.description')">
              <b-form-input v-model="announcementEditData.title" type="text" required></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('announcement.content')" :state="announcementEditContentState" :feedback="announcementEditContentFeedback" :description="$t('announcement.content.description')">
              <quill-editor v-model="announcementEditData.content" ref="announcementEditContentEditor" :options="contentEditorOptions" required></quill-editor>
              <editor-explanation></editor-explanation>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('announcement.visibleFrom')" :state="announcementEditVisibleFromState" :feedback="announcementEditVisibleFromFeedback" :description="$t('announcement.visibleFrom.description')">
              <b-form-input v-model="announcementEditData.visibleFrom" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="announcementEditTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot edit actions">
          <b-btn variant="success" @click="editAnnouncement">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideAnnouncementEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  data() {
    return {
      announcementEditData: {
        content: null,
        title: null,
        visibleFrom: null
      },
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
  beforeDestroy: function() {
    this.$store.dispatch('clearAnnouncementDetails')
  },
  computed: {
    announcementDetails() {
      return this.$store.getters.announcementDetails
    },
    announcementEditContentFeedback() {
      return _.isNil(this.announcementEditData.content) || _.isEmpty(this.announcementEditData.content) ? this.$t('announcement.feedback.content') : ''
    },
    announcementEditContentState() {
      return _.isNil(this.announcementEditData.content) || _.isEmpty(this.announcementEditData.content) ? 'danger' : 'success'
    },
    announcementEditTitleFeedback() {
      return _.isString(this.announcementEditData.title) && !_.isEmpty(this.announcementEditData.title) ? '' : this.$t('announcement.feedback.title')
    },
    announcementEditTitleState() {
      return _.isString(this.announcementEditData.title) && !_.isEmpty(this.announcementEditData.title) ? 'success' : 'danger'
    },
    announcementEditVisibleFromFeedback() {
      if (_.isNil(this.announcementEditData.visibleFrom) || _.isEmpty(this.announcementEditData.visibleFrom)) {
        return ''
      }

      return moment(this.announcementEditData.visibleFrom).isValid() ? '' : this.$t('announcement.feedback.visibleFrom')
    },
    announcementEditVisibleFromState() {
      if (_.isNil(this.announcementEditData.visibleFrom) || _.isEmpty(this.announcementEditData.visibleFrom)) {
        return 'success'
      }

      return moment(this.announcementEditData.visibleFrom).isValid() ? 'success' : 'danger'
    }
  },
  methods: {
    announcementEditTimeFormatter(val) {
      if (_.isEmpty(val)) {
        return val
      }

      return moment(val).format('Y-MM-DD HH:mm')
    },
    editAnnouncement() {
      if (_.isEmpty(this.announcementEditData.content) || _.isEmpty(this.announcementEditData.title)) {
        return
      }

      if (_.isString(this.announcementEditData.visibleFrom) && _.isEmpty(this.announcementEditData.visibleFrom)) {
        this.announcementEditData.visibleFrom = null
      }

      const updatedAnnouncementDetails = {}
      _.each(this.announcementEditData, (value, key) => {
        if (!_.isEqual(value, this.announcementDetails[key])) {
          updatedAnnouncementDetails[key] = value
        }
      })

      this.hideAnnouncementEditModal()

      if (_.isEmpty(_.keys(updatedAnnouncementDetails))) {
        return
      }

      this.$store.dispatch('editAnnouncement', {
        announcementUid: this.announcementDetails.uid,
        updatedAnnouncementDetails: updatedAnnouncementDetails
      })
    },
    hideAnnouncementEditModal() {
      this.$refs.announcementEditModal.hide()
    },
    setAnnouncementEditData() {
      this.announcementEditData = {
        content: this.announcementDetails.content,
        title: this.announcementDetails.title,
        visibleFrom: _.isNil(this.announcementDetails.visibleFrom) ? null : moment(this.announcementDetails.visibleFrom).format('Y-MM-DD HH:mm')
      }
    }
  }
}
</script>
