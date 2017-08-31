<template>
  <div>
    <mission-list-table v-if="missions"></mission-list-table>
    <nav v-show="missionsPageCount > 1">
      <paginate ref="missionsPaginate" :pageCount="missionsPageCount" :initial-page="1" :clickHandler="missionsPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <router-link tag="button" v-show="loggedIn" type="button" class="btn btn-success" :to="{name: 'missionCreator'}">
        <i class="fa fa-plus" aria-hidden="true"></i> Create mission
      </router-link>
      <b-btn @click="missionsPaginate(1)">
        <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
      </b-btn>
    </div>
  </div>
</template>

<script>
import MissionListTable from '../components/missions/MissionListTable.vue'
import utils from '../utils'

export default {
  components: {
    MissionListTable
  },
  beforeCreate: function() {
    this.$store.dispatch('getMissions')
  },
  created: function() {
    utils.setTitle('Missions')
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMissions')
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missions() {
      return this.$store.getters.missions
    },
    missionsPageCount() {
      return this.$store.getters.missionsPageCount
    }
  },
  methods: {
    missionsPaginate(page) {
      this.$store.dispatch('getMissions', { page })
    }
  }
}
</script>
