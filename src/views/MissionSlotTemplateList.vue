<template>
  <div>
    <mission-slot-template-list-table v-if="missionSlotTemplates"></mission-slot-template-list-table>
    <nav v-show="missionSlotTemplatesPageCount > 1">
      <paginate ref="missionSlotTemplatesPaginate" :pageCount="missionSlotTemplatesPageCount" :initial-page="0" :clickHandler="missionSlotTemplatesPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <router-link tag="button" type="button" class="btn btn-success" :to="{name: 'missionSlotTemplateCreator'}">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.slot.template') }}
      </router-link>
      <b-btn :disabled="refreshingMissionSlotTemplates" @click="missionSlotTemplatesPaginate(1)">
        <i class="fa fa-refresh" :class="{'fa-spin': refreshingMissionSlotTemplates}" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionSlotTemplateListTable from '../components/missionSlotTemplates/MissionSlotTemplateListTable.vue'
import utils from '../utils'

export default {
  components: {
    MissionSlotTemplateListTable
  },
  beforeCreate: function() {
    if (_.isNil(this.$store.getters.missionSlotTemplates) || _.isEmpty(this.$store.getters.missionSlotTemplates) || _.isNil(this.$store.getters.missionSlotTemplatesRefreshSetInterval)) {
      this.$store.dispatch('getMissionSlotTemplates', { autoRefresh: true })
    }
  },
  created: function() {
    utils.setTitle(this.$t('nav.missionSlotTemplates'))
  },
  computed: {
    missionSlotTemplates() {
      return this.$store.getters.missionSlotTemplates
    },
    missionSlotTemplatesPageCount() {
      return this.$store.getters.missionSlotTemplatesPageCount
    },
    refreshingMissionSlotTemplates() {
      return this.$store.getters.refreshingMissionSlotTemplates
    }
  },
  methods: {
    missionSlotTemplatesPaginate(page) {
      this.$store.dispatch('getMissionSlotTemplates', { page, autoRefresh: true })
    }
  }
}
</script>
