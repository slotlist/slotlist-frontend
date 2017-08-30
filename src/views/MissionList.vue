<template>
  <div>
    <mission-list-table v-if="missions"></mission-list-table>
    <nav v-show="missionsPageCount > 1">
      <paginate ref="" :pageCount="missionsPageCount" :initial-page="0" :clickHandler="missionsPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center" v-show="loggedIn">
      <router-link tag="button" type="button" class="btn btn-success" :to="{name: 'missionCreator'}">
        <i class="fa fa-plus" aria-hidden="true"></i> Create mission
      </router-link>
    </div>
  </div>
</template>

<script>
import MissionListTable from '../components/MissionListTable.vue'
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
