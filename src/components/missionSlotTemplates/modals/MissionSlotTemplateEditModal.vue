<template>
  <div>
    <b-modal id="missionSlotTemplateEditModal" ref="missionSlotTemplateEditModal" v-if="missionSlotTemplateDetails" :title="$t('mission.slotTemplate.modal.edit')" @shown="setMissionSlotTemplateEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMissionSlotTemplate">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" :state="missionSlotTemplateEditTitleState" :feedback="missionSlotTemplateEditTitleFeedback" :description="$t('mission.slotTemplate.title.description')">
                <b-form-input v-model="missionSlotTemplateEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.visibility')" :state="missionSlotTemplateEditVisibilityState" :feedback="missionSlotTemplateEditVisibilityFeedback" :description="$t('mission.slotTemplate.visibility.description')">
                <b-form-select v-model="missionSlotTemplateEditData.visibility" :options="missionSlotTemplateEditVisibilityOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot template edit actions">
          <b-btn variant="success" @click="editMissionSlotTemplate">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotTemplateEditModal">
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
      missionSlotTemplateEditData: {
        title: null,
        visibility: null
      }
    }
  },
  computed: {
    missionSlotTemplateDetails() {
      return this.$store.getters.missionSlotTemplateDetails
    },
    missionSlotTemplateEditTitleFeedback() {
      return _.isString(this.missionSlotTemplateEditData.title) && !_.isEmpty(this.missionSlotTemplateEditData.title) ? '' : this.$t('mission.slotTemplate.feedback.title')
    },
    missionSlotTemplateEditTitleState() {
      return _.isString(this.missionSlotTemplateEditData.title) && !_.isEmpty(this.missionSlotTemplateEditData.title) ? 'success' : 'danger'
    },
    missionSlotTemplateEditVisibilityFeedback() {
      return _.isNil(this.missionSlotTemplateEditData.visibility) || _.isEmpty(this.missionSlotTemplateEditData.visibility) ? this.$t('mission.slotTemplate.feedback.visibility') : ''
    },
    missionSlotTemplateEditVisibilityState() {
      return _.isNil(this.missionSlotTemplateEditData.visibility) || _.isEmpty(this.missionSlotTemplateEditData.visibility) ? 'danger' : 'success'
    },
    missionSlotTemplateEditVisibilityOptions() {
      let options = [
        {
          text: this.$t('mission.slotTemplate.visibility.hidden'),
          value: 'hidden'
        },
        {
          text: this.$t('mission.slotTemplate.visibility.public'),
          value: 'public'
        }
      ]

      if (!_.isNil(this.user.community)) {
        options = [
          {
            text: this.$t('mission.slotTemplate.visibility.community'),
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
    editMissionSlotTemplate() {
      if (_.isEmpty(this.missionSlotTemplateEditData.title)) {
        return
      }

      const updatedMissionSlotTemplateDetails = {}
      _.each(this.missionSlotTemplateEditData, (value, key) => {
        if (!_.isEqual(value, this.missionSlotTemplateDetails[key])) {
          updatedMissionSlotTemplateDetails[key] = value
        }
      })

      this.hideMissionSlotTemplateEditModal()

      if (_.isEmpty(_.keys(updatedMissionSlotTemplateDetails))) {
        return
      }

      this.$store.dispatch('editMissionSlotTemplate', {
        missionSlotTemplateUid: this.$route.params.missionSlotTemplateUid,
        updatedMissionSlotTemplateDetails,
        missionSlotTemplateTitle: this.missionSlotTemplateDetails.title
      })
    },
    hideMissionSlotTemplateEditModal() {
      this.$refs.missionSlotTemplateEditModal.hide()
    },
    setMissionSlotTemplateEditData() {
      this.missionSlotTemplateEditData = {
        title: this.missionSlotTemplateDetails.title,
        visibility: this.missionSlotTemplateDetails.visibility
      }
    }
  }
}
</script>
