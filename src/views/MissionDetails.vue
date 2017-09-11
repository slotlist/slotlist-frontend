<template>
  <div>
    <!-- Begin of content -->
    <div v-if="missionDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">{{ $t('mission.by') }}</span>
          <router-link :to="{name: 'userDetails', params: {userUid: missionDetails.creator.uid}}">{{ formatUserWithTag(missionDetails.creator) }}</router-link>
        </h5>
        <br>
        <p class="lead text-justify">{{ missionDetails.shortDescription }}</p>
        <hr class="my-4">
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.community') }}</h5>
            <p>
              <router-link v-if="missionDetails.community" :to="{name: 'communityDetails', params: {communitySlug: missionDetails.community.slug}}">{{ missionDetails.community.name }}</router-link>
              <span v-if="!missionDetails.community" class="text-muted font-italic">not associated</span>
            </p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.repositoryUrl') }}</h5>
            <p v-html="optionalRepositoryUrl"></p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.visibility') }}</h5>
            <p v-html="formattedMissionVisibility"></p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.slottingTime') }}</h5>
            <p>{{ formatDateTime(missionDetails.slottingTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.startTime') }}</h5>
            <p>{{ formatDateTime(missionDetails.startTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.endTime') }}
              <span class="text-muted">({{ $t('mission.abbr.estimated') }})</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.endTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.briefingTime.short') }}
              <span class="text-muted">({{ $t('mission.abbr.leadership') }})</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.briefingTime) }}</p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.techSupport') }}</h5>
            <p v-html="optionalTechSupport"></p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.rules') }}</h5>
            <p v-html="optionalRules"></p>
          </div>
        </div>
        <hr class="my-4" v-if="isMissionEditor">
        <div class="row justify-content-center" v-if="isMissionEditor">
          <div class="btn-group" role="group" aria-label="Mission actions">
            <b-btn variant="primary" v-b-modal.missionEditModal>
              <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
            </b-btn>
            <click-confirm yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
              <b-btn variant="danger" @click="deleteMission">
                <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
              </b-btn>
            </click-confirm>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <div class="html ql-editor text-justify" v-html="missionDetails.description"></div>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h1>{{ $t('mission.slotlist') }}</h1>
          <div class="small">
            <b-form-group :label="$t('mission.slotlist.filter')" label-for="missionSlotlistFilter">
              <div role="group" id="missionSlotlistFilter">
                <b-form-checkbox v-model="missionSlotlistFilter" name="assigned" value="assigned">
                  {{ $t('mission.slotlist.filter.assigned') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="hasRegistrations" value="hasRegistrations">
                  {{ $t('mission.slotlist.filter.hasRegistrations') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="open" value="open">
                  {{ $t('mission.slotlist.filter.open') }}
                </b-form-checkbox>
              </div>
            </b-form-group>
          </div>
          <mission-slotlist></mission-slotlist>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <mission-edit-modal></mission-edit-modal>
      <mission-slot-create-modal></mission-slot-create-modal>
      <mission-slot-details-modal></mission-slot-details-modal>
      <mission-slot-edit-modal></mission-slot-edit-modal>
      <mission-slot-group-create-modal></mission-slot-group-create-modal>
      <mission-slot-registration-modal></mission-slot-registration-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionEditModal from 'components/missions/modals/MissionEditModal.vue'
import MissionSlotCreateModal from 'components/missions/modals/MissionSlotCreateModal.vue'
import MissionSlotDetailsModal from 'components/missions/modals/MissionSlotDetailsModal.vue'
import MissionSlotEditModal from 'components/missions/modals/MissionSlotEditModal.vue'
import MissionSlotGroupCreateModal from 'components/missions/modals/MissionSlotGroupCreateModal.vue'
import MissionSlotlist from 'components/missions/MissionSlotlist.vue'
import MissionSlotRegistrationModal from 'components/missions/modals/MissionSlotRegistrationModal.vue'
import utils from '../utils'

export default {
  components: {
    MissionEditModal,
    MissionSlotCreateModal,
    MissionSlotDetailsModal,
    MissionSlotEditModal,
    MissionSlotGroupCreateModal,
    MissionSlotlist,
    MissionSlotRegistrationModal
  },
  data() {
    return {
      missionSlotlistFilter: []
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    isMissionCreator() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`])
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    optionalRepositoryUrl() {
      return this.missionDetails.repositoryUrl || `<span class='text-muted font-italic'>${this.$t('misc.notProvided')}</span>`
    },
    optionalTechSupport() {
      return this.missionDetails.techSupport || `<span class='text-muted font-italic'>${this.$t('misc.notProvided')}</span>`
    },
    optionalRules() {
      return this.missionDetails.rules || `<span class='text-muted font-italic'>${this.$t('misc.notSpecified')}</span>`
    },
    formattedMissionVisibility() {
      switch (this.missionDetails.visibility) {
        case 'community':
          return `<span class="text-primary"><i class="fa fa-users" aria-hidden="true"></i> ${this.$t('mission.visibility.community')}</span>`
        case 'hidden':
          return `<span class="text-danger"><i class="fa fa-edit" aria-hidden="true"></i> ${this.$t('mission.visibility.hidden')}</span>`
        case 'private':
          return `<span class="text-warning"><i class="fa fa-user-secret" aria-hidden="true"></i> ${this.$t('mission.visibility.private')}</span>`
        case 'public':
          return `<span class="text-success"><i class="fa fa-globe" aria-hidden="true"></i> ${this.$t('mission.visibility.public')}</span>`
        default:
          return `<span class="text-muted font-italic"><i class="fa fa-question-circle" aria-hidden="true"></i> ${this.$t('mission.visibility.default')}</span>`
      }
    }
  },
  methods: {
    deleteMission() {
      this.$store.dispatch('deleteMission', {
        missionSlug: this.$route.params.missionSlug,
        missionTitle: this.missionDetails.title
      })
    }
  },
  watch: {
    missionSlotlistFilter(val) {
      this.$store.dispatch('filterMissionSlotlist', val)
    }
  },
  beforeCreate: function() {
    this.$store.dispatch('getMissionDetails', { missionSlug: this.$route.params.missionSlug })
    this.$store.dispatch('getMissionSlotlist', { missionSlug: this.$route.params.missionSlug })
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMissionDetails')
  }
}
</script>

<style>
.ql-container .ql-editor {
  min-height: 25em;
  padding-bottom: 1em;
  max-height: 25em;
}

.html {
  overflow-y: auto;
  border-top: none;
}
</style>
