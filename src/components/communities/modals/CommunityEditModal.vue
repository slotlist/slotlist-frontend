<template>
  <div>
    <b-modal ref="communityEditModal" id="communityEditModal" size="lg" :title="$t('community.modal.edit')" @show="setCommunityEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editCommunity">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('community.name')" :state="communityEditNameState" :feedback="communityEditNameFeedback">
                <b-form-input v-model="communityEditData.name" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('community.tag')" :state="communityEditTagState" :feedback="communityEditTagFeedback">
                <b-form-input v-model="communityEditData.tag" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('community.website.optional')" :state="communityEditWebsiteState" :feedback="communityEditWebsiteFeedback">
                <b-form-input v-model="communityEditData.website" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <hr class="my-4">
          <div class="row font-weight-bold">
            <div class="col col-12">{{ $t('community.gameServers') }}</div>
          </div>
          <br>
          <div class="row" v-if="communityEditData && communityEditData.gameServers">
            <div class="col">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th style="width: 35%">{{ $t('mission.serverInfo.hostname') }}</th>
                    <th style="width: 10%">{{ $t('mission.serverInfo.port') }}</th>
                    <th style="width: 30%">{{ $t('mission.serverInfo.name') }}</th>
                    <th style="width: 20%">{{ $t('mission.serverInfo.password') }}</th>
                    <th class="text-center" style="width: 5%">{{ $t('misc.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(gameServer, index) in communityEditData.gameServers" :key="`${gameServer.hostname}:${gameServer.port}`">
                    <td>{{ gameServer.hostname }}</td>
                    <td>{{ gameServer.port }}</td>
                    <td>
                      <span v-if="gameServer.name">{{ gameServer.name }}</span>
                      <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                    </td>
                    <td>
                      <span v-if="gameServer.password">{{ gameServer.password }}</span>
                      <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                    </td>
                    <td class="text-center">
                      <b-btn variant="danger" size="sm" @click="removeCommunityGameServer(index)">
                        <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
                      </b-btn>
                    </td>
                  </tr>
                </tbody>
                <tfoot v-show="communityEditData.gameServers.length >= 10">
                  <tr>
                    <th style="width: 35%">{{ $t('mission.serverInfo.hostname') }}</th>
                    <th style="width: 10%">{{ $t('mission.serverInfo.port') }}</th>
                    <th style="width: 30%">{{ $t('mission.serverInfo.name') }}</th>
                    <th style="width: 20%">{{ $t('mission.serverInfo.password') }}</th>
                    <th class="text-center" style="width: 5%">{{ $t('misc.actions') }}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.hostname')" :state="communityEditGameServerHostnameState" :feedback="communityEditGameServerHostnameFeedback" :description="$t('community.gameServers.hostname.description')">
                <b-form-input v-model="communityEditGameServer.hostname" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.port')" :state="communityEditGameServerPortState" :feedback="communityEditGameServerPortFeedback" :description="$t('community.gameServers.port.description')">
                <b-form-input v-model="communityEditGameServer.port" type="number" min="0" max="65535"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.name')" state="success" :description="$t('community.gameServers.name.description')">
                <b-form-input v-model="communityEditGameServer.name" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.password')" state="success" :description="$t('community.gameServers.password.description')">
                <b-form-input v-model="communityEditGameServer.password" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col text-center">
              <b-btn variant="primary" @click="addCommunityGameServer">
                <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.add') }}
              </b-btn>
            </div>
          </div>
          <hr class="my-4">
          <div class="row font-weight-bold">
            <div class="col col-12">{{ $t('community.voiceComms') }}</div>
          </div>
          <br>
          <div class="row" v-if="communityEditData && communityEditData.voiceComms">
            <div class="col">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th style="width: 35%">{{ $t('mission.serverInfo.hostname') }}</th>
                    <th style="width: 10%">{{ $t('mission.serverInfo.port') }}</th>
                    <th style="width: 30%">{{ $t('mission.serverInfo.name') }}</th>
                    <th style="width: 20%">{{ $t('mission.serverInfo.password') }}</th>
                    <th class="text-center" style="width: 5%">{{ $t('misc.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(voiceComms, index) in communityEditData.voiceComms" :key="`${voiceComms.hostname}:${voiceComms.port}`">
                    <td>{{ voiceComms.hostname }}</td>
                    <td>{{ voiceComms.port }}</td>
                    <td>
                      <span v-if="voiceComms.name">{{ voiceComms.name }}</span>
                      <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                    </td>
                    <td>
                      <span v-if="voiceComms.password">{{ voiceComms.password }}</span>
                      <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                    </td>
                    <td class="text-center">
                      <b-btn variant="danger" size="sm" @click="removeCommunityVoiceComms(index)">
                        <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
                      </b-btn>
                    </td>
                  </tr>
                </tbody>
                <tfoot v-show="communityEditData.voiceComms.length >= 10">
                  <tr>
                    <th style="width: 35%">{{ $t('mission.serverInfo.hostname') }}</th>
                    <th style="width: 10%">{{ $t('mission.serverInfo.port') }}</th>
                    <th style="width: 30%">{{ $t('mission.serverInfo.name') }}</th>
                    <th style="width: 20%">{{ $t('mission.serverInfo.password') }}</th>
                    <th class="text-center" style="width: 5%">{{ $t('misc.actions') }}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.hostname')" :state="communityEditVoiceCommsHostnameState" :feedback="communityEditVoiceCommsHostnameFeedback" :description="$t('community.voiceComms.hostname.description')">
                <b-form-input v-model="communityEditVoiceComms.hostname" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.port')" :state="communityEditVoiceCommsPortState" :feedback="communityEditVoiceCommsPortFeedback" :description="$t('community.voiceComms.port.description')">
                <b-form-input v-model="communityEditVoiceComms.port" type="number" min="0" max="65535"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.name')" state="success" :description="$t('community.voiceComms.name.description')">
                <b-form-input v-model="communityEditVoiceComms.name" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.serverInfo.password')" state="success" :description="$t('community.voiceComms.password.description')">
                <b-form-input v-model="communityEditVoiceComms.password" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col text-center">
              <b-btn variant="primary" @click="addCommunityVoiceComms">
                <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.add') }}
              </b-btn>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Community edit actions">
          <b-btn variant="success" @click="editCommunity">
            <i class="fa fa-save" aria-hidden="true"></i> {{ $t('button.save') }}
          </b-btn>
          <b-btn variant="secondary" @click="hideCommunityEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  data() {
    return {
      communityEditData: {
        name: null,
        tag: null,
        website: null,
        gameServers: null,
        voiceComms: null
      },
      communityEditGameServer: {
        hostname: null,
        port: null,
        name: null,
        password: null
      },
      communityEditVoiceComms: {
        hostname: null,
        port: null,
        name: null,
        password: null
      }
    }
  },
  computed: {
    communityDetails() {
      return this.$store.getters.communityDetails
    },
    communityEditGameServerHostnameFeedback() {
      return ((_.isNil(this.communityEditGameServer.hostname) || _.isEmpty(this.communityEditGameServer.hostname)) &&
      (!_.isNil(this.communityEditGameServer.port) && !_.isEmpty(this.communityEditGameServer.port))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    communityEditGameServerHostnameState() {
      return ((_.isNil(this.communityEditGameServer.hostname) || _.isEmpty(this.communityEditGameServer.hostname)) &&
      (!_.isNil(this.communityEditGameServer.port) && !_.isEmpty(this.communityEditGameServer.port))) ? 'danger' : 'success'
    },
    communityEditGameServerPortFeedback() {
      const port = parseInt(this.communityEditGameServer.port);
      if (port < 0 || port > 65535) {
        return this.$t('mission.feedback.serverInfo.portRange')
      }

      return ((_.isNil(this.communityEditGameServer.port) || _.isEmpty(this.communityEditGameServer.port)) &&
      (!_.isNil(this.communityEditGameServer.hostname) && !_.isEmpty(this.communityEditGameServer.hostname))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    communityEditGameServerPortState() {
      const port = parseInt(this.communityEditGameServer.port);
      if (port < 0 || port > 65535) {
        return 'danger'
      }

      return ((_.isNil(this.communityEditGameServer.port) || _.isEmpty(this.communityEditGameServer.port)) &&
      (!_.isNil(this.communityEditGameServer.hostname) && !_.isEmpty(this.communityEditGameServer.hostname))) ? 'danger' : 'success'
    },
    communityEditNameFeedback() {
      return _.isNil(this.communityEditData.name) || _.isEmpty(this.communityEditData.name) ? this.$t('community.creator.feedback.name') : ''
    },
    communityEditNameState() {
      return _.isNil(this.communityEditData.name) || _.isEmpty(this.communityEditData.name) ? 'danger' : 'success'
    },
    communityEditTagFeedback(proerty) {
      return _.isNil(this.communityEditData.tag) || _.isEmpty(this.communityEditData.tag) ? this.$t('community.creator.feedback.tag') : ''
    },
    communityEditTagState() {
      return _.isNil(this.communityEditData.tag) || _.isEmpty(this.communityEditData.tag) ? 'danger' : 'success'
    },
    communityEditVoiceCommsHostnameFeedback() {
      return ((_.isNil(this.communityEditVoiceComms.hostname) || _.isEmpty(this.communityEditVoiceComms.hostname)) &&
      (!_.isNil(this.communityEditVoiceComms.port) && !_.isEmpty(this.communityEditVoiceComms.port))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    communityEditVoiceCommsHostnameState() {
      return ((_.isNil(this.communityEditVoiceComms.hostname) || _.isEmpty(this.communityEditVoiceComms.hostname)) &&
      (!_.isNil(this.communityEditVoiceComms.port) && !_.isEmpty(this.communityEditVoiceComms.port))) ? 'danger' : 'success'
    },
    communityEditVoiceCommsPortFeedback() {
      const port = parseInt(this.communityEditVoiceComms.port);
      if (port < 0 || port > 65535) {
        return this.$t('mission.feedback.serverInfo.portRange')
      }

      return ((_.isNil(this.communityEditVoiceComms.port) || _.isEmpty(this.communityEditVoiceComms.port)) &&
      (!_.isNil(this.communityEditVoiceComms.hostname) && !_.isEmpty(this.communityEditVoiceComms.hostname))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    communityEditVoiceCommsPortState() {
      const port = parseInt(this.communityEditVoiceComms.port);
      if (port < 0 || port > 65535) {
        return 'danger'
      }

      return ((_.isNil(this.communityEditVoiceComms.port) || _.isEmpty(this.communityEditVoiceComms.port)) &&
      (!_.isNil(this.communityEditVoiceComms.hostname) && !_.isEmpty(this.communityEditVoiceComms.hostname))) ? 'danger' : 'success'
    },
    communityEditWebsiteFeedback() {
      if (_.isNil(this.communityEditData.website) || _.isEmpty(this.communityEditData.website)) {
        return ''
      }

      return this.isCommunityEditWebsiteValidUrl ? '' : this.$t('community.creator.feedback.website')
    },
    communityEditWebsiteState() {
      if (_.isNil(this.communityEditData.website) || _.isEmpty(this.communityEditData.website)) {
        return 'success'
      }

      return this.isCommunityEditWebsiteValidUrl ? 'success' : 'danger'
    },
    isCommunityEditWebsiteValidUrl() {
      // Taken from: https://stackoverflow.com/a/5717133 @ 2017-08-04 09:43
      const urlPattern = /^((https?|ftp):\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
      return urlPattern.test(this.communityEditData.website)
    },
  },
  methods: {
    addCommunityGameServer() {
      if (_.isNil(this.communityEditGameServer.hostname) ||
      _.isEmpty(this.communityEditGameServer.hostname) ||
      _.isNil(this.communityEditGameServer.port) ||
      _.isEmpty(this.communityEditGameServer.port)) {
        return
      }

      if (_.isNil(this.communityEditData.gameServers)) {
        this.communityEditData.gameServers = []
      }

      this.communityEditData.gameServers.push({
        hostname: this.communityEditGameServer.hostname,
        port: this.communityEditGameServer.port,
        name: _.isEmpty(this.communityEditGameServer.name) ? null : this.communityEditGameServer.name,
        password: _.isEmpty(this.communityEditGameServer.password) ? null : this.communityEditGameServer.password
      })

      this.communityEditGameServer = {
        hostname: null,
        port: null,
        name: null,
        password: null
      }
    },
    addCommunityVoiceComms() {
      if (_.isNil(this.communityEditVoiceComms.hostname) ||
      _.isEmpty(this.communityEditVoiceComms.hostname) ||
      _.isNil(this.communityEditVoiceComms.port) ||
      _.isEmpty(this.communityEditVoiceComms.port)) {
        return
      }

      if (_.isNil(this.communityEditData.voiceComms)) {
        this.communityEditData.voiceComms = []
      }

      this.communityEditData.voiceComms.push({
        hostname: this.communityEditVoiceComms.hostname,
        port: this.communityEditVoiceComms.port,
        name: _.isEmpty(this.communityEditVoiceComms.name) ? null : this.communityEditVoiceComms.name,
        password: _.isEmpty(this.communityEditVoiceComms.password) ? null : this.communityEditVoiceComms.password
      })

      this.communityEditVoiceComms = {
        hostname: null,
        port: null,
        name: null,
        password: null
      }
    },
    editCommunity() {
      if (_.isEmpty(this.communityEditData.name) || _.isEmpty(this.communityEditData.tag)) {
        return
      }

      if (_.isEmpty(this.communityEditData.website)) {
        this.communityEditData.website = null
      }

      const updatedCommunityDetails = {}
      _.each(this.communityEditData, (value, key) => {
        if (!_.isEqual(value, this.communityDetails[key])) {
          updatedCommunityDetails[key] = value
        }
      })

      this.hideCommunityEditModal()

      if (_.isEmpty(updatedCommunityDetails)) {
        return this.$store.dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'warning',
          alertMessage: `<i class="fa fa-warning" aria-hidden="true"></i> ${this.$t('community.noChanges')}`
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
    removeCommunityGameServer(index) {
      this.communityEditData.gameServers.splice(index, 1)
    },
    removeCommunityVoiceComms(index) {
      this.communityEditData.voiceComms.splice(index, 1)
    },
    setCommunityEditData() {
      this.communityEditData = {
        name: this.communityDetails.name,
        tag: this.communityDetails.tag,
        website: this.communityDetails.website,
        gameServers: _.isNil(this.communityDetails.gameServers) ? [] : _.clone(this.communityDetails.gameServers),
        voiceComms: _.isNil(this.communityDetails.voiceComms) ? [] : _.clone(this.communityDetails.voiceComms)
      }
    }
  }
}
</script>










