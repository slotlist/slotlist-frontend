<template>
  <div>
    <!-- Begin of content -->
    <div v-if="communityDetails">
      <div class="jumbotron">
        <h1 class="display-4  text-center">{{ communityDetails.name }}</h1>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>Tag</h5>
            <p>[{{ communityDetails.tag}}]</p>
          </div>
          <div class="col">
            <h5>Website</h5>
            <p v-html="optionalCommunityWebsite"></p>
          </div>
        </div>
        <hr class="my-4" v-show="canEditCommunity">
        <div class="row justify-content-center" v-show="canEditCommunity">
          <div class="btn-group btn-group-sm" role="group" aria-label="Community actions">
            <button type="button" class="btn btn-primary" @click="showCommunityEditModal">
              <i class="fa fa-edit" aria-hidden="true"></i> Edit
            </button>
            <click-confirm v-show="isCommunityFounder" button-yes-icon="fa fa-trash" button-yes-class="btn btn-danger" :messages="{title: 'Delete community?', yes: 'Confirm', no: 'Cancel'}">
              <button type="button" class="btn btn-danger" v-show="isCommunityFounder" @click="deleteCommunity">
                <i class="fa fa-trash" aria-hidden="true"></i> Delete
              </button>
            </click-confirm>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Members</h4>
          <community-members></community-members>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Missions</h4>
          <community-missions></community-missions>
        </div>
      </div>
      <br>
      <div class="card" v-if="canEditCommunityMembers">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Applications</h4>
          <community-applications></community-applications>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <b-modal ref="communityEditModal" id="communityEditModal" size="lg" title="Edit community details" @show="populateCommunityEditModal">
        <div class="container-fluid">
          <b-form @submit.stop.prevent="editCommunity">
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Name" :state="communityEditNameState" :feedback="communityEditNameFeedback">
                  <b-form-input v-model="communityEdit.name" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
              <div class="col">
                <b-form-fieldset label="Tag" :state="communityEditTagState" :feedback="communityEditTagFeedback">
                  <b-form-input v-model="communityEdit.tag" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Website <em>(optional)</em>" :state="communityEditWebsiteState" :feedback="communityEditWebsiteFeedback">
                  <b-form-input v-model="communityEdit.website" type="text"></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
          </b-form>
        </div>
        <div slot="modal-footer">
          <div class="btn-group" role="group" aria-label="Community edit actions">
            <button type="button" class="btn btn-success" @click="editCommunity">
              <i class="fa fa-save" aria-hidden="true"></i> Save
            </button>
            <button type="button" class="btn btn-secondary" @click="hideCommunityEditModal">
              <i class="fa fa-close" aria-hidden="true"></i> Cancel
            </button>
          </div>
        </div>
      </b-modal>
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
import CommunityMembers from '../components/communities/CommunityMembers.vue'
import CommunityMissions from '../components/communities/CommunityMissions.vue'

import utils from '../utils'

export default {
  components: {
    CommunityApplications,
    CommunityMembers,
    CommunityMissions
  },
  beforeCreate: function () {
    this.$store.dispatch('getCommunityDetails', this.$route.params.communitySlug)
  },
  created: function () {
    utils.setTitle('Community')
  },
  beforeDestroy: function () {
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
    communityEditNameFeedback() {
      return _.isNil(this.communityEdit.name) || _.isEmpty(this.communityEdit.name) ? 'Please enter a name' : ''
    },
    communityEditNameState() {
      return _.isNil(this.communityEdit.name) || _.isEmpty(this.communityEdit.name) ? 'danger' : 'success'
    },
    communityEditTagFeedback(proerty) {
      return _.isNil(this.communityEdit.tag) || _.isEmpty(this.communityEdit.tag) ? 'Please enter a tag' : ''
    },
    communityEditTagState() {
      return _.isNil(this.communityEdit.tag) || _.isEmpty(this.communityEdit.tag) ? 'danger' : 'success'
    },
    communityEditWebsiteFeedback() {
      if (_.isNil(this.communityEdit.website) || _.isEmpty(this.communityEdit.website)) {
        return ''
      }

      return this.isCommunityEditWebsiteValidUrl ? '' : 'Please enter a valid website URL'
    },
    communityEditWebsiteState() {
      if (_.isNil(this.communityEdit.website) || _.isEmpty(this.communityEdit.website)) {
        return 'success'
      }

      return this.isCommunityEditWebsiteValidUrl ? 'success' : 'danger'
    },
    isCommunityEditWebsiteValidUrl() {
      // Taken from: https://stackoverflow.com/a/5717133 @ 2017-08-04 09:43
      const urlPattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
      return urlPattern.test(this.communityEdit.website)
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
        `<span class="text-muted font-italic">not provided</span>`
    },
    working() {
      return this.$store.getters.working
    }
  },
  methods: {
    deleteCommunity() {
      this.$store.dispatch('deleteCommunity', { communitySlug: this.$route.params.communitySlug, communityName: this.communityDetails.name })
    },
    editCommunity() {
      this.hideCommunityEditModal()

      if (_.isEmpty(this.communityEdit.website)) {
        this.communityEdit.website = null
      }

      const updatedCommunityDetails = {}
      _.each(this.communityEdit, (value, key) => {
        if (!_.isEqual(value, this.communityDetails[key])) {
          updatedCommunityDetails[key] = value
        }
      })

      if (_.isEmpty(updatedCommunityDetails)) {
        return this.$store.dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'warning',
          alertMessage: `<i class="fa fa-warning" aria-hidden="true"></i> No changes made to community details`
        })
      }

      this.$store.dispatch('editCommunity', {
        communitySlug: this.$route.params.communitySlug,
        updatedCommunityDetails
      })
    },
    hideCommunityEditModal() {
      this.$refs.communityEditModal.hide()
    },
    populateCommunityEditModal() {
      this.communityEdit.name = this.communityDetails.name
      this.communityEdit.tag = this.communityDetails.tag
      this.communityEdit.website = this.communityDetails.website
    },
    showCommunityEditModal() {
      this.$refs.communityEditModal.show()
    }
  }
}
</script>
