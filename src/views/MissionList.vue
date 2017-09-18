<template>
  <div>
    <mission-list-table v-if="missions"></mission-list-table>
    <nav v-show="missionsPageCount > 1">
      <paginate ref="missionsPaginate" :pageCount="missionsPageCount" :initial-page="0" :clickHandler="missionsPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="small">
      <b-form-group :label="$t('mission.list.filter')" label-for="missionListFilter">
        <div role="group" id="missionListFilter">
          <b-form-checkbox v-model="missionListFilter" name="ended" value="ended">
            {{ $t('mission.list.filter.ended') }}
          </b-form-checkbox>
        </div>
      </b-form-group>
    </div>
    <div class="text-center">
      <router-link tag="button" v-show="loggedIn" type="button" class="btn btn-success" :to="{name: 'missionCreator'}">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission') }}
      </router-link>
      <b-btn @click="missionsPaginate(1)">
        <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.refresh') }}
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
    utils.setTitle(this.$t('nav.missions'))
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMissions')
  },
  data() {
    return {
      missionListFilter: []
    }
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
  },
  watch: {
    missionListFilter(val) {
      this.$store.dispatch('filterMissionList', val)
    }
  }
}
</script>
