<template>
  <div>
    <!-- Begin of content -->
    <div v-if="communityDetails">
      <div class="jumbotron">
        <h1 class="display-4  text-center">{{ communityDetails.name }}</h1>
        <br>
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
        <hr class="my-4" v-show="canEditCommunity">
        <div class="row justify-content-center" v-show="canEditCommunity">
          <div class="btn-group" role="group" aria-label="Community actions">
            <b-btn variant="primary" v-b-modal.communityEditModal>
              <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
            </b-btn>
            <click-confirm v-show="isCommunityFounder" yes-icon="fa fa-trash" yes-class="btn btn-danger" :messages="{title: $t('community.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
              <b-btn variant="danger" v-if="isCommunityFounder" @click="deleteCommunity">
                <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
              </b-btn>
            </click-confirm>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('community.members') }}</h4>
          <community-members></community-members>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('nav.missions') }}</h4>
          <community-missions></community-missions>
        </div>
      </div>
      <br>
      <div class="card" v-if="canEditCommunityMembers">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('community.applications') }}</h4>
          <community-applications></community-applications>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <community-edit-modal></community-edit-modal>
    </div>
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
    </div>
    <!-- End of overlays -->
  </div>
</template>

<script>
import * as _ from 'lodash'

import CommunityApplications from '../components/communities/CommunityApplications.vue'
import CommunityEditModal from '../components/communities/modals/CommunityEditModal.vue'
import CommunityMembers from '../components/communities/CommunityMembers.vue'
import CommunityMissions from '../components/communities/CommunityMissions.vue'

import utils from '../utils'

export default {
  components: {
    CommunityApplications,
    CommunityEditModal,
    CommunityMembers,
    CommunityMissions
  },
  beforeCreate: function() {
    this.$store.dispatch('getCommunityDetails', this.$route.params.communitySlug)
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearCommunityDetails')
  },
  data() {
    return {
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
  }
}
</script>
