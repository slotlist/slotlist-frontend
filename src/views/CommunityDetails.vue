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
        <div class="row text-center" v-if="isCommunityMember || isCommunityAdmin">
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
        <br v-if="communityDetails.repositories">
        <div class="row text-center" v-if="communityDetails.repositories">
          <div class="col">
            <b-btn variant="primary" v-b-toggle.communityRepositoriesCollapse>
              <i class="fa fa-cubes" aria-hidden="true"></i> {{ $t('mission.repository.list') }}
            </b-btn>
            <b-collapse id="communityRepositoriesCollapse">
              <div v-if="communityDetails.repositories.length === 0">
                <br>
                <span class="font-italic text-muted">{{ $t('mission.repository.list.empty') }}</span>
              </div>
              <div v-for="(chunk, chunkIndex) in communityRepositoryChunks" :key="chunk">
                <br>
                <div class="row">
                  <div class="col" v-for="(communityRepository, index) in chunk" :key="communityRepository">
                    <div v-if="communityRepository.name" class="row justify-content-center">
                      <div class="col-4 font-weight-bold text-left">{{ $t('mission.repository.name') }}</div>
                      <div class="col-4">{{ communityRepository.name }}</div>
                    </div>
                    <div class="row justify-content-center">
                      <div class="col-4 font-weight-bold text-left">{{ $t('mission.repository.url') }}</div>
                      <div class="col-4 word-wrap">
                        <span v-if="communityRepository.url">
                          <a v-if="communityRepository.kind === 'arma3sync'" :href="communityRepository.url" @click.prevent="$copyText(communityRepository.url)">{{ communityRepository.url }}</a>
                          <a v-else :href="communityRepository.url">{{ communityRepository.url }}</a>
                        </span>
                        <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <div class="col-4 font-weight-bold text-left">{{ $t('mission.repository.notes') }}</div>
                      <div class="col-4 word-wrap">
                        <span v-if="communityRepository.notes" v-html="communityRepository.notes"></span>
                        <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <b-btn size="sm" v-clipboard:copy="communityRepository.url" :disabled="!communityRepository.url">
                        <i class="fa fa-clipboard" aria-hidden="true"></i> {{ $t('button.copy') }}
                      </b-btn>
                      <span v-if="canEditCommunity">&nbsp;</span>
                      <b-btn v-if="canEditCommunity" size="sm" variant="danger" @click="removeCommunityRepository(chunkIndex * 2 + index)">
                        <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.remove') }}
                      </b-btn>
                    </div>
                  </div>
                  <div class="col" v-if="chunk.length === 1"></div>
                </div>
              </div>
              <div v-if="canEditCommunity">
                <br>
                <div class="row">
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.name.required')" :state="communityRepositoryCreateNameState" :feedback="communityRepositoryCreateNameFeedback" :description="$t('mission.repository.name.description')">
                      <b-form-input v-model="communityRepositoryCreateData.name" type="text"></b-form-input>
                    </b-form-fieldset>
                  </div>
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.kind')" :state="communityRepositoryCreateKindState" :feedback="communityRepositoryCreateKindFeedback" :description="$t('mission.repository.kind.description')">
                      <b-form-select v-model="communityRepositoryCreateData.kind" :options="communityRepositoryCreateKindOptions" class="mb-3"></b-form-select>
                    </b-form-fieldset>
                  </div>
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.url.optional')" :state="communityRepositoryCreateUrlState" :feedback="communityRepositoryCreateUrlFeedback" :description="$t('mission.repository.url.description')">
                      <b-form-input v-model="communityRepositoryCreateData.url" type="text"></b-form-input>
                    </b-form-fieldset>
                  </div>
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.notes.optional')" :state="communityRepositoryCreateNotesState" :feedback="communityRepositoryCreateNotesFeedback" :description="$t('mission.repository.notes.description')">
                      <b-form-input v-model="communityRepositoryCreateData.notes" textarea></b-form-input>
                    </b-form-fieldset>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <b-btn size="sm" variant="success" @click="createCommunityRepository">
                      <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.add') }}
                    </b-btn>
                  </div>
                </div>
              </div>
            </b-collapse>
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
      },
      communityRepositoryCreateData: {
        name: null,
        kind: null,
        url: null,
        notes: null
      },
      communityRepositoryCreateKindOptions: [
        { text: this.$t('mission.repository.kind.arma3sync'), value: 'arma3sync' },
        { text: this.$t('mission.repository.kind.other'), value: 'other' }
      ],
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
    communityRepositoryChunks() {
      if (_.isNil(this.communityDetails)) {
        return []
      }

      return _.chunk(this.communityDetails.repositories, 2);
    },
    communityRepositoryCreateKindFeedback() {
      return _.isEmpty(this.communityRepositoryCreateData.kind) ? this.$t('mission.feedback.repository.kind') : ''
    },
    communityRepositoryCreateKindState() {
      return _.isEmpty(this.communityRepositoryCreateData.kind) ? 'danger' : 'success'
    },
    communityRepositoryCreateNameFeedback() {
      return _.isEmpty(this.communityRepositoryCreateData.name) ? this.$t('mission.feedback.repository.name') : ''
    },
    communityRepositoryCreateNameState() {
      return _.isEmpty(this.communityRepositoryCreateData.name) ? 'danger' : 'success'
    },
    communityRepositoryCreateNotesFeedback() {
      if (_.isEmpty(this.communityRepositoryCreateData.url) && _.isEmpty(this.communityRepositoryCreateData.notes)) {
        return this.$t('mission.feedback.repository.urlOrNotes')
      }

      return ''
    },
    communityRepositoryCreateNotesState() {
      if (_.isEmpty(this.communityRepositoryCreateData.url) && _.isEmpty(this.communityRepositoryCreateData.notes)) {
        return 'danger'
      }

      return 'success'
    },
    communityRepositoryCreateUrlFeedback() {
      if (_.isEmpty(this.communityRepositoryCreateData.url) && _.isEmpty(this.communityRepositoryCreateData.notes)) {
        return this.$t('mission.feedback.repository.urlOrNotes')
      } else if (this.communityRepositoryCreateData.kind === 'arma3sync' && _.isEmpty(this.communityRepositoryCreateData.url)) {
        return this.$t('mission.feedback.repository.url.arma3sync')
      }  else if (_.isEmpty(this.communityRepositoryCreateData.url)) {
        return ''
      }

      return this.isCommunityRepositoryUrlValid ? '' : this.$t('mission.feedback.repository.url')
    },
    communityRepositoryCreateUrlState() {
      if (_.isEmpty(this.communityRepositoryCreateData.url) && _.isEmpty(this.communityRepositoryCreateData.notes)) {
        return 'danger'
      } else if (this.communityRepositoryCreateData.kind === 'arma3sync' && _.isEmpty(this.communityRepositoryCreateData.url)) {
        return 'danger'
      } else if (_.isEmpty(this.communityRepositoryCreateData.url)) {
        return 'success'
      }

      return this.isCommunityRepositoryUrlValid ? 'success' : 'danger'
    },
    isCommunityAdmin() {
      return this.$acl.can(['admin.community'])
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
    isCommunityRepositoryUrlValid() {
      // Taken from: https://stackoverflow.com/a/5717133 @ 2017-08-04 09:43
      const urlPattern = /^((https?|ftp):\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
      return urlPattern.test(this.communityRepositoryCreateData.url)
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
    createCommunityRepository() {
      if (_.isEmpty(this.communityRepositoryCreateData.kind) || _.isEmpty(this.communityRepositoryCreateData.name)) {
        return
      } else if (_.isEmpty(this.communityRepositoryCreateData.url) && _.isEmpty(this.communityRepositoryCreateData.notes)) {
        return
      }

      const repositories = _.clone(this.communityDetails.repositories)
      repositories.push({
        name: this.communityRepositoryCreateData.name,
        kind: this.communityRepositoryCreateData.kind,
        url: _.isEmpty(this.communityRepositoryCreateData.url) ? null : this.communityRepositoryCreateData.url,
        notes: _.isEmpty(this.communityRepositoryCreateData.notes) ? null : this.communityRepositoryCreateData.notes,
      })

      this.$store.dispatch('editCommunity', {
        communitySlug: this.$route.params.communitySlug,
        updatedCommunityDetails: {
          repositories
        }
      })

      this.communityRepositoryCreateData = {
        name: null,
        kind: null,
        url: null,
        notes: null
      }
    },
    deleteCommunity() {
      this.$store.dispatch('deleteCommunity', { communitySlug: this.$route.params.communitySlug, communityName: this.communityDetails.name })
    },
    removeCommunityRepository(index) {
      const repositories = _.clone(this.communityDetails.repositories)
      repositories.splice(index, 1)

      this.$store.dispatch('editCommunity', {
        communitySlug: this.$route.params.communitySlug,
        updatedCommunityDetails: {
          repositories
        }
      })
    }
  },
  watch: {
    communityApplicationsFilter(val) {
      this.$store.dispatch('filterCommunityApplications', { filter: val, communitySlug: this.$route.params.communitySlug })
    }
  }
}
</script>
