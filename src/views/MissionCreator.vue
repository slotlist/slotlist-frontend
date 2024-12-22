<template>
  <div>
    <div>
      <h3>{{ $t('mission.creator.title') }}</h3>
    </div>
    <div>
      <b-form @submit.stop.prevent="submitMissionCreate">
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.title')" :state="missionCreateTitleState" :feedback="missionCreateTitleFeedback" :description="$t('mission.title.description')">
              <b-form-input v-model="missionCreateTitle" type="text" required :formatter="missionCreateTitleFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.slug')" :state="missionCreateSlugState" :feedback="missionCreateSlugFeedback" :description="$t('mission.slug.description')">
              <b-input-group :right="missionCreateSlugAvailable">
                <b-form-input v-model="missionCreateSlug" type="text" required :formatter="missionCreateSlugFormatter" lazy-formatter></b-form-input>
              </b-input-group>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.description')" :state="missionCreateDescriptionState" :feedback="missionCreateDescriptionFeedback" :description="$t('mission.description.description')">
              <b-form-input v-model="missionCreateDescription" textarea required></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.detailedDescription')" :state="missionCreateDetailedDescriptionState" :feedback="missionCreateDetailedDescriptionFeedback" :description="$t('mission.detailedDescription.description')">
              <quill-editor v-model="missionCreateDetailedDescription" ref="missionCreateDetailedDescriptionEditor" :options="descriptionEditorOptions" required></quill-editor>
              <editor-explanation></editor-explanation>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.collapsedDescription.optional')" state="success" :description="$t('mission.collapsedDescription.description')">
              <quill-editor v-model="missionCreatecollapsedDescription" ref="missionCreatecollapsedDescriptionEditor" :options="descriptionEditorOptions"></quill-editor>
              <editor-explanation></editor-explanation>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.slottingTime')" :state="missionCreateSlottingTimeState" :feedback="missionCreateSlottingTimeFeedback" :description="$t('mission.slottingTime.description')">
              <b-form-input v-model="missionCreateSlottingTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionCreateTimeFormatter" @blur="missionCreateSlottingTimeBlur" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.startTime')" :state="missionCreateStartTimeState" :feedback="missionCreateStartTimeFeedback" :description="$t('mission.startTime.description')">
              <b-form-input v-model="missionCreateStartTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.endTime')" :state="missionCreateEndTimeState" :feedback="missionCreateEndTimeFeedback" :description="$t('mission.endTime.description')">
              <b-form-input v-model="missionCreateEndTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.briefingTime')" :state="missionCreateBriefingTimeState" :feedback="missionCreateBriefingTimeFeedback" :description="$t('mission.briefingTime.description')">
              <b-form-input v-model="missionCreateBriefingTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionCreateTimeFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.techSupport.optional')" :state="missionCreateTechSupportState" :feedback="missionCreateTechSupportFeedback" :description="$t('mission.techSupport.description')">
              <quill-editor v-model="missionCreateTechSupport" ref="missionCreateTechSupportEditor" :options="editorOptions"></quill-editor>
              <editor-explanation></editor-explanation>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.rules.optional')" :state="missionCreateRulesState" :feedback="missionCreateRulesFeedback" :description="$t('mission.rules.description')">
              <quill-editor v-model="missionCreateRules" ref="missionCreateRulesEditor" :options="editorOptions"></quill-editor>
              <editor-explanation></editor-explanation>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.gameServer.hostname.optional')" :state="missionCreateGameServerHostnameState" :feedback="missionCreateGameServerHostnameFeedback" :description="$t('mission.gameServer.hostname.description')">
              <b-form-input v-model="missionCreateGameServerHostname" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.voiceComms.hostname.optional')" :state="missionCreateVoiceCommsHostnameState" :feedback="missionCreateVoiceCommsHostnameFeedback" :description="$t('mission.voiceComms.hostname.description')">
              <b-form-input v-model="missionCreateVoiceCommsHostname" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.gameServer.port.optional')" :state="missionCreateGameServerPortState" :feedback="missionCreateGameServerPortFeedback" :description="$t('mission.gameServer.port.description')">
              <b-form-input v-model="missionCreateGameServerPort" type="number" min="0" max="65535"></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.voiceComms.port.optional')" :state="missionCreateVoiceCommsPortState" :feedback="missionCreateVoiceCommsPortFeedback" :description="$t('mission.voiceComms.port.description')">
              <b-form-input v-model="missionCreateVoiceCommsPort" type="number" min="0" max="65535"></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.gameServer.name.optional')" state="success" :description="$t('mission.gameServer.name.description')">
              <b-form-input v-model="missionCreateGameServerName" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.voiceComms.name.optional')" state="success" :description="$t('mission.voiceComms.name.description')">
              <b-form-input v-model="missionCreateVoiceCommsName" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.gameServer.password.optional')" state="success" :description="$t('mission.gameServer.password.description')">
              <b-form-input v-model="missionCreateGameServerPassword" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('mission.voiceComms.password.optional')" state="success" :description="$t('mission.voiceComms.password.description')">
              <b-form-input v-model="missionCreateVoiceCommsPassword" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row" v-if="(communityGameServers && communityGameServers.length > 0) || (communityVoiceComms && communityVoiceComms.length > 0)">
          <div class="col">
            <b-form-fieldset v-if="communityGameServers && communityGameServers.length > 0" :label="$t('community.gameServers')" state="success" :description="$t('community.gameServers.description')">
              <b-form-select v-model="missionCreateCommunityGameServersSelected" :options="missionCreateCommunityGameServers" class="mb-3"></b-form-select>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset v-if="communityVoiceComms && communityVoiceComms.length > 0" :label="$t('community.voiceComms')" state="success" :description="$t('community.voiceComms.description')">
              <b-form-select v-model="missionCreateCommunityVoiceCommsSelected" :options="missionCreateCommunityVoiceComms" class="mb-3"></b-form-select>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col text-center" v-if="user.community">
            <b-form-fieldset :label="$t('mission.creator.addToCommunity')" :state="missionCreateAddToCommunityState" :feedback="missionCreateAddToCommunityFeedback" :description="missionCreateAddToCommunityDescription">
              <b-form-checkbox v-model="missionCreateAddToCommunity"></b-form-checkbox>
            </b-form-fieldset>
          </div>
          <div class="col text-center">
            <b-form-fieldset :label="$t('mission.slotsAutoAssignable')" state="success" :description="$t('mission.slotsAutoAssignable.description')">
              <b-form-checkbox v-model="missionCreateSlotsAutoAssignable"></b-form-checkbox>
            </b-form-fieldset>
          </div>
        </div>
        <span class="text-success" style="font-size: 1rem; font-weight: 400; line-height: 1.5">{{ $t('mission.requiredDLCs') }}</span>
        <div class="row">
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.aow"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/aow.png" width="16px" alt="Art of War" /> {{ $t('mission.requiredDLCs.aow') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.apex"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/apex.png" width="16px" alt="Apex" /> {{ $t('mission.requiredDLCs.apex') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.contact"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/contact.png" width="16px" alt="Contact" /> {{ $t('mission.requiredDLCs.contact') }}</b-form-checkbox>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.csla"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/csla.png" width="16px" alt="CSLA Iron Curtain" /> {{ $t('mission.requiredDLCs.csla') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.gm"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/gm.png" width="16px" alt="Global Mobilization" /> {{ $t('mission.requiredDLCs.gm') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.helicopters"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/helicopters.png" width="16px" alt="Helicopters" /> {{ $t('mission.requiredDLCs.helicopters') }}</b-form-checkbox>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.jets"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/jets.png" width="16px" alt="Jets" /> {{ $t('mission.requiredDLCs.jets') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.karts"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/karts.png" width="16px" alt="Karts" /> {{ $t('mission.requiredDLCs.karts') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.lawsofwar"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/laws-of-war.png" width="16px" alt="Laws of War" /> {{ $t('mission.requiredDLCs.laws-of-war') }}</b-form-checkbox>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.marksmen"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/marksmen.png" width="16px" alt="Marksmen" /> {{ $t('mission.requiredDLCs.marksmen') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.tacops"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tac-ops.png" width="16px" alt="Tac-Ops" /> {{ $t('mission.requiredDLCs.tac-ops') }}</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.tanks"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tanks.png" width="16px" alt="Tanks" /> {{ $t('mission.requiredDLCs.tanks') }}</b-form-checkbox>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-checkbox v-model="missionCreateRequiredDLCs.vn"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/vn.png" width="16px" alt="S.O.G. Prairie Fire" /> {{ $t('mission.requiredDLCs.vn') }}</b-form-checkbox>
          </div>
          <div class="col">
              <b-form-checkbox v-model="missionCreateRequiredDLCs.ef"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/ef.png" width="16px" alt="Expeditionary Forces" /> {{ $t('mission.requiredDLCs.ef') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionCreateRequiredDLCs.rf"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/rf.png" width="16px" alt="Reaction Forces" /> {{ $t('mission.requiredDLCs.rf') }}</b-form-checkbox>
            </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('mission.visibility')" :state="missionCreateVisibilityState" :feedback="missionCreateVisibilityFeedback" :description="$t('mission.visibility.description')">
              <b-form-select v-model="missionCreateVisibility" :options="missionCreateVisibilityOptions" class="mb-3" required></b-form-select>
            </b-form-fieldset>
          </div>
        </div>
      </b-form>
    </div>
    <div class="text-center">
      <b-btn variant="success" @click="submitMissionCreate">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import utils from '../utils'

export default {
  data() {
    return {
      descriptionEditorOptions: {
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': 1 }, { 'header': 2 }, { 'color': [] }],
            ['bold', 'italic'],
            [{ 'align': [] }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageResize: {
            modules: ['Resize', 'DisplaySize']
          }
        },
        theme: 'snow'
      },
      editorOptions: {
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': 1 }, { 'header': 2 }, { 'color': [] }],
            ['bold', 'italic'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageResize: {
            modules: ['Resize', 'DisplaySize']
          }
        },
        theme: 'snow'
      },
      missionCreateTitle: null,
      missionCreateSlug: null,
      missionCreateDescription: null,
      missionCreatecollapsedDescription: null,
      missionCreateDetailedDescription: null,
      missionCreateSlottingTime: null,
      missionCreateStartTime: null,
      missionCreateEndTime: null,
      missionCreateBriefingTime: null,
      missionCreateTechSupport: null,
      missionCreateRules: null,
      missionCreateGameServerHostname: null,
      missionCreateGameServerName: null,
      missionCreateGameServerPort: null,
      missionCreateGameServerPassword: null,
      missionCreateVoiceCommsHostname: null,
      missionCreateVoiceCommsName: null,
      missionCreateVoiceCommsPort: null,
      missionCreateVoiceCommsPassword: null,
      missionCreateCommunityGameServersSelected: null,
      missionCreateCommunityVoiceCommsSelected: null,
      missionCreateAddToCommunity: true,
      missionCreateSlotsAutoAssignable: false,
      missionCreateRequiredDLCs: {
        aow: false,
        apex: false,
        contact: false,
        csla: false,
        ef: false,
        gm: false,
        helicopters: false,
        jets: false,
        karts: false,
        lawsofwar: false,
        marksmen: false,
        rf: false,
        tacops: false,
        tanks: false,
        vn: false
      },
      missionCreateVisibility: 'hidden'
    }
  },
  computed: {
    communityGameServers() {
      return this.$store.getters.communityGameServers
    },
    communityVoiceComms() {
      return this.$store.getters.communityVoiceComms
    },
    user() {
      return this.$store.getters.user
    },
    missionCreateTitleState() {
      return _.isNil(this.missionCreateTitle) || _.isEmpty(this.missionCreateTitle) ? 'danger' : 'success'
    },
    missionCreateTitleFeedback() {
      return _.isNil(this.missionCreateTitle) || _.isEmpty(this.missionCreateTitle) ? this.$t('mission.feedback.title') : ''
    },
    missionCreateSlugState() {
      if (_.isNil(this.missionCreateSlug) || _.isEmpty(this.missionCreateSlug)) {
        return 'danger'
      } else if (this.checkingMissionSlugAvailability) {
        return 'warning'
      } else if (!this.missionSlugAvailable) {
        return 'danger'
      }

      return 'success'
    },
    missionCreateSlugFeedback() {
      if (_.isNil(this.missionCreateSlug) || _.isEmpty(this.missionCreateSlug)) {
        return this.$t('mission.feedback.slug')
      } else if (this.checkingMissionSlugAvailability) {
        return this.$t('mission.feedback.slug.checking')
      } else if (!this.missionSlugAvailable) {
        return this.$t('mission.feedback.slug.notAvailable')
      }

      return ''
    },
    missionCreateSlugAvailable() {
      if (this.checkingMissionSlugAvailability) {
        return '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>'
      } else if (this.missionSlugAvailable) {
        return '<i class="fa fa-check" aria-hidden="true"></i>'
      }

      return '<i class="fa fa-close" aria-hidden="true"></i>'
    },
    checkingMissionSlugAvailability() {
      return this.$store.getters.checkingMissionSlugAvailability
    },
    missionSlugAvailable() {
      return this.$store.getters.missionSlugAvailable
    },
    missionCreateAddToCommunityDescription() {
      return this.$t('mission.creator.addToCommunity.description', { communityInfo: `[${this.user.community.tag}] ${this.user.community.name}` })
    },
    missionCreateDescriptionState() {
      return _.isNil(this.missionCreateDescription) || _.isEmpty(this.missionCreateDescription) ? 'danger' : 'success'
    },
    missionCreateDescriptionFeedback() {
      return _.isNil(this.missionCreateDescription) || _.isEmpty(this.missionCreateDescription) ? this.$t('mission.feedback.description') : ''
    },
    missionCreateDetailedDescriptionState() {
      return _.isNil(this.missionCreateDetailedDescription) || _.isEmpty(this.missionCreateDetailedDescription) ? 'danger' : 'success'
    },
    missionCreateDetailedDescriptionFeedback() {
      return _.isNil(this.missionCreateDetailedDescription) || _.isEmpty(this.missionCreateDetailedDescription) ? this.$t('mission.feedback.detailedDescription') : ''
    },
    missionCreateCommunityGameServers() {
      if (_.isNil(this.communityGameServers) || _.isEmpty(this.communityGameServers)) {
        return []
      }

      let servers = []
      _.each(this.communityGameServers, (gameServer, index) => {
        let name = _.isNil(gameServer.name) ? '' : ` - ${gameServer.name}`
        servers.push({
          text: `${gameServer.hostname}:${gameServer.port}${name}`,
          value: index
        })
      })

      return servers
    },
    missionCreateGameServerHostnameFeedback() {
      return ((_.isNil(this.missionCreateGameServerHostname) || _.isEmpty(this.missionCreateGameServerHostname)) &&
      (!_.isNil(this.missionCreateGameServerPort) && !_.isEmpty(this.missionCreateGameServerPort))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionCreateGameServerHostnameState() {
      return ((_.isNil(this.missionCreateGameServerHostname) || _.isEmpty(this.missionCreateGameServerHostname)) &&
      (!_.isNil(this.missionCreateGameServerPort) && !_.isEmpty(this.missionCreateGameServerPort))) ? 'danger' : 'success'
    },
    missionCreateGameServerPortFeedback() {
      const port = parseInt(this.missionCreateGameServerPort);
      if (port < 0 || port > 65535) {
        return this.$t('mission.feedback.serverInfo.portRange')
      }

      return ((_.isNil(this.missionCreateGameServerPort) || _.isEmpty(this.missionCreateGameServerPort)) &&
      (!_.isNil(this.missionCreateGameServerHostname) && !_.isEmpty(this.missionCreateGameServerHostname))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionCreateGameServerPortState() {
      const port = parseInt(this.missionCreateGameServerPort);
      if (port < 0 || port > 65535) {
        return 'danger'
      }

      return ((_.isNil(this.missionCreateGameServerPort) || _.isEmpty(this.missionCreateGameServerPort)) &&
      (!_.isNil(this.missionCreateGameServerHostname) && !_.isEmpty(this.missionCreateGameServerHostname))) ? 'danger' : 'success'
    },
    missionCreateCommunityVoiceComms() {
      if (_.isNil(this.communityVoiceComms) || _.isEmpty(this.communityVoiceComms)) {
        return []
      }

      let servers = []
      _.each(this.communityVoiceComms, (voiceComms, index) => {
        let name = _.isNil(voiceComms.name) ? '' : ` - ${voiceComms.name}`
        servers.push({
          text: `${voiceComms.hostname}:${voiceComms.port}${name}`,
          value: index
        })
      })

      return servers
    },
    missionCreateVoiceCommsHostnameFeedback() {
      return ((_.isNil(this.missionCreateVoiceCommsHostname) || _.isEmpty(this.missionCreateVoiceCommsHostname)) &&
      (!_.isNil(this.missionCreateVoiceCommsPort) && !_.isEmpty(this.missionCreateVoiceCommsPort))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionCreateVoiceCommsHostnameState() {
      return ((_.isNil(this.missionCreateVoiceCommsHostname) || _.isEmpty(this.missionCreateVoiceCommsHostname)) &&
      (!_.isNil(this.missionCreateVoiceCommsPort) && !_.isEmpty(this.missionCreateVoiceCommsPort))) ? 'danger' : 'success'
    },
    missionCreateVoiceCommsPortFeedback() {
      const port = parseInt(this.missionCreateVoiceCommsPort);
      if (port < 0 || port > 65535) {
        return this.$t('mission.feedback.serverInfo.portRange')
      }

      return ((_.isNil(this.missionCreateVoiceCommsPort) || _.isEmpty(this.missionCreateVoiceCommsPort)) &&
      (!_.isNil(this.missionCreateVoiceCommsHostname) && !_.isEmpty(this.missionCreateVoiceCommsHostname))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionCreateVoiceCommsPortState() {
      const port = parseInt(this.missionCreateVoiceCommsPort);
      if (port < 0 || port > 65535) {
        return 'danger'
      }

      return ((_.isNil(this.missionCreateVoiceCommsPort) || _.isEmpty(this.missionCreateVoiceCommsPort)) &&
      (!_.isNil(this.missionCreateVoiceCommsHostname) && !_.isEmpty(this.missionCreateVoiceCommsHostname))) ? 'danger' : 'success'
    },
    missionCreateSlottingTimeState() {
      return _.isNil(this.missionCreateSlottingTime) || _.isEmpty(this.missionCreateSlottingTime) || !moment(this.missionCreateSlottingTime).isValid() ? 'danger' : 'success'
    },
    missionCreateSlottingTimeFeedback() {
      return _.isNil(this.missionCreateSlottingTime) || _.isEmpty(this.missionCreateSlottingTime) || !moment(this.missionCreateSlottingTime).isValid() ? this.$t('mission.feedback.dateTime') : ''
    },
    missionCreateStartTimeState() {
      if (_.isNil(this.missionCreateStartTime) || _.isEmpty(this.missionCreateStartTime)) {
        return 'danger'
      }

      const startTime = moment(this.missionCreateStartTime)
      if (!startTime.isValid()) {
        return 'danger'
      }

      const slottingTime = moment(this.missionCreateSlottingTime)
      if (!slottingTime.isValid()) {
        return 'danger'
      }

      if (startTime < slottingTime) {
        return 'danger'
      }

      return 'success'
    },
    missionCreateStartTimeFeedback() {
      if (_.isNil(this.missionCreateStartTime) || _.isEmpty(this.missionCreateStartTime)) {
        return this.$t('mission.feedback.dateTime')
      }

      const startTime = moment(this.missionCreateStartTime)
      if (!startTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      const slottingTime = moment(this.missionCreateSlottingTime)
      if (!slottingTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      if (startTime < slottingTime) {
        return this.$t('mission.feedback.dateTime.afterSlotting')
      }

      return ''
    },
    missionCreateEndTimeState() {
      if (_.isNil(this.missionCreateEndTime) || _.isEmpty(this.missionCreateEndTime)) {
        return 'danger'
      }

      const endTime = moment(this.missionCreateEndTime)
      if (!endTime.isValid()) {
        return 'danger'
      }

      const startTime = moment(this.missionCreateStartTime)
      if (!startTime.isValid()) {
        return 'danger'
      }

      if (endTime < startTime) {
        return 'danger'
      }

      return 'success'
    },
    missionCreateEndTimeFeedback() {
      if (_.isNil(this.missionCreateEndTime) || _.isEmpty(this.missionCreateEndTime)) {
        return this.$t('mission.feedback.dateTime')
      }

      const endTime = moment(this.missionCreateEndTime)
      if (!endTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      const startTime = moment(this.missionCreateStartTime)
      if (!startTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      if (endTime < startTime) {
        return this.$t('mission.feedback.dateTime.afterStart')
      }

      return ''
    },
    missionCreateBriefingTimeState() {
      return _.isNil(this.missionCreateBriefingTime) || _.isEmpty(this.missionCreateBriefingTime) || !moment(this.missionCreateBriefingTime).isValid() ? 'danger' : 'success'
    },
    missionCreateBriefingTimeFeedback() {
      return _.isNil(this.missionCreateBriefingTime) || _.isEmpty(this.missionCreateBriefingTime) || !moment(this.missionCreateBriefingTime).isValid() ? this.$t('mission.feedback.dateTime') : ''
    },
    missionCreateTechSupportState() {
      return 'success'
    },
    missionCreateTechSupportFeedback() {
      return ''
    },
    missionCreateRulesState() {
      return 'success'
    },
    missionCreateRulesFeedback() {
      return ''
    },
    missionCreateAddToCommunityState() {
      return 'success'
    },
    missionCreateAddToCommunityFeedback() {
      return ''
    },
    missionCreateVisibilityState() {
      return _.isNil(this.missionCreateVisibility) || _.isEmpty(this.missionCreateVisibility) ? 'danger' : 'success'
    },
    missionCreateVisibilityFeedback() {
      return _.isNil(this.missionCreateVisibility) || _.isEmpty(this.missionCreateVisibility) ? this.$t('mission.feedback.visibility') : ''
    },
    missionCreateVisibilityOptions() {
      let options = [
        {
          text: this.$t('mission.visibility.hidden'),
          value: 'hidden'
        },
        {
          text: this.$t('mission.visibility.private'),
          value: 'private'
        },
        {
          text: this.$t('mission.visibility.public'),
          value: 'public'
        }
      ]

      if (!_.isNil(this.user.community)) {
        options = [
          {
            text: this.$t('mission.visibility.community'),
            value: 'community'
          },
          ...options
        ]
      }

      return options
    }
  },
  methods: {
    missionCreateTitleFormatter(val) {
      if (_.isNil(this.missionCreateSlug) || _.isEmpty(this.missionCreateSlug)) {
        this.missionCreateSlug = utils.slug(val)
        this.$store.dispatch('checkMissionSlugAvailability', this.missionCreateSlug)
      }
      return val
    },
    missionCreateSlottingTimeBlur() {
      if (_.isNil(this.missionCreateSlottingTime)) {
        return
      }

      if (_.isNil(this.missionCreateStartTime)) {
        this.missionCreateStartTime = this.missionCreateSlottingTime
      }
      if (_.isNil(this.missionCreateEndTime)) {
        this.missionCreateEndTime = this.missionCreateSlottingTime
      }
      if (_.isNil(this.missionCreateBriefingTime)) {
        this.missionCreateBriefingTime = this.missionCreateSlottingTime
      }
    },
    missionCreateSlugFormatter(val) {
      if (!_.isNil(this.missionCreateSlug) && !_.isEmpty(this.missionCreateSlug)) {
        this.$store.dispatch('checkMissionSlugAvailability', this.missionCreateSlug)
      }

      return val
    },
    missionCreateTimeFormatter(val) {
      return moment(val).format('Y-MM-DD HH:mm')
    },
    submitMissionCreate() {
      let gameServer = null
      const gameServerPort = parseInt(this.missionCreateGameServerPort)
      if (_.isString(this.missionCreateGameServerHostname) &&
      !_.isEmpty(this.missionCreateGameServerHostname) &&
      _.isFinite(gameServerPort) &&
      gameServerPort >= 0 &&
      gameServerPort <= 65535) {
        gameServer = {
          hostname: this.missionCreateGameServerHostname,
          port: gameServerPort,
          name: _.isString(this.missionCreateGameServerName) && !_.isEmpty(this.missionCreateGameServerName) ? this.missionCreateGameServerName : null,
          password: _.isString(this.missionCreateGameServerPassword) && !_.isEmpty(this.missionCreateGameServerPassword) ? this.missionCreateGameServerPassword : null
        }
      }

      let voiceComms = null
      const voiceCommsPort = parseInt(this.missionCreateVoiceCommsPort)
      if (_.isString(this.missionCreateVoiceCommsHostname) &&
      !_.isEmpty(this.missionCreateVoiceCommsHostname) &&
      _.isFinite(voiceCommsPort) &&
      voiceCommsPort >= 0 &&
      voiceCommsPort <= 65535) {
        voiceComms = {
          hostname: this.missionCreateVoiceCommsHostname,
          port: voiceCommsPort,
          name: _.isString(this.missionCreateVoiceCommsName) && !_.isEmpty(this.missionCreateVoiceCommsName) ? this.missionCreateVoiceCommsName : null,
          password: _.isString(this.missionCreateVoiceCommsPassword) && !_.isEmpty(this.missionCreateVoiceCommsPassword) ? this.missionCreateVoiceCommsPassword : null
        }
      }

      const missionRequiredDLCs = []
      _.each(_.keys(this.missionCreateRequiredDLCs), (dlc) => {
        if (!this.missionCreateRequiredDLCs[dlc]) {
          return
        }

        if (dlc === 'lawsofwar') {
          missionRequiredDLCs.push('laws-of-war')
        } else if (dlc === 'tacops') {
          missionRequiredDLCs.push('tac-ops')
        } else {
          missionRequiredDLCs.push(dlc)
        }
      })

      const missionDetails = {
        title: this.missionCreateTitle,
        slug: this.missionCreateSlug,
        description: this.missionCreateDescription,
        collapsedDescription: this.missionCreatecollapsedDescription,
        detailedDescription: this.missionCreateDetailedDescription,
        slottingTime: moment(this.missionCreateSlottingTime).utc().format(),
        startTime: moment(this.missionCreateStartTime).utc().format(),
        endTime: moment(this.missionCreateEndTime).utc().format(),
        briefingTime: moment(this.missionCreateBriefingTime).utc().format(),
        techSupport: this.missionCreateTechSupport,
        rules: this.missionCreateRules,
        gameServer,
        voiceComms,
        addToCommunity: this.missionCreateAddToCommunity,
        slotsAutoAssignable: this.missionCreateSlotsAutoAssignable,
        requiredDLCs: missionRequiredDLCs,
        visibility: this.missionCreateVisibility
      }

      if (_.isEmpty(missionDetails.collapsedDescription)) {
        missionDetails.collapsedDescription = null
      }
      if (_.isEmpty(missionDetails.techSupport)) {
        missionDetails.techSupport = null
      }
      if (_.isEmpty(missionDetails.rules)) {
        missionDetails.rules = null
      }

      this.$store.dispatch('createMission', missionDetails)
    }
  },
  watch: {
    missionCreateCommunityGameServersSelected(val) {
      const server = this.communityGameServers[val];
      if (_.isNil(server)) {
        return
      }

      this.missionCreateGameServerHostname = server.hostname
      this.missionCreateGameServerPort = `${server.port}`
      this.missionCreateGameServerName = server.name
      this.missionCreateGameServerPassword = server.password
    },
    missionCreateCommunityVoiceCommsSelected(val) {
      const server = this.communityVoiceComms[val];
      if (_.isNil(server)) {
        return
      }

      this.missionCreateVoiceCommsHostname = server.hostname
      this.missionCreateVoiceCommsPort = `${server.port}`
      this.missionCreateVoiceCommsName = server.name
      this.missionCreateVoiceCommsPassword = server.password
    }
  },
  created: function() {
    utils.setTitle(this.$t('mission.creator.title.browser'))

    if (!_.isNil(this.user) && !_.isNil(this.user.community)) {
      this.$store.dispatch('getCommunityServers', { communitySlug: this.user.community.slug })
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearCommunityServers')
  }
}
</script>
