<template>
  <div>
    <!-- Begin of content -->
    <div v-if="communityDetails">
      <div class="jumbotron">
        <h1 class="display-4  text-center">{{ communityDetails.name }}</h1>
        <br>
        <div class="text-center" v-if="communityDetails.logoUrl">
          <img :src="communityDetails.logoUrl" style="max-width: 100%; max-height: 240px">
          <br><br>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('community.tag') }}</h5>
            <p>[{{ communityDetails.tag}}]</p>
          </div>
          <div class="col">
            <h5>Website</h5>
            <p v-html="optionalCommunityWebsite"></p>
          </div>
        </div>
        <div class="row text-center" v-if="isCommunityMember">
          <div class="col" v-if="communityDetails.gameServers">
            <h5>{{ $t('community.gameServers') }}</h5>
            <div class="row" v-for="(gameServer, index) in communityDetails.gameServers" :key="`${gameServer.hostname}:${gameServer.port}`">
              <div class="col">
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.hostname') }}</div>
                  <div class="col-4">{{ gameServer.hostname }}</div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.port') }}</div>
                  <div class="col-4">{{ gameServer.port }}</div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.name') }}</div>
                  <div class="col-4">
                    <span v-if="gameServer.name">{{ gameServer.name }}</span>
                    <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.password') }}</div>
                  <div class="col-4">
                    <span v-if="gameServer.password">{{ gameServer.password }}</span>
                    <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                  </div>
                </div>
                <br v-if="index < communityDetails.gameServers.length - 1">
              </div>
            </div>
          </div>
          <div class="col" v-if="communityDetails.voiceComms">
            <h5>{{ $t('community.voiceComms') }}</h5>
            <div class="row" v-for="(voiceComms, index) in communityDetails.voiceComms" :key="`${voiceComms.hostname}:${voiceComms.port}`">
              <div class="col">
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.hostname') }}</div>
                  <div class="col-4">{{ voiceComms.hostname }}</div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.port') }}</div>
                  <div class="col-4">{{ voiceComms.port }}</div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.name') }}</div>
                  <div class="col-4">
                    <span v-if="voiceComms.name">{{ voiceComms.name }}</span>
                    <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.password') }}</div>
                  <div class="col-4">
                    <span v-if="voiceComms.password">{{ voiceComms.password }}</span>
                    <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                  </div>
                </div>
                <br v-if="index < communityDetails.gameServers.length - 1">
              </div>
            </div>
          </div>
        </div>
        <hr class="my-4" v-show="canEditCommunity">
        <div class="row justify-content-center" v-if="canEditCommunity">
          <b-btn variant="primary" v-b-modal.communityEditModal>
            <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
          </b-btn>&nbsp;
          <b-btn variant="primary" v-b-modal.communityLogoModal>
            <i class="fa fa-picture-o" aria-hidden="true"></i> {{ $t('button.edit.community.logo') }}
          </b-btn>&nbsp;
          <b-btn variant="primary" v-if="isCommunityFounder" v-b-modal.communityPermissionModal>
            <i class="fa fa-key" aria-hidden="true"></i> {{ $t('button.edit.community.permissions') }}
          </b-btn>&nbsp;
          <click-confirm v-if="isCommunityFounder" yes-icon="fa fa-trash" yes-class="btn btn-danger" :messages="{title: $t('community.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
            <b-btn variant="danger" @click="deleteCommunity">
              <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
            </b-btn>
          </click-confirm>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('nav.missions') }}</h4>
          <community-missions></community-missions>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('community.members') }}</h4>
          <community-members></community-members>
        </div>
      </div>
      <br>
      <div class="card" v-if="canEditCommunityMembers">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('community.applications') }}</h4>
          <div class="small">
            <b-form-group :label="$t('community.applications.filter')" label-for="communityApplicationsFilter">
              <div role="group" id="communityApplicationsFilter">
                <b-form-checkbox v-model="communityApplicationsFilter" name="processed" value="processed">
                  {{ $t('community.applications.filter.processed') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="communityApplicationsFilter" name="accepted" value="accepted">
                  {{ $t('community.applications.filter.accepted') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="communityApplicationsFilter" name="denied" value="denied">
                  {{ $t('community.applications.filter.denied') }}
                </b-form-checkbox>
              </div>
            </b-form-group>
          </div>
          <community-applications></community-applications>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div v-if="loggedIn">
      <community-edit-modal v-if="canEditCommunity"></community-edit-modal>
      <community-logo-modal v-if="canEditCommunity"></community-logo-modal>
      <community-permission-modal v-if="isCommunityFounder"></community-permission-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'

import CommunityApplications from '../components/communities/CommunityApplications.vue'
import CommunityEditModal from '../components/communities/modals/CommunityEditModal.vue'
import CommunityLogoModal from '../components/communities/modals/CommunityLogoModal.vue'
import CommunityMembers from '../components/communities/CommunityMembers.vue'
import CommunityMissions from '../components/communities/CommunityMissions.vue'
import CommunityPermissionModal from '../components/communities/modals/CommunityPermissionModal.vue'

import utils from '../utils'

export default {
  components: {
    CommunityApplications,
    CommunityEditModal,
    CommunityLogoModal,
    CommunityMembers,
    CommunityMissions,
    CommunityPermissionModal
  },
  beforeCreate: function() {
    this.$store.dispatch('getCommunityDetails', this.$route.params.communitySlug)
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearCommunityDetails')
  },
  created: function() {
    if (this.loggedIn && !this.isCommunityMember) {
      this.$store.dispatch('getCommunityApplicationStatus', this.$route.params.communitySlug)
    }
  },
  data() {
    return {
      communityApplicationsFilter: [],
      communityEdit: {
        name: null,
        tag: null,
        website: null
      }
    }
  },
  computed: {
    canEditCommunity() {
      return this.$acl.can([`community.${this.$route.params.communitySlug}.founder`, `community.${this.$route.params.communitySlug}.leader`])
    },
    canEditCommunityMembers() {
      return this.$acl.can([`community.${this.$route.params.communitySlug}.founder`, `community.${this.$route.params.communitySlug}.leader`, `community.${this.$route.params.communitySlug}.recruitment`])
    },
    communityDetails() {
      return this.$store.getters.communityDetails
    },
    isCommunityFounder() {
      return this.$acl.can([`community.${this.$route.params.communitySlug}.founder`])
    },
    isCommunityMember() {
      const user = this.$store.getters.user

      if (_.isNil(user)) {
        return false
      } else if (_.isNil(user.community)) {
        return false
      }

      return user.community.slug === this.$route.params.communitySlug
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    optionalCommunityWebsite() {
      return _.isString(this.communityDetails.website) && !_.isEmpty(this.communityDetails.website) ?
        `<a href="${this.communityDetails.website}">${this.communityDetails.website}</a>` :
        `<span class="text-muted font-italic">${this.$t('misc.notProvided')}</span>`
    }
  },
  methods: {
    deleteCommunity() {
      this.$store.dispatch('deleteCommunity', { communitySlug: this.$route.params.communitySlug, communityName: this.communityDetails.name })
    }
  },
  watch: {
    communityApplicationsFilter(val) {
      this.$store.dispatch('filterCommunityApplications', { filter: val, communitySlug: this.$route.params.communitySlug })
    }
  }
}
</script>
