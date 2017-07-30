<template>
  <div>
    <div v-if="loaded">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">by</span>
          <router-link :to="{name: 'userDetails', params: {userUid: missionDetails.creator.uid}}">{{ missionDetails.creator.nickname }}</router-link>
        </h5>
        <br>
        <p class="lead text-justify">{{ missionDetails.shortDescription }}</p>
        <hr class="my-4">
        <div class="row text-center">
          <div class="col">
            <h5>Community</h5>
            <p>
              <router-link v-if="missionDetails.community" :to="{name: 'communityDetails', params: {communitySlug: missionDetails.community.slug}}">{{ missionDetails.community.name }}</router-link>
              <span v-if="!missionDetails.community" class="text-muted font-italic">not associated</span>
            </p>
          </div>
          <div class="col">
            <h5>Slotting time</h5>
            <p class="font-weight-bold text-success">{{ formatDateTime(missionDetails.slottingTime) }}</p>
          </div>
          <div class="col">
            <h5>Start time</h5>
            <p class="font-weight-bold text-danger">{{ formatDateTime(missionDetails.startTime) }}</p>
          </div>
          <div class="col">
            <h5>End time
              <span class="text-muted">(est.)</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.endTime) }}</p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>Briefing
              <span class="text-muted">(ldrsp.)</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.briefingTime) }}</p>
          </div>
          <div class="col">
            <h5>Repository URL</h5>
            <p v-html="optionalRepositoryURL"></p>
          </div>
          <div class="col">
            <h5>Techsupport</h5>
            <p v-html="optionalTechSupport"></p>
          </div>
          <div class="col">
            <h5>Rules</h5>
            <p v-html="optionalRules"></p>
          </div>
        </div>
        <hr class="my-4" v-if="isMissionEditor">
        <div class="row justify-content-center" v-if="isMissionEditor">
          <div class="btn-group" role="group" aria-label="Mission actions">
            <button type="button" class="btn btn-primary" @click="editMission">Edit</button>
            <button type="button" class="btn btn-danger" v-if="isMissionCreator" @click="deleteMission">Delete</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <div class="html ql-editor text-justify" v-html="missionDetails.description"></div>
        </div>
      </div>
      <br>
      <div class="card" v-if="slotlistLoaded">
        <div class="card-block text-nowrap">
          <h1> Slotlist
            <i class="fa fa-refresh fa-fw small" aria-hidden="true"></i>
          </h1>
          <mission-slotlist></mission-slotlist>
        </div>
      </div>
    </div>
    <b-modal ref="slotDetailsModal" id="slotDetailsModal" @hide="slotDetailsModalClosed">
      <div slot="modal-title">
        <h5>Slot details - #{{ slotDetails.orderNumber + 1 }} {{ slotDetails.title }}</h5>
      </div>
      <div class="container-fluid">
        <div class="row font-weight-bold">
          <div class="col col-1">#</div>
          <div class="col col-3">Role</div>
          <div class="col col-5">Player</div>
          <div class="col col-3">Difficulty</div>
        </div>
        <div class="row">
          <div class="col col-1">{{ slotDetails.orderNumber + 1 }}</div>
          <div class="col col-3">{{ slotDetails.title }} </div>
          <div class="col col-5" v-html="optionalAssignee"></div>
          <div class="col col-3">
            <i :class="difficultyIcon" aria-hidden="true"></i>
            <span :class="difficultyColor">{{ difficultyText }}</span>
          </div>
        </div>
        <div class="row font-weight-bold">
          <div class="col col-1"></div>
          <div class="col col-6">Description</div>
          <div class="col col-5">Status</div>
        </div>
        <div class="row">
          <div class="col col-1"></div>
          <div class="col col-6">{{ slotDetails.shortDescription}}</div>
          <div class="col col-5" v-html="slotStatus"></div>
        </div>
        <hr class="my-4" v-show="slotDetails.description">
        <div class="row" v-show="slotDetails.description">
          <div class="col col-12" v-html="slotDetails.description"></div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot detail actions">
          <button type="button" class="btn btn-success" @click="slotDetailsRegister" :disabled="slotDetails.assignee">Register</button>
          <button type="button" class="btn btn-secondary" @click="hideSlotDetailsModal">Close</button>
        </div>
      </div>
    </b-modal>
    <div v-if="!loaded || !slotlistLoaded">
      <loading-overlay message="Loading Mission details..."></loading-overlay>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionSlotlist from 'components/MissionSlotlist.vue'
