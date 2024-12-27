<template>
  <div>
    <b-modal id="missionEditModal" ref="missionEditModal" size="lg" v-if="missionDetails" :title="$t('mission.modal.edit')" @shown="setMissionData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editMission">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.title')" :state="missionEditTitleState" :feedback="missionEditTitleFeedback" :description="$t('mission.title.description')">
                <b-form-input v-model="missionEditData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.description')" :state="missionEditDescriptionState" :feedback="missionEditDescriptionFeedback" :description="$t('mission.description.description')">
                <b-form-input v-model="missionEditData.description" textarea required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.detailedDescription')" :state="missionEditDetailedDescriptionState" :feedback="missionEditDetailedDescriptionFeedback" :description="$t('mission.detailedDescription.description')">
                <quill-editor v-model="missionEditData.detailedDescription" ref="missionEditDetailedDescriptionEditor" :options="missionEditDetailedDescriptionQuillEditorOptions" required></quill-editor>
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.collapsedDescription.optional')" state="success" :description="$t('mission.collapsedDescription.description')">
                <quill-editor v-model="missionEditData.collapsedDescription" ref="missionEditcollapsedDescriptionEditor" :options="missionEditDetailedDescriptionQuillEditorOptions"></quill-editor>
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slottingTime')" :state="missionEditSlottingTimeState" :feedback="missionEditSlottingTimeFeedback" :description="$t('mission.slottingTime.description')">
                <b-form-input v-model="missionEditData.slottingTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.startTime')" :state="missionEditStartTimeState" :feedback="missionEditStartTimeFeedback" :description="$t('mission.startTime.description')">
                <b-form-input v-model="missionEditData.startTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.endTime')" :state="missionEditEndTimeState" :feedback="missionEditEndTimeFeedback" :description="$t('mission.endTime.description')">
                <b-form-input v-model="missionEditData.endTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.briefingTime')" :state="missionEditBriefingTimeState" :feedback="missionEditBriefingTimeFeedback" :description="$t('mission.briefingTime.description')">
                <b-form-input v-model="missionEditData.briefingTime" type="text" required placeholder="YYYY-MM-DD HH:mm" :formatter="missionEditTimeFormatter" lazy-formatter></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.techSupport.optional')" state="success" :description="$t('mission.techSupport.description')">
                <quill-editor v-model="missionEditData.techSupport" ref="missionEditTechSupportEditor" :options="missionEditQuillEditorOptions"></quill-editor>
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.rules.optional')" state="success" :description="$t('mission.rules.description')">
                <quill-editor v-model="missionEditData.rules" ref="missionEditRulesEditor" :options="missionEditQuillEditorOptions"></quill-editor>
                <editor-explanation></editor-explanation>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.gameServer.hostname.optional')" :state="missionEditGameServerHostnameState" :feedback="missionEditGameServerHostnameFeedback" :description="$t('mission.gameServer.hostname.description')">
                <b-form-input v-model="missionEditData.gameServer.hostname" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.voiceComms.hostname.optional')" :state="missionEditVoiceCommsHostnameState" :feedback="missionEditVoiceCommsHostnameFeedback" :description="$t('mission.voiceComms.hostname.description')">
                <b-form-input v-model="missionEditData.voiceComms.hostname" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.gameServer.port.optional')" :state="missionEditGameServerPortState" :feedback="missionEditGameServerPortFeedback" :description="$t('mission.gameServer.port.description')">
                <b-form-input v-model="missionEditData.gameServer.port" type="number" min="0" max="65535"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.voiceComms.port.optional')" :state="missionEditVoiceCommsPortState" :feedback="missionEditVoiceCommsPortFeedback" :description="$t('mission.voiceComms.port.description')">
                <b-form-input v-model="missionEditData.voiceComms.port" type="number" min="0" max="65535"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.gameServer.name.optional')" state="success" :description="$t('mission.gameServer.name.description')">
                <b-form-input v-model="missionEditData.gameServer.name" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.voiceComms.name.optional')" state="success" :description="$t('mission.voiceComms.name.description')">
                <b-form-input v-model="missionEditData.voiceComms.name" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.gameServer.password.optional')" state="success" :description="$t('mission.gameServer.password.description')">
                <b-form-input v-model="missionEditData.gameServer.password" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.voiceComms.password.optional')" state="success" :description="$t('mission.voiceComms.password.description')">
                <b-form-input v-model="missionEditData.voiceComms.password" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row" v-if="(communityGameServers && communityGameServers.length > 0) || (communityVoiceComms && communityVoiceComms.length > 0)">
            <div class="col">
              <b-form-fieldset v-if="communityGameServers && communityGameServers.length > 0" :label="$t('community.gameServers')" state="success" :description="$t('community.gameServers.description')">
                <b-form-select v-model="missionEditCommunityGameServersSelected" :options="missionEditCommunityGameServers" class="mb-3"></b-form-select>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset v-if="communityVoiceComms && communityVoiceComms.length > 0" :label="$t('community.voiceComms')" state="success" :description="$t('community.voiceComms.description')">
                <b-form-select v-model="missionEditCommunityVoiceCommsSelected" :options="missionEditCommunityVoiceComms" class="mb-3"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.visibility')" state="success" :description="$t('mission.visibility.description')">
                <b-form-select v-model="missionEditData.visibility" :options="missionEditVisibilityOptions" class="mb-3" required></b-form-select>
              </b-form-fieldset>
            </div>
            <div class="col text-center">
              <b-form-fieldset :label="$t('mission.slotsAutoAssignable')" state="success" :description="$t('mission.slotsAutoAssignable.description')">
                <b-form-checkbox v-model="missionEditData.slotsAutoAssignable"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
          <span class="text-success" style="font-size: 1rem; font-weight: 400; line-height: 1.5">{{ $t('mission.requiredDLCs') }}</span>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.aow"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/aow.png" width="16px" alt="Art of War" /> {{ $t('mission.requiredDLCs.aow') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.apex"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/apex.png" width="16px" alt="Apex" /> {{ $t('mission.requiredDLCs.apex') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.contact"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/contact.png" width="16px" alt="Contact" /> {{ $t('mission.requiredDLCs.contact') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.csla"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/csla.png" width="16px" alt="CSLA Iron Curtain" /> {{ $t('mission.requiredDLCs.csla') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.gm"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/gm.png" width="16px" alt="Global Mobilization" /> {{ $t('mission.requiredDLCs.gm') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.helicopters"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/helicopters.png" width="16px" alt="Helicopters" /> {{ $t('mission.requiredDLCs.helicopters') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.jets"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/jets.png" width="16px" alt="Jets" /> {{ $t('mission.requiredDLCs.jets') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.karts"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/karts.png" width="16px" alt="Karts" /> {{ $t('mission.requiredDLCs.karts') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.lawsofwar"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/laws-of-war.png" width="16px" alt="Laws of War" /> {{ $t('mission.requiredDLCs.laws-of-war') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.marksmen"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/marksmen.png" width="16px" alt="Marksmen" /> {{ $t('mission.requiredDLCs.marksmen') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.tacops"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tac-ops.png" width="16px" alt="Tac-Ops" /> {{ $t('mission.requiredDLCs.tac-ops') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.tanks"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tanks.png" width="16px" alt="Tanks" /> {{ $t('mission.requiredDLCs.tanks') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.vn"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/vn.png" width="16px" alt="S.O.G. Prairie Fire" /> {{ $t('mission.requiredDLCs.vn') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.ef"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/ef.png" width="16px" alt="Expeditionary Forces" /> {{ $t('mission.requiredDLCs.ef') }}</b-form-checkbox>
            </div>
            <div class="col">
              <b-form-checkbox v-model="missionEditRequiredDLCs.rf"><img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/rf.png" width="16px" alt="Reaction Forces" /> {{ $t('mission.requiredDLCs.rf') }}</b-form-checkbox>
            </div>
          </div>
          <div class="row text-center">
            <div class="col">
              <b-form-fieldset :label="$t('notification.suppress')" state="success" :description="$t('notification.suppress.description')">
                <b-form-checkbox v-model="missionEditSuppressNotifications"></b-form-checkbox>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission edit actions">
          <b-btn variant="success" @click="editMission">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

export default {
  data() {
    return {
      missionEditData: {
        briefingTime: null,
        collapsedDescription: null,
        detailedDescription: null,
        endTime: null,
        gameServer: {
          hostname: null,
          port: null,
          name: null,
          password: null
        },
        rules: null,
        description: null,
        slotsAutoAssignable: false,
        slottingTime: null,
        startTime: null,
        techSupport: null,
        title: null,
        visibility: null,
        voiceComms: {
          hostname: null,
          port: null,
          name: null,
          password: null
        }
      },
      missionEditCommunityGameServersSelected: null,
      missionEditCommunityVoiceCommsSelected: null,
      missionEditRequiredDLCs: {
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
      missionEditSuppressNotifications: false,
      missionEditDetailedDescriptionQuillEditorOptions: {
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
      missionEditQuillEditorOptions: {
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
      }
    }
  },
  computed: {
    communityGameServers() {
      return this.$store.getters.communityGameServers
    },
    communityVoiceComms() {
      return this.$store.getters.communityVoiceComms
    },
    editorExplanationContent() {
      let content = '<img src="https://slotlist-info.storage.googleapis.com/images/static/editor-explanation.png"><ol>'
      _.times(8, (i) => {
        content += `<li>${this.$t('editor.explanation.' + (i + 1))}</li>`
      });
      content += `</ol><div class="text-center">${this.$t('editor.explanation.missing')}</div>`
      return content
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionEditBriefingTimeFeedback() {
      return _.isString(this.missionEditData.briefingTime)
        && !_.isEmpty(this.missionEditData.briefingTime)
        && moment(this.missionEditData.briefingTime).isValid ? '' : this.$t('mission.feedback.dateTime')
    },
    missionEditBriefingTimeState() {
      return _.isString(this.missionEditData.briefingTime)
        && !_.isEmpty(this.missionEditData.briefingTime)
        && moment(this.missionEditData.briefingTime).isValid ? 'success' : 'danger'
    },
    missionEditCommunityGameServers() {
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
    missionEditCommunityVoiceComms() {
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
    missionEditDetailedDescriptionFeedback() {
      return _.isString(this.missionEditData.detailedDescription) && !_.isEmpty(this.missionEditData.detailedDescription) ? '' : this.$t('mission.feedback.detailedDescription')
    },
    missionEditDetailedDescriptionState() {
      return _.isString(this.missionEditData.detailedDescription) && !_.isEmpty(this.missionEditData.detailedDescription) ? 'success' : 'danger'
    },
    missionEditEndTimeFeedback() {
      if (_.isNil(this.missionEditData.endTime) || _.isEmpty(this.missionEditData.endTime)) {
        return this.$t('mission.feedback.dateTime')
      }

      const endTime = moment(this.missionEditData.endTime)
      if (!endTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      const startTime = moment(this.missionEditData.startTime)
      if (!startTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      if (endTime < startTime) {
        return this.$t('mission.feedback.dateTime.afterStart')
      }

      return ''
    },
    missionEditEndTimeState() {
      if (_.isNil(this.missionEditData.endTime) || _.isEmpty(this.missionEditData.endTime)) {
        return 'danger'
      }

      const endTime = moment(this.missionEditData.endTime)
      if (!endTime.isValid()) {
        return 'danger'
      }

      const startTime = moment(this.missionEditData.startTime)
      if (!startTime.isValid()) {
        return 'danger'
      }

      if (endTime < startTime) {
        return 'danger'
      }

      return 'success'
    },
    missionEditDescriptionFeedback() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? '' : this.$t('mission.feedback.description')
    },
    missionEditDescriptionState() {
      return _.isString(this.missionEditData.description) && !_.isEmpty(this.missionEditData.description) ? 'success' : 'danger'
    },
    missionEditGameServerHostnameFeedback() {
      return ((_.isNil(this.missionEditData.gameServer.hostname) || _.isEmpty(this.missionEditData.gameServer.hostname)) &&
      (!_.isNil(this.missionEditData.gameServer.port) && !_.isEmpty(this.missionEditData.gameServer.port))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionEditGameServerHostnameState() {
      return ((_.isNil(this.missionEditData.gameServer.hostname) || _.isEmpty(this.missionEditData.gameServer.hostname)) &&
      (!_.isNil(this.missionEditData.gameServer.port) && !_.isEmpty(this.missionEditData.gameServer.port))) ? 'danger' : 'success'
    },
    missionEditGameServerPortFeedback() {
      const port = parseInt(this.missionEditData.gameServer.port);
      if (port < 0 || port > 65535) {
        return this.$t('mission.feedback.serverInfo.portRange')
      }

      return ((_.isNil(this.missionEditData.gameServer.port) || _.isEmpty(this.missionEditData.gameServer.port)) &&
      (!_.isNil(this.missionEditData.gameServer.hostname) && !_.isEmpty(this.missionEditData.gameServer.hostname))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionEditGameServerPortState() {
      const port = parseInt(this.missionEditData.gameServer.port);
      if (port < 0 || port > 65535) {
        return 'danger'
      }

      return ((_.isNil(this.missionEditData.gameServer.port) || _.isEmpty(this.missionEditData.gameServer.port)) &&
      (!_.isNil(this.missionEditData.gameServer.hostname) && !_.isEmpty(this.missionEditData.gameServer.hostname))) ? 'danger' : 'success'
    },
    missionEditSlottingTimeFeedback() {
      return _.isString(this.missionEditData.slottingTime)
        && !_.isEmpty(this.missionEditData.slottingTime)
        && moment(this.missionEditData.slottingTime).isValid ? '' : this.$t('mission.feedback.dateTime')
    },
    missionEditSlottingTimeState() {
      return _.isString(this.missionEditData.slottingTime)
        && !_.isEmpty(this.missionEditData.slottingTime)
        && moment(this.missionEditData.slottingTime).isValid ? 'success' : 'danger'
    },
    missionEditStartTimeFeedback() {
      if (_.isNil(this.missionEditData.startTime) || _.isEmpty(this.missionEditData.startTime)) {
        return this.$t('mission.feedback.dateTime')
      }

      const startTime = moment(this.missionEditData.startTime)
      if (!startTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      const slottingTime = moment(this.missionEditData.slottingTime)
      if (!slottingTime.isValid()) {
        return this.$t('mission.feedback.dateTime')
      }

      if (startTime < slottingTime) {
        return this.$t('mission.feedback.dateTime.afterSlotting')
      }

      return ''
    },
    missionEditStartTimeState() {
      if (_.isNil(this.missionEditData.startTime) || _.isEmpty(this.missionEditData.startTime)) {
        return 'danger'
      }

      const startTime = moment(this.missionEditData.startTime)
      if (!startTime.isValid()) {
        return 'danger'
      }

      const slottingTime = moment(this.missionEditData.slottingTime)
      if (!slottingTime.isValid()) {
        return 'danger'
      }

      if (startTime < slottingTime) {
        return 'danger'
      }

      return 'success'
    },
    missionEditTitleFeedback() {
      return _.isString(this.missionEditData.title) && !_.isEmpty(this.missionEditData.title) ? '' : this.$t('mission.feedback.title')
    },
    missionEditTitleState() {
      return _.isString(this.missionEditData.title) && !_.isEmpty(this.missionEditData.title) ? 'success' : 'danger'
    },
    missionEditVisibilityOptions() {
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
    },
    missionEditVoiceCommsHostnameFeedback() {
      return ((_.isNil(this.missionEditData.voiceComms.hostname) || _.isEmpty(this.missionEditData.voiceComms.hostname)) &&
      (!_.isNil(this.missionEditData.voiceComms.port) && !_.isEmpty(this.missionEditData.voiceComms.port))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionEditVoiceCommsHostnameState() {
      return ((_.isNil(this.missionEditData.voiceComms.hostname) || _.isEmpty(this.missionEditData.voiceComms.hostname)) &&
      (!_.isNil(this.missionEditData.voiceComms.port) && !_.isEmpty(this.missionEditData.voiceComms.port))) ? 'danger' : 'success'
    },
    missionEditVoiceCommsPortFeedback() {
      const port = parseInt(this.missionEditData.voiceComms.port);
      if (port < 0 || port > 65535) {
        return this.$t('mission.feedback.serverInfo.portRange')
      }

      return ((_.isNil(this.missionEditData.voiceComms.port) || _.isEmpty(this.missionEditData.voiceComms.port)) &&
      (!_.isNil(this.missionEditData.voiceComms.hostname) && !_.isEmpty(this.missionEditData.voiceComms.hostname))) ? this.$t('mission.feedback.serverInfo.hostnamePort') : ''
    },
    missionEditVoiceCommsPortState() {
      const port = parseInt(this.missionEditData.voiceComms.port);
      if (port < 0 || port > 65535) {
        return 'danger'
      }

      return ((_.isNil(this.missionEditData.voiceComms.port) || _.isEmpty(this.missionEditData.voiceComms.port)) &&
      (!_.isNil(this.missionEditData.voiceComms.hostname) && !_.isEmpty(this.missionEditData.voiceComms.hostname))) ? 'danger' : 'success'
    },
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    editMission() {
      if (_.isEmpty(this.missionEditData.title)) {
        return
      }

      if (_.isString(this.missionEditData.collapsedDescription) && _.isEmpty(this.missionEditData.collapsedDescription)) {
        this.missionEditData.collapsedDescription = null
      }
      if (_.isString(this.missionEditData.rules) && _.isEmpty(this.missionEditData.rules)) {
        this.missionEditData.rules = null
      }
      if (_.isString(this.missionEditData.techSupport) && _.isEmpty(this.missionEditData.techSupport)) {
        this.missionEditData.techSupport = null
      }

      const updatedMissionRequiredDLCs = []
      _.each(_.keys(this.missionEditRequiredDLCs), (dlc) => {
        if (!this.missionEditRequiredDLCs[dlc]) {
          return
        }

        if (dlc === 'lawsofwar') {
          updatedMissionRequiredDLCs.push('laws-of-war')
        } else if (dlc === 'tacops') {
          updatedMissionRequiredDLCs.push('tac-ops')
        } else {
          updatedMissionRequiredDLCs.push(dlc)
        }
      })

      const updatedMissionDetails = {}
      _.each(this.missionEditData, (value, key) => {
        if (!_.isEqual(value, this.missionDetails[key])) {
          let skip = false

          if (key.toLowerCase().indexOf('time') !== -1) {
            value = moment(value).utc().format()

            if (moment(value).utc().isSame(moment(this.missionDetails[key]).utc())) {
              skip = true
            }
          } else if (key.toLowerCase().indexOf('gameserver') !== -1 || key.toLowerCase().indexOf('voicecomms') !== -1) {
            if (_.isString(value.hostname) && _.isEmpty(value.hostname)) {
              value.hostname = null
            }
            if (_.isString(value.port) && _.isEmpty(value.port)) {
              value.port = null
            }
            if (_.isString(value.name) && _.isEmpty(value.name)) {
              value.name = null
            }
            if (_.isString(value.password) && _.isEmpty(value.password)) {
              value.password = null
            }

            if (_.isNil(value.hostname) && _.isNil(value.port)) {
              value = null
              skip = _.isNil(this.missionDetails[key])
            } else if ((_.isNil(value.hostname) && !_.isNil(value.port)) || (!_.isNil(value.hostname) && _.isNil(value.port))) {
              console.log(value.hostname, value.port)
              skip = true
            }
          }

          if (!skip) {
            updatedMissionDetails[key] = value
          }
        }
      })

      if (!_.isEqual(this.missionDetails.requiredDLCs, updatedMissionRequiredDLCs)) {
        updatedMissionDetails.requiredDLCs = updatedMissionRequiredDLCs
      }

      this.hideMissionEditModal()

      if (_.isEmpty(_.keys(updatedMissionDetails))) {
        return
      }

      this.$store.dispatch('editMission', {
        missionSlug: this.$route.params.missionSlug,
        updatedMissionDetails: updatedMissionDetails,
        missionTitle: this.missionDetails.title,
        suppressNotifications: this.missionEditSuppressNotifications
      })
    },
    hasMissionRequiredDLC(dlc) {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      if (_.isEmpty(this.missionDetails.requiredDLCs)) {
        return false
      }

      return (_.indexOf(this.missionDetails.requiredDLCs, dlc) >= 0)
    },
    hideMissionEditModal() {
      this.$refs.missionEditModal.hide()
    },
    missionEditTimeFormatter(val) {
      return moment(val).format('Y-MM-DD HH:mm')
    },
    setMissionData() {
      this.missionEditData = {
        briefingTime: moment(this.missionDetails.briefingTime).format('Y-MM-DD HH:mm'),
        collapsedDescription: this.missionDetails.collapsedDescription,
        detailedDescription: this.missionDetails.detailedDescription,
        endTime: moment(this.missionDetails.endTime).format('Y-MM-DD HH:mm'),
        rules: this.missionDetails.rules,
        description: this.missionDetails.description,
        gameServer: {
          hostname: _.isNil(this.missionDetails.gameServer) ? null : this.missionDetails.gameServer.hostname,
          port: _.isNil(this.missionDetails.gameServer) ? null : `${this.missionDetails.gameServer.port}`,
          name: _.isNil(this.missionDetails.gameServer) ? null : this.missionDetails.gameServer.name,
          password: _.isNil(this.missionDetails.gameServer) ? null : this.missionDetails.gameServer.password,
        },
        slotsAutoAssignable: this.missionDetails.slotsAutoAssignable,
        slottingTime: moment(this.missionDetails.slottingTime).format('Y-MM-DD HH:mm'),
        startTime: moment(this.missionDetails.startTime).format('Y-MM-DD HH:mm'),
        techSupport: this.missionDetails.techSupport,
        title: this.missionDetails.title,
        visibility: this.missionDetails.visibility,
        voiceComms: {
          hostname: _.isNil(this.missionDetails.voiceComms) ? null : this.missionDetails.voiceComms.hostname,
          port: _.isNil(this.missionDetails.voiceComms) ? null : `${this.missionDetails.voiceComms.port}`,
          name: _.isNil(this.missionDetails.voiceComms) ? null : this.missionDetails.voiceComms.name,
          password: _.isNil(this.missionDetails.voiceComms) ? null : this.missionDetails.voiceComms.password,
        }
      }

      this.missionEditRequiredDLCs = {
        aow: this.hasMissionRequiredDLC('aow'),
        apex: this.hasMissionRequiredDLC('apex'),
        contact: this.hasMissionRequiredDLC('contact'),
        csla: this.hasMissionRequiredDLC('csla'),
        ef: this.hasMissionRequiredDLC('ef'),
        gm: this.hasMissionRequiredDLC('gm'),
        helicopters: this.hasMissionRequiredDLC('helicopters'),
        jets: this.hasMissionRequiredDLC('jets'),
        karts: this.hasMissionRequiredDLC('karts'),
        lawsofwar: this.hasMissionRequiredDLC('laws-of-war'),
        marksmen: this.hasMissionRequiredDLC('marksmen'),
        rf: this.hasMissionRequiredDLC('rf'),
        tacops: this.hasMissionRequiredDLC('tac-ops'),
        tanks: this.hasMissionRequiredDLC('tanks'),
        vn: this.hasMissionRequiredDLC('vn')
      }

      this.missionEditCommunityGameServersSelected = null
      this.missionEditCommunityVoiceCommsSelected = null
      this.missionEditSuppressNotifications = false
    }
  },
  watch: {
    missionEditCommunityGameServersSelected(val) {
      const server = this.communityGameServers[val];
      if (_.isNil(server)) {
        return
      }

      this.missionEditData.gameServer.hostname = server.hostname
      this.missionEditData.gameServer.port = `${server.port}`
      this.missionEditData.gameServer.name = server.name
      this.missionEditData.gameServer.password = server.password
    },
    missionEditCommunityVoiceCommsSelected(val) {
      const server = this.communityVoiceComms[val];
      if (_.isNil(server)) {
        return
      }

      this.missionEditData.voiceComms.hostname = server.hostname
      this.missionEditData.voiceComms.port = `${server.port}`
      this.missionEditData.voiceComms.name = server.name
      this.missionEditData.voiceComms.password = server.password
    }
  },
}
</script>
