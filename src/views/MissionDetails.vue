<template>
  <div>
    <div v-show="loaded">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">by</span> {{ missionDetails.initiator }}</h5>
        <br>
        <p class="lead text-justify">{{ missionDetails.shortDescription }}</p>
        <hr class="my-4">
        <div class="row text-center">
          <div class="col">
            <h5>Mission date</h5>
            <p>{{ missionDetails.missionDate }}</p>
          </div>
          <div class="col">
            <h5>Slotting time</h5>
            <p class="font-weight-bold text-success">{{ missionDetails.slottingTime }}</p>
          </div>
          <div class="col">
            <h5>Start time</h5>
            <p class="font-weight-bold text-danger">{{ missionDetails.startTime }}</p>
          </div>
          <div class="col">
            <h5>End time
              <span class="text-muted">(est.)</span>
            </h5>
            <p>{{ missionDetails.endTime }}</p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>Briefing
              <span class="text-muted">(ldrsp.)</span>
            </h5>
            <p>{{ missionDetails.briefingTime }}</p>
          </div>
          <div class="col">
            <h5>Repository URL</h5>
            <p v-html="missionDetails.repositoryURL"></p>
          </div>
          <div class="col">
            <h5>Techsupport</h5>
            <p>{{ missionDetails.techSupport }}</p>
          </div>
          <div class="col">
            <h5>Rules</h5>
            <p v-html="missionDetails.rules"></p>
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
          <h1>Slotlist</h1>
          <mission-slotlist></mission-slotlist>
        </div>
      </div>
    </div>
    <div v-show="!loaded">
      <loading-overlay message="Loading Mission details..."></loading-overlay>
    </div>
  </div>
</template>

<script>
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
    missionDetails() {
      return this.$store.getters.missionDetails
    }
  },
  /*data() {
    return {
      editorOptions: {
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': 1 }, { 'header': 2 }, { 'color': [] }],
            ['bold', 'italic'],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
            ['link', 'image'],
            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
        },
        theme: 'snow'
      }
    }
  },*/
  beforeCreate: function () {
    this.$store.dispatch('getMissionDetails', this.$route.params.slug)
  },
  created: function () {
    utils.setTitle('Testmission')
  },
  beforeDestroy: function () {
    this.$store.commit('clearMissionDetails')
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