import utils from '../utils'

export default {
  components: {
    MissionSlotlist
  },
  computed: {
    loaded() {
      return this.$store.getters.missionDetailsLoaded
    },
    slotlistLoaded() {
      return this.$store.getters.missionSlotlistLoaded
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
    optionalRepositoryURL() {
      return this.missionDetails.repositoryURL || "<span class='text-muted font-italic'>not required</span>"
    },
    optionalTechSupport() {
      return this.missionDetails.techSupport || "<span class='text-muted font-italic'>not provided</span>"
    },
    optionalRules() {
      return this.missionDetails.rules || "<span class='text-muted font-italic'>not specified</span>"
    },
    slotDetails() {
      return this.$store.getters.missionSlotDetails
    },
    showSlotDetails() {
      return this.$store.getters.showMissionSlotDetails
    },
    optionalAssignee() {
      return _.isNil(this.slotDetails.assignee) ? '<span class="text-muted font-italic">not assigned</span>' : this.formatUserWithTag(this.slotDetails.assignee)
    },
    difficultyColor() {
      switch (this.slotDetails.difficulty) {
        case 0: return 'text-muted'
        case 1: return 'text-info'
        case 2: return 'text-primary'
        case 3: return 'text-warning'
        case 4: return 'text-danger'
        default: return ''
      }
    },
    difficultyIcon() {
      return `${this.difficultyColor} fa fa-thermometer-${this.slotDetails.difficulty} fa-lg`
    },
    difficultyText() {
      switch (this.slotDetails.difficulty) {
        case 0: return 'Beginner'
        case 1: return 'Easy'
        case 2: return 'Medium'
        case 3: return 'Advanced'
        case 4: return 'Expert'
        default: return ''
      }
    },
    slotStatus() {
      return `${this.slotRestricted} - ${this.slotReserve}`
    },
    slotRestricted() {
      if (this.slotDetails.restricted) {
        return '<span class="text-primary font-italic">restricted</span>'
      }

      return '<span>unrestricted</span>'
    },
    slotReserve() {
      if (this.slotDetails.reserve) {
        return '<span class="text-muted font-italic">reserve</span>'
      }

      return '<span>regular</span>'
    }
  },
  methods: {
    editMission() {
      console.log('editMission', this.missionDetails)
    },
    deleteMission() {
      console.log('deleteMission', this.missionDetails)
    },
    slotDetailsModalClosed() {
      this.$store.dispatch('clearMissionSlotDetails')
    },
    slotDetailsRegister() {
      console.log('slotDetailsRegister')
    },
    hideSlotDetailsModal() {
      this.$refs.slotDetailsModal.hide()
    }
  },
  watch: {
    showSlotDetails(val) {
      if (val) {
        this.$refs.slotDetailsModal.show()
      }
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getMissionDetails', this.$route.params.missionSlug)
    this.$store.dispatch('getMissionSlotlist', this.$route.params.missionSlug)
    this.$store.dispatch('clearMissionSlotDetails')
  },
  created: function () {
    utils.setTitle('Mission')
  },
  beforeDestroy: function () {
    this.$store.dispatch('clearMissionDetails')
    this.$store.dispatch('clearMissionSlotDetails')
  }
}
</script>

<style scoped>
.ql-container .ql-editor {
  min-height: 20em;
  padding-bottom: 1em;
  max-height: 25em;
}

.html {
  overflow-y: auto;
  border-top: none;
}
</style>
