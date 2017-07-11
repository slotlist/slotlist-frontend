<template>
  <div>
    <div v-show="loaded">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">by</span> {{ missionDetails.initiator }}</h5>
        <br>
        <p class="lead">{{ missionDetails.shortDescription }}</p>
        <hr class="my-4">
        <div>
          <div class="html ql-editor" v-html="missionDetails.description"> </div>
        </div>
      </div>
      <mission-slotlist></mission-slotlist>
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
  resize: vertical;
}
</style>
