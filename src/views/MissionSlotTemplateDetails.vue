<template>
  <div>
    <!-- Begin of content -->
    <div v-if="missionSlotTemplateDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionSlotTemplateDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">{{ $t('mission.by') }}</span>
          <router-link :to="{name: 'userDetails', params: {userUid: missionSlotTemplateDetails.creator.uid}}">{{ formatUserWithTag(missionSlotTemplateDetails.creator) }}</router-link>
        </h5>
        <hr class="my-4">
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.visibility') }}</h5>
            <p v-html="formattedMissionSlotTemplateVisibility"></p>
          </div>
        </div>
        <br v-if="loggedIn">
        <div class="row justify-content-center" v-if="loggedIn">
          <b-btn variant="primary" v-if="isMissionSlotTemplateCreator" v-b-modal.missionSlotTemplateEditModal>
            <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
          </b-btn>&nbsp;
          <b-btn variant="secondary" v-if="loggedIn" v-b-modal.missionSlotTemplateDuplicateModal>
            <i class="fa fa-files-o" aria-hidden="true"></i> {{ $t('button.duplicate.mission.slotTemplate') }}
          </b-btn>&nbsp;
          <click-confirm v-if="isMissionSlotTemplateCreator" yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.slotTemplate.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
            <b-btn variant="danger" @click="deleteMissionSlotTemplate">
              <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
            </b-btn>
          </click-confirm>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h1>{{ $t('mission.slotTemplate.slotlist') }}</h1>
          <mission-slot-template-slotlist></mission-slot-template-slotlist>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <mission-slot-template-duplicate-modal v-if="loggedIn"></mission-slot-template-duplicate-modal>
      <mission-slot-template-edit-modal v-if="isMissionSlotTemplateCreator"></mission-slot-template-edit-modal>
      <mission-slot-template-slot-create-modal v-if="isMissionSlotTemplateCreator"></mission-slot-template-slot-create-modal>
      <mission-slot-template-slot-details-modal></mission-slot-template-slot-details-modal>
      <mission-slot-template-slot-edit-modal v-if="isMissionSlotTemplateCreator"></mission-slot-template-slot-edit-modal>
      <mission-slot-template-slot-group-create-modal v-if="isMissionSlotTemplateCreator"></mission-slot-template-slot-group-create-modal>
      <mission-slot-template-slot-group-edit-modal v-if="isMissionSlotTemplateCreator"></mission-slot-template-slot-group-edit-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionSlotTemplateDuplicateModal from 'components/missionSlotTemplates/modals/MissionSlotTemplateDuplicateModal.vue'
import MissionSlotTemplateEditModal from 'components/missionSlotTemplates/modals/MissionSlotTemplateEditModal.vue'
import MissionSlotTemplateSlotCreateModal from 'components/missionSlotTemplates/modals/MissionSlotTemplateSlotCreateModal.vue'
import MissionSlotTemplateSlotDetailsModal from 'components/missionSlotTemplates/modals/MissionSlotTemplateSlotDetailsModal.vue'
import MissionSlotTemplateSlotEditModal from 'components/missionSlotTemplates/modals/MissionSlotTemplateSlotEditModal.vue'
import MissionSlotTemplateSlotGroupCreateModal from 'components/missionSlotTemplates/modals/MissionSlotTemplateSlotGroupCreateModal.vue'
import MissionSlotTemplateSlotGroupEditModal from 'components/missionSlotTemplates/modals/MissionSlotTemplateSlotGroupEditModal.vue'
import MissionSlotTemplateSlotlist from 'components/missionSlotTemplates/MissionSlotTemplateSlotlist.vue'
import utils from '../utils'

export default {
  components: {
    MissionSlotTemplateDuplicateModal,
    MissionSlotTemplateEditModal,
    MissionSlotTemplateSlotCreateModal,
    MissionSlotTemplateSlotDetailsModal,
    MissionSlotTemplateSlotEditModal,
    MissionSlotTemplateSlotGroupCreateModal,
    MissionSlotTemplateSlotGroupEditModal,
    MissionSlotTemplateSlotlist
  },
  beforeCreate: function() {
    this.$store.dispatch('getMissionSlotTemplateDetails', { missionSlotTemplateUid: this.$route.params.missionSlotTemplateUid })
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMissionSlotTemplateDetails')
  },
  beforeRouteLeave: function(to, from , next) {
    if (this.missionSlotTemplateUnsavedChanges) {
      const answer = window.confirm(this.$t('mission.slotTemplate.confirm.unsavedChanges'))
      if (answer) {
        next()
      } else {
        window.scrollTo(0, document.body.scrollHeight)
        next(false)
      }
    } else {
      next()
    }
  },
  computed: {
    formattedMissionSlotTemplateVisibility() {
      switch (this.missionSlotTemplateDetails.visibility) {
        case 'community':
          return `<span class="text-primary"><i class="fa fa-users" aria-hidden="true"></i> ${this.$t('mission.slotTemplate.visibility.community')}</span>`
        case 'hidden':
          return `<span class="text-danger"><i class="fa fa-edit" aria-hidden="true"></i> ${this.$t('mission.slotTemplate.visibility.hidden')}</span>`
        case 'private':
          return `<span class="text-warning"><i class="fa fa-user-secret" aria-hidden="true"></i> ${this.$t('mission.slotTemplate.visibility.private')}</span>`
        case 'public':
          return `<span class="text-success"><i class="fa fa-globe" aria-hidden="true"></i> ${this.$t('mission.slotTemplate.visibility.public')}</span>`
        default:
          return `<span class="text-muted font-italic"><i class="fa fa-question-circle" aria-hidden="true"></i> ${this.$t('mission.slotTemplate.visibility.default')}</span>`
      }
    },
    isMissionSlotTemplateCreator() {
      if (!this.loggedIn || _.isNil(this.missionSlotTemplateDetails)) {
        return false
      }

      return this.missionSlotTemplateDetails.creator.uid === this.$store.getters.user.uid
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missionSlotTemplateDetails() {
      return this.$store.getters.missionSlotTemplateDetails
    },
    missionSlotTemplateUnsavedChanges() {
      return this.$store.getters.missionSlotTemplateUnsavedChanges
    }
  },
  methods: {
    deleteMissionSlotTemplate() {
      this.$store.dispatch('deleteMissionSlotTemplate', {
        missionSlotTemplateUid: this.$route.params.missionSlotTemplateUid,
        missionSlotTemplateTitle: this.missionSlotTemplateDetails.title
      })
    }
  }
}
</script>
