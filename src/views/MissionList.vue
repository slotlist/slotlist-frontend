<template>
  <div>
    <mission-list-table v-if="missions"></mission-list-table>
    <nav v-show="missionsPageCount > 1">
      <paginate ref="missionsPaginate" :pageCount="missionsPageCount" :initial-page="0" :clickHandler="missionsPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="small" v-html="$t('mission.timezone', { timezone: timezone })"></div>
    <div class="small">
      <b-form-group :label="$t('mission.list.filter')" label-for="missionListFilter">
        <div role="group" id="missionListFilter">
          <b-form-checkbox v-model="missionListFilter" name="ended" value="ended">
            {{ $t('mission.list.filter.ended') }}
          </b-form-checkbox>
          <b-form-checkbox v-if="loggedIn" v-model="missionListFilter" name="assigned" value="assigned">
            {{ $t('mission.list.filter.assigned') }}
          </b-form-checkbox>
          <b-form-checkbox v-if="loggedIn" v-model="missionListFilter" name="registered" value="registered">
            {{ $t('mission.list.filter.registered') }}
          </b-form-checkbox>
        </div>
        <div role="group" id="missionListRequiredDLCsFilter" v-if="haveMissionsAnyRequiredDLCs || (missionListRequiredDLCsFilter && missionListRequiredDLCsFilter.length > 0)">
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="apex" value="apex">
            <i class="icon-arma-3-apex-dlc"></i> {{ $t('mission.requiredDLCs.apex') }}
          </b-form-checkbox>
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="helicopters" value="helicopters">
            <i class="icon-arma-3-helicopters-dlc"></i> {{ $t('mission.requiredDLCs.helicopters') }}
          </b-form-checkbox>
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="jets" value="jets">
            <i class="icon-arma-3-jets-dlc"></i> {{ $t('mission.requiredDLCs.jets') }}
          </b-form-checkbox>
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="karts" value="karts">
            <i class="icon-arma-3-karts-dlc"></i> {{ $t('mission.requiredDLCs.karts') }}
          </b-form-checkbox>
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="laws-of-war" value="laws-of-war">
            <i class="icon-arma-3-laws-of-war-dlc"></i> {{ $t('mission.requiredDLCs.laws-of-war') }}
          </b-form-checkbox>
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="marksmen" value="marksmen">
            <i class="icon-arma-3-marksmen-dlc"></i> {{ $t('mission.requiredDLCs.marksmen') }}
          </b-form-checkbox>
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="tac-ops" value="tac-ops">
            <i class="icon-arma-3-tac-ops-dlc"></i> {{ $t('mission.requiredDLCs.tac-ops') }}
          </b-form-checkbox>
          <b-form-checkbox v-model="missionListRequiredDLCsFilter" name="tanks" value="tanks">
            <i class="icon-arma-3-tanks-dlc"></i> {{ $t('mission.requiredDLCs.tanks') }}
          </b-form-checkbox>
        </div>
      </b-form-group>
    </div>
    <div class="text-center">
      <router-link tag="button" v-show="loggedIn" type="button" class="btn btn-success" :to="{name: 'missionCreator'}">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission') }}
      </router-link>
      <b-btn :disabled="refreshingMissions" @click="missionsPaginate(1)">
        <i class="fa fa-refresh" :class="{'fa-spin': refreshingMissions}" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
    <br>
    <div class="row justify-content-center">
      <div class="col-4 text-center">
        <h6>{{ $t('mission.list.search') }}</h6>
        <b-form-fieldset :description="$t('mission.list.search.description')">
          <typeahead ref="missionSearchTypeahead" action="searchMissions" actionIndicator="searchingMissions" :onHit="missionSelected"></typeahead>
        </b-form-fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionListTable from '../components/missions/MissionListTable.vue'
import utils from '../utils'

export default {
  components: {
    MissionListTable
  },
  beforeCreate: function() {
    if (_.isNil(this.$store.getters.missions) || _.isEmpty(this.$store.getters.missions)) {
      this.$store.dispatch('getMissions', { autoRefresh: true })
    }
  },
  created: function() {
    this.missionListFilter = this.$store.getters.missionListFilter
    this.missionListRequiredDLCsFilter = this.$store.getters.missionListRequiredDLCsFilter

    utils.setTitle(this.$t('nav.missions'))
  },
  data() {
    return {
      missionListFilter: [],
      missionListRequiredDLCsFilter: []
    }
  },
  computed: {
    haveMissionsAnyRequiredDLCs() {
      if (_.isNil(this.missions)) {
        return false
      }

      return _.some(this.missions, (mission) => {
        return !_.isEmpty(mission.requiredDLCs)
      })
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missions() {
      return this.$store.getters.missions
    },
    missionsPageCount() {
      return this.$store.getters.missionsPageCount
    },
    refreshingMissions() {
      return this.$store.getters.refreshingMissions
    },
    timezone() {
      return this.$store.getters.timezone
    }
  },
  methods: {
    missionSelected(item) {
      this.$router.push({ name: 'missionDetails', params: {missionSlug: item.value.slug}})
    },
    missionsPaginate(page) {
      this.$store.dispatch('getMissions', { page, autoRefresh: true })
    }
  },
  watch: {
    missionListFilter(val) {
      this.$store.dispatch('filterMissionList', val)
    },
    missionListRequiredDLCsFilter(val) {
      this.$store.dispatch('filterMissionListRequiredDLCs', val)
    }
  }
}
</script>
