<template>
  <div>
    <div>
      <h3>{{ $t('mission.slotTemplate.creator.title') }}</h3>
    </div>
    <div>
      <b-form @submit.stop.prevent="createMissionSlotTemplate">
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.title')" :state="missionSlotTemplateCreateTitleState" :feedback="missionSlotTemplateCreateTitleFeedback" :description="$t('mission.slotTemplate.title.description')">
              <b-form-input v-model="missionSlotTemplateCreateData.title" type="text" required></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.visibility')" :state="missionSlotTemplateCreateVisibilityState" :feedback="missionSlotTemplateCreateVisibilityFeedback" :description="$t('mission.slotTemplate.visibility.description')">
              <b-form-select v-model="missionSlotTemplateCreateData.visibility" :options="missionSlotTemplateCreateVisibilityOptions" class="mb-3" required></b-form-select>
            </b-form-fieldset>
          </div>
        </div>
      </b-form>
    </div>
    <div class="text-center">
      <b-btn variant="success" @click="createMissionSlotTemplate">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slot.template') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function() {
    utils.setTitle(this.$t('mission.slotTemplate.creator.title.browser'))
  },
  data() {
    return {
      missionSlotTemplateCreateData: {
        title: null,
        visibility: 'hidden'
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    missionSlotTemplateCreateTitleFeedback() {
      return _.isNil(this.missionSlotTemplateCreateData.title) || _.isEmpty(this.missionSlotTemplateCreateData.title) ? this.$t('mission.slotTemplate.feedback.title') : ''
    },
    missionSlotTemplateCreateTitleState() {
      return _.isNil(this.missionSlotTemplateCreateData.title) || _.isEmpty(this.missionSlotTemplateCreateData.title) ? 'danger' : 'success'
    },
    missionSlotTemplateCreateVisibilityState() {
      return _.isNil(this.missionSlotTemplateCreateData.visibility) || _.isEmpty(this.missionSlotTemplateCreateData.visibility) ? 'danger' : 'success'
    },
    missionSlotTemplateCreateVisibilityFeedback() {
      return _.isNil(this.missionSlotTemplateCreateData.visibility) || _.isEmpty(this.missionSlotTemplateCreateData.visibility) ? this.$t('mission.slotTemplate.feedback.visibility') : ''
    },
    missionSlotTemplateCreateVisibilityOptions() {
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
    }
  },
  methods: {
    createMissionSlotTemplate() {
      if (_.isEmpty(this.missionSlotTemplateCreateData.title)) {
        return
      }

      const missionSlotTemplateDetails = {
        title: this.missionSlotTemplateCreateData.title,
        visibility: this.missionSlotTemplateCreateData.visibility,
        slotGroups: []
      }

      this.$store.dispatch('createMissionSlotTemplate', missionSlotTemplateDetails)
    }
  }
}
</script>
