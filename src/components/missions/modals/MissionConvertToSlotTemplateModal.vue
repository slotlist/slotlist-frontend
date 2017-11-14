<template>
  <div>
    <b-modal id="missionConvertToSlotTemplateModal" ref="missionConvertToSlotTemplateModal" :title="$t('mission.modal.convert.slotTemplate')" @shown="clearMissionConvertToSlotTemplateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="convertMissionToSlotTemplate">
          <div class="row">
            <div class="col">
              <p v-html="$t('mission.convert.slotTemplate.description')"></p>
            </div>
          </div>
          <hr class="my-4">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" :state="missionConvertToSlotTemplateTitleState" :feedback="missionConvertToSlotTemplateTitleFeedback" :description="$t('mission.slotTemplate.title.description')">
                <b-form-input v-model="missionConvertToSlotTemplateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.visibility')" state="success" :description="$t('mission.slotTemplate.visibility.description')">
                <b-form-select v-model="missionConvertToSlotTemplateData.visibility" :options="missionConvertToSlotTemplateVisibilityOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission convert to slot template actions">
          <b-btn variant="success" @click="convertMissionToSlotTemplate">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionConvertToSlotTemplateModal">
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
      missionConvertToSlotTemplateData: {
        title: null,
        visibility: 'hidden'
      }
    }
  },
  computed: {
    missionConvertToSlotTemplateTitleFeedback() {
      return _.isNil(this.missionConvertToSlotTemplateData.title) || _.isEmpty(this.missionConvertToSlotTemplateData.title) ? this.$t('mission.slotTemplate.feedback.title') : ''
    },
    missionConvertToSlotTemplateTitleState() {
      return _.isNil(this.missionConvertToSlotTemplateData.title) || _.isEmpty(this.missionConvertToSlotTemplateData.title) ? 'danger' : 'success'
    },
    missionConvertToSlotTemplateVisibilityOptions() {
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
    clearMissionConvertToSlotTemplateData() {
      this.missionConvertToSlotTemplateData = {
        title: null,
        visibility: 'hidden'
      }
    },
    convertMissionToSlotTemplate() {
      if (_.isEmpty(this.missionConvertToSlotTemplateData.title)) {
        return
      }

      const slotGroups = _.map(this.$store.getters.unfilteredMissionSlotGroups, (slotGroup) => {
        return {
          orderNumber: slotGroup.orderNumber,
          title: slotGroup.title,
          slots: _.map(slotGroup.slots, (slot) => {
            return {
              orderNumber: slot.orderNumber,
              title: slot.title,
              description: slot.description,
              detailedDescription: slot.detailedDescription,
              difficulty: slot.difficulty,
              reserve: slot.reserve,
              blocked: slot.blocked
            }
          })
        }
      });

      const payload = {
        title: this.missionConvertToSlotTemplateData.title,
        visibility: this.missionConvertToSlotTemplateData.visibility,
        slotGroups
      }

      this.hideMissionConvertToSlotTemplateModal()

      this.$store.dispatch('createMissionSlotTemplate', payload)
    },
    hideMissionConvertToSlotTemplateModal() {
      this.$refs.missionConvertToSlotTemplateModal.hide()
    }
  }
}
</script>
