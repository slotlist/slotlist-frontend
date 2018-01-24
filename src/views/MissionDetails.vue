<template>
  <div>
    <!-- Begin of content -->
    <div v-if="missionDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">{{ $t('mission.by') }}</span>
          <router-link :to="{name: 'userDetails', params: {userUid: missionDetails.creator.uid}}">{{ formatUserWithTag(missionDetails.creator) }}</router-link>
        </h5>
        <br>
        <div class="text-center" v-if="missionDetails.bannerImageUrl">
          <img :src="missionDetails.bannerImageUrl" style="max-width: 100%; max-height: 480px">
          <br><br>
        </div>
        <p class="lead text-justify">{{ missionDetails.description }}</p>
        <hr class="my-4">
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.community') }}</h5>
            <p>
              <router-link v-if="missionDetails.community" :to="{name: 'communityDetails', params: {communitySlug: missionDetails.community.slug}}">[{{ missionDetails.community.tag }}] {{ missionDetails.community.name }}</router-link>
              <span v-if="!missionDetails.community" class="text-muted font-italic">{{ $t('account.notAssociated') }}</span>
            </p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.repositoryUrl') }}</h5>
            <p class="html ql-editor text-center" v-html="optionalRepositoryUrl"></p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.visibility') }}</h5>
            <p v-html="formattedMissionVisibility"></p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.slottingTime') }}</h5>
            <p>{{ formatDateTime(missionDetails.slottingTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.startTime') }}</h5>
            <p>{{ formatDateTime(missionDetails.startTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.endTime') }}
              <span class="text-muted">({{ $t('mission.abbr.estimated') }})</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.endTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.briefingTime.short') }}
              <span class="text-muted">({{ $t('mission.abbr.leadership') }})</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.briefingTime) }}</p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <b-btn variant="secondary" size="sm" :href="googleCalendarLink(missionDetails.slottingTime)" target="_blank">
              <i class="fa fa-calendar-plus-o" aria-hidden="true"></i> {{ $t('button.export.calendar.google') }}
            </b-btn>
            <b-btn variant="secondary" size="sm" @click="downloadICalFile(missionDetails.slottingTime)">
              <i class="fa fa-calendar" aria-hidden="true"></i> {{ $t('button.export.calendar.ical') }}
            </b-btn>
          </div>
          <div class="col-6 small" v-html="$t('mission.timezone', { timezone: timezone })"></div>
          <div class="col">
            <b-btn variant="secondary" size="sm" :href="googleCalendarLink(missionDetails.briefingTime)" target="_blank">
              <i class="fa fa-calendar-plus-o" aria-hidden="true"></i> {{ $t('button.export.calendar.google') }}
            </b-btn>
            <b-btn variant="secondary" size="sm" @click="downloadICalFile(missionDetails.briefingTime)">
              <i class="fa fa-calendar" aria-hidden="true"></i> {{ $t('button.export.calendar.ical') }}
            </b-btn>
          </div>
        </div>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.gameServer') }}</h5>
            <div v-if="missionDetails.gameServer">
              <div class="row">
                <div class="col font-weight-bold text-left">{{ $t('mission.serverInfo.hostname') }}</div>
                <div class="col">{{ missionDetails.gameServer.hostname }}</div>
              </div>
              <div class="row">
                <div class="col font-weight-bold text-left">{{ $t('mission.serverInfo.port') }}</div>
                <div class="col">{{ missionDetails.gameServer.port }}</div>
              </div>
              <div class="row">
                <div class="col font-weight-bold text-left">{{ $t('mission.serverInfo.password') }}</div>
                <div class="col">
                  <span v-if="missionDetails.gameServer.password">{{ missionDetails.gameServer.password }}</span>
                  <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                </div>
              </div>
              <div class="row justify-content-center">
                <b-btn size="sm" :href="`steam://connect/${missionDetails.gameServer.hostname}:${missionDetails.gameServer.port}${missionDetails.gameServer.password ? `/${missionDetails.gameServer.password}` : ''}`">
                  <i class="fa fa-sign-in" aria-hidden="true"></i> {{ $t('button.join') }}
                </b-btn>
              </div>
            </div>
            <p v-if="!missionDetails.gameServer" class="text-muted font-italic">{{ $t('misc.notProvided') }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.voiceComms') }}</h5>
            <div v-if="missionDetails.voiceComms">
              <div class="row">
                <div class="col font-weight-bold text-left">{{ $t('mission.serverInfo.hostname') }}</div>
                <div class="col">{{ missionDetails.voiceComms.hostname }}</div>
              </div>
              <div class="row">
                <div class="col font-weight-bold text-left">{{ $t('mission.serverInfo.port') }}</div>
                <div class="col">{{ missionDetails.voiceComms.port }}</div>
              </div>
              <div class="row">
                <div class="col font-weight-bold text-left">{{ $t('mission.serverInfo.password') }}</div>
                <div class="col">
                  <span v-if="missionDetails.voiceComms.password">{{ missionDetails.voiceComms.password }}</span>
                  <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                </div>
              </div>
              <div class="row justify-content-center">
                <b-btn size="sm" :href="`ts3server://${missionDetails.voiceComms.hostname}?port=${missionDetails.voiceComms.port}${missionDetails.voiceComms.password ? `&password=${missionDetails.voiceComms.password}` : ''}`">
                  <i class="fa fa-sign-in" aria-hidden="true"></i> {{ $t('button.join') }}
                </b-btn>
              </div>
            </div>
            <p v-if="!missionDetails.voiceComms" class="text-center text-muted font-italic">{{ $t('misc.notProvided') }}</p>
          </div>
        </div>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.techSupport') }}</h5>
            <p class="html ql-editor text-center" v-html="optionalTechSupport"></p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.rules') }}</h5>
            <p class="html ql-editor text-center" v-html="optionalRules"></p>
          </div>
        </div>
        <hr class="my-4">
        <div class="row justify-content-center">
          <b-btn variant="secondary" size="sm" v-if="isMissionEditor" v-b-modal.missionDuplicateModal>
            <i class="fa fa-files-o" aria-hidden="true"></i> {{ $t('button.duplicate.mission') }}
          </b-btn>&nbsp;
          <b-btn variant="secondary" size="sm" v-if="isMissionEditor" v-b-modal.missionConvertToSlotTemplateModal>
            <i class="fa fa-file-text-o" aria-hidden="true"></i> {{ $t('button.convert.slotTemplate') }}
          </b-btn>&nbsp;
          <b-btn variant="secondary" size="sm" v-if="isMissionCreator" v-b-modal.missionEmbedModal>
            <i class="fa fa-external-link" aria-hidden="true"></i> {{ $t('button.embed.mission') }}
          </b-btn>
        </div>
        <br v-if="isMissionEditor">
        <div class="row justify-content-center" v-if="isMissionEditor">
          <b-btn variant="primary" v-b-modal.missionEditModal>
            <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
          </b-btn>&nbsp;
          <b-btn variant="primary" v-b-modal.missionBannerImageModal>
            <i class="fa fa-picture-o" aria-hidden="true"></i> {{ $t('button.edit.mission.bannerImage') }}
          </b-btn>&nbsp;
          <b-btn variant="primary" v-if="isMissionCreator" v-b-modal.missionPermissionModal>
            <i class="fa fa-key" aria-hidden="true"></i> {{ $t('button.edit.mission.permissions') }}
          </b-btn>
          <span v-if="isMissionCreator">&nbsp;</span>
          <b-btn variant="primary" v-if="isMissionEditor && isPrivateMission" v-b-modal.missionAccessModal>
            <i class="fa fa-user-secret" aria-hidden="true"></i> {{ $t('button.edit.mission.accesses') }}
          </b-btn>
          <span v-if="isMissionEditor && isPrivateMission">&nbsp;</span>
          <click-confirm v-if="isMissionCreator" yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
            <b-btn variant="danger" @click="deleteMission">
              <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
            </b-btn>
          </click-confirm>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <div class="html ql-editor" v-html="missionDetails.detailedDescription"></div>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h1>{{ $t('mission.slotlist') }}</h1>
          <div class="small">
            <b-form-group :label="$t('mission.slotlist.filter')" label-for="missionSlotlistFilter">
              <div role="group" id="missionSlotlistFilter">
                <b-form-checkbox v-model="missionSlotlistFilter" name="assigned" value="assigned">
                  {{ $t('mission.slotlist.filter.assigned') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="hasRegistrations" value="hasRegistrations">
                  {{ $t('mission.slotlist.filter.hasRegistrations') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="restricted" value="restricted">
                  {{ $t('mission.slotlist.filter.restricted') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="blocked" value="blocked">
                  {{ $t('mission.slotlist.filter.blocked') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="open" value="open">
                  {{ $t('mission.slotlist.filter.open') }}
                </b-form-checkbox>
              </div>
            </b-form-group>
          </div>
          <mission-slotlist></mission-slotlist>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <mission-access-modal v-if="loggedIn && isMissionEditor && isPrivateMission"></mission-access-modal>
      <mission-apply-slot-template-modal v-if="loggedIn && isMissionEditor"></mission-apply-slot-template-modal>
      <mission-banner-image-modal v-if="loggedIn && isMissionEditor"></mission-banner-image-modal>
      <mission-convert-to-slot-template-modal v-if="loggedIn"></mission-convert-to-slot-template-modal>
      <mission-duplicate-modal v-if="loggedIn && isMissionEditor"></mission-duplicate-modal>
      <mission-edit-modal v-if="loggedIn && isMissionEditor"></mission-edit-modal>
      <mission-permission-modal v-if="loggedIn && isMissionCreator"></mission-permission-modal>
      <mission-slot-assign-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-assign-modal>
      <mission-slot-create-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-create-modal>
      <mission-slot-details-modal></mission-slot-details-modal>
      <mission-slot-edit-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-edit-modal>
      <mission-slot-group-create-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-group-create-modal>
      <mission-slot-group-edit-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-group-edit-modal>
      <mission-slot-registration-modal v-if="loggedIn && !hasMissionEnded"></mission-slot-registration-modal>
      <mission-slot-selection-edit-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-selection-edit-modal>
      <mission-embed-modal v-if="loggedIn && isMissionCreator"></mission-embed-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'
import FileSaver from 'file-saver'
import MissionAccessModal from 'components/missions/modals/MissionAccessModal.vue'
import MissionApplySlotTemplateModal from 'components/missions/modals/MissionApplySlotTemplateModal.vue'
import MissionBannerImageModal from 'components/missions/modals/MissionBannerImageModal.vue'
import MissionConvertToSlotTemplateModal from 'components/missions/modals/MissionConvertToSlotTemplateModal.vue'
import MissionDuplicateModal from 'components/missions/modals/MissionDuplicateModal.vue'
import MissionEditModal from 'components/missions/modals/MissionEditModal.vue'
import MissionPermissionModal from 'components/missions/modals/MissionPermissionModal.vue'
import MissionSlotAssignModal from 'components/missions/modals/MissionSlotAssignModal.vue'
import MissionSlotCreateModal from 'components/missions/modals/MissionSlotCreateModal.vue'
import MissionSlotDetailsModal from 'components/missions/modals/MissionSlotDetailsModal.vue'
import MissionSlotEditModal from 'components/missions/modals/MissionSlotEditModal.vue'
import MissionSlotGroupCreateModal from 'components/missions/modals/MissionSlotGroupCreateModal.vue'
import MissionSlotGroupEditModal from 'components/missions/modals/MissionSlotGroupEditModal.vue'
import MissionSlotlist from 'components/missions/MissionSlotlist.vue'
import MissionSlotRegistrationModal from 'components/missions/modals/MissionSlotRegistrationModal.vue'
import MissionSlotSelectionEditModal from 'components/missions/modals/MissionSlotSelectionEditModal.vue'
import MissionEmbedModal from 'components/missions/modals/MissionEmbedModal.vue'
import utils from '../utils'

export default {
  components: {
    MissionAccessModal,
    MissionApplySlotTemplateModal,
    MissionBannerImageModal,
    MissionConvertToSlotTemplateModal,
    MissionDuplicateModal,
    MissionEditModal,
    MissionPermissionModal,
    MissionSlotAssignModal,
    MissionSlotCreateModal,
    MissionSlotDetailsModal,
    MissionSlotEditModal,
    MissionSlotGroupCreateModal,
    MissionSlotGroupEditModal,
    MissionSlotlist,
    MissionSlotRegistrationModal,
    MissionSlotSelectionEditModal,
    MissionEmbedModal
  },
  beforeCreate: function() {
    this.$store.dispatch('getMissionDetails', { missionSlug: this.$route.params.missionSlug })
    this.$store.dispatch('getMissionSlotlist', { missionSlug: this.$route.params.missionSlug })
  },
  created: function() {
    this.missionSlotlistFilter = this.$store.getters.missionSlotlistFilter
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMissionDetails')
  },
  data() {
    return {
      missionSlotlistFilter: []
    }
  },
  computed: {
    formattedMissionVisibility() {
      switch (this.missionDetails.visibility) {
        case 'community':
          return `<span class="text-primary"><i class="fa fa-users" aria-hidden="true"></i> ${this.$t('mission.visibility.community')}</span>`
        case 'hidden':
          return `<span class="text-danger"><i class="fa fa-edit" aria-hidden="true"></i> ${this.$t('mission.visibility.hidden')}</span>`
        case 'private':
          return `<span class="text-warning"><i class="fa fa-user-secret" aria-hidden="true"></i> ${this.$t('mission.visibility.private')}</span>`
        case 'public':
          return `<span class="text-success"><i class="fa fa-globe" aria-hidden="true"></i> ${this.$t('mission.visibility.public')}</span>`
        default:
          return `<span class="text-muted font-italic"><i class="fa fa-question-circle" aria-hidden="true"></i> ${this.$t('mission.visibility.default')}</span>`
      }
    },
    hasMissionEnded() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return moment().isAfter(moment(this.missionDetails.endTime))
    },
    isMissionCreator() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`])
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    isPrivateMission() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return this.missionDetails.visibility === 'private'
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    optionalRepositoryUrl() {
      return this.missionDetails.repositoryUrl || `<div class='text-muted font-italic'>${this.$t('misc.notProvided')}</div>`
    },
    optionalRules() {
      return this.missionDetails.rules || `<div class='text-muted font-italic'>${this.$t('misc.notSpecified')}</div>`
    },
    optionalTechSupport() {
      return this.missionDetails.techSupport || `<div class='text-muted font-italic'>${this.$t('misc.notProvided')}</div>`
    },
    timezone() {
      return this.$store.getters.timezone
    }
  },
  methods: {
    deleteMission() {
      this.$store.dispatch('deleteMission', {
        missionSlug: this.$route.params.missionSlug,
        missionTitle: this.missionDetails.title
      })
    },
    downloadICalFile(beginTime) {
      let data = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//slotlist.info//slotlist-frontend v${process.env.FRONTEND_VERSION}//EN\r\n`
      data += `CALSCALE:GREGORIAN\r\nMETHOD:PUBLIC\r\nX-WR-CALNAME:slotlist.info\r\nX-ORIGINAL-URL:${process.env.BASE_URL}\r\n`
      data += `X-WR-CALDESC:${this.$t('title.browser')}\r\nBEGIN:VEVENT\r\n`
      data += `UID:${this.missionDetails.slug}@${process.env.BASE_URL}\r\n`
      data += `DTSTART;TZID=${this.$store.getters.timezone}:${moment(beginTime).format('YMMDD[T]HHmmss')}\r\n`
      data += `DTEND;TZID=${this.$store.getters.timezone}:${moment(this.missionDetails.endTime).format('YMMDD[T]HHmmss')}\r\n`
      data += `DTSTAMP:${moment().format('YMMDD[T]HHmmss')}\r\n`
      data += `SUMMARY:${this.missionDetails.title}\r\n`
      data += `DESCRIPTION:${this.$t('mission.details')}: ${process.env.BASE_URL}/missions/${this.missionDetails.slug} \\n \\n`
      data += `${this.$t('mission.times.ical', {
        start: this.formatDateTime(this.missionDetails.startTime),
        briefing: this.formatDateTime(this.missionDetails.briefingTime),
        slotting: this.formatDateTime(this.missionDetails.slottingTime),
        end: this.formatDateTime(this.missionDetails.endTime)
      })} \\n \\n`
      data += `${this.missionDetails.description}\r\n`
      data += `URL:${process.env.BASE_URL}/missions/${this.missionDetails.slug}\r\n`
      data += `END:VEVENT\r\nEND:VCALENDAR`

      const blob = new Blob([data], { type: 'text/calendar' })

      FileSaver.saveAs(blob, `${this.missionDetails.title}.ics`)
    },
    googleCalendarLink(beginTime) {
      let link = 'https://www.google.com/calendar/event?action=TEMPLATE'
      link += `&text=${this.missionDetails.title}`
      link += `&dates=${moment(beginTime).format('YMMDD[T]HHmmss')}/${moment(this.missionDetails.endTime).format('YMMDD[T]HHmmss')}`
      link += `&details=${this.$t('mission.details')}: ${process.env.BASE_URL}/missions/${this.missionDetails.slug} \n \n`
      link += `${this.$t('mission.times', {
        start: this.formatDateTime(this.missionDetails.startTime),
        briefing: this.formatDateTime(this.missionDetails.briefingTime),
        slotting: this.formatDateTime(this.missionDetails.slottingTime),
        end: this.formatDateTime(this.missionDetails.endTime)
      })} \n \n`
      link += `${this.missionDetails.description}`
      link += `&location&trp=false&ctx=${this.$store.getters.timezone}`

      return encodeURI(link)
    }
  },
  watch: {
    missionSlotlistFilter(val) {
      this.$store.dispatch('filterMissionSlotlist', val)
    }
  }
}
</script>
