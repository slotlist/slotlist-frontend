<template>
  <div>
    <b-modal id="missionSlotTemplateDuplicateModal" ref="missionSlotTemplateDuplicateModal" v-if="missionSlotTemplateDetails" :title="$t('mission.slotTemplate.modal.duplicate')" @shown="clearMissionSlotTemplateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="duplicateMissionSlotTemplate">
          <div class="row">
            <div class="col">
              <p v-html="$t('mission.slotTemplate.duplicate.description')"></p>
            </div>
          </div>
          <hr class="my-4">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" state="success" :description="$t('mission.slotTemplate.duplicate.title.description')">
                <b-form-input v-model="missionSlotTemplateDuplicateData.title" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.visibility')" state="success" :description="$t('mission.slotTemplate.duplicate.visibility.description')">
                <b-form-select v-model="missionSlotTemplateDuplicateData.visibility" :options="missionSlotTemplateDuplicateVisibilityOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot template duplicate actions">
          <b-btn variant="success" @click="duplicateMissionSlotTemplate">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotTemplateDuplicateModal">
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
      missionSlotTemplateDuplicateData: {
        title: null,
        visibility: 'hidden'
      }
    }
  },
  computed: {
    missionSlotTemplateDetails() {
      return this.$store.getters.missionSlotTemplateDetails
    },
    missionSlotTemplateDuplicateVisibilityOptions() {
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
    clearMissionSlotTemplateData() {
      this.missionSlotTemplateDuplicateData = {
        title: null,
        visibility: 'hidden'
      }
    },
    duplicateMissionSlotTemplate() {
      const missionSlotTemplateDuplicatePayload = {
        visibility: this.missionSlotTemplateDuplicateData.visibility,
        slotGroups: _.clone(this.missionSlotTemplateDetails.slotGroups)
      }

      if (_.isString(this.missionSlotTemplateDuplicateData.title) && !_.isEmpty(this.missionSlotTemplateDuplicateData.title)) {
        missionSlotTemplateDuplicatePayload.title = this.missionSlotTemplateDuplicateData.title
      } else {
        missionSlotTemplateDuplicatePayload.title = this.missionSlotTemplateDetails.title
      }

      this.hideMissionSlotTemplateDuplicateModal()

      this.$store.dispatch('createMissionSlotTemplate', missionSlotTemplateDuplicatePayload)
    },
    hideMissionSlotTemplateDuplicateModal() {
      this.$refs.missionSlotTemplateDuplicateModal.hide()
    }
  }
}
</script>
