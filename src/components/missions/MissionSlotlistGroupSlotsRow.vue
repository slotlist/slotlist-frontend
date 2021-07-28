<template>
  <tr @click.ctrl="toggleMissionSlotSelection" :class="{'table-active': missionSlotSelected}">
    <td v-if="anyMissionSlotSelected"><i class="fa fa-check-square text-muted" aria-hidden="true" v-if="missionSlotSelected"></i></td>
    <td>{{ missionSlotDetails.orderNumber }}</td>
    <td>
      <div v-if="!missionSlotDetails.restrictedCommunity && !missionSlotDetails.reserve && !missionSlotDetails.blocked">
        <i :class="difficultyIcon" aria-hidden="true"></i> {{ missionSlotDetails.title }}
        <img v-for="requiredDLC in missionSlotRequiredDLCs" :key="requiredDLC" :src="requiredDLC" width="16px" />
      </div>
      <b-popover v-if="missionSlotDetails.restrictedCommunity || missionSlotDetails.reserve || missionSlotDetails.blocked" :content="titlePopoverContent" :triggers="['hover']">
        <span :class="titleColor" v-html="formattedTitle"></span>
        <img v-for="requiredDLC in missionSlotRequiredDLCs" :key="requiredDLC" :src="requiredDLC" width="16px" />
      </b-popover>
    </td>
    <td>
      <span v-if="missionSlotDetails.blocked" class="text-muted font-italic">{{ $t('mission.slot.blocked') }}</span>
      <span v-if="!missionSlotDetails.blocked && missionSlotDetails.assignee">
        <router-link class="text-success font-weight-bold" :to="{name: 'userDetails', params: {userUid: missionSlotDetails.assignee.uid}}">
          {{ formatUserWithTag(missionSlotDetails.assignee) }}
        </router-link>
      </span>
      <span v-if="!missionSlotDetails.blocked && !missionSlotDetails.assignee && missionSlotDetails.externalAssignee" class="text-success font-weight-bold font-italic">{{ missionSlotDetails.externalAssignee }}</span>
      <span v-if="!missionSlotDetails.blocked && !missionSlotDetails.assignee && !missionSlotDetails.externalAssignee && (!missionSlotDetails.registrationCount || missionSlotDetails.registrationCount <= 0)" class="text-muted font-italic">{{ `${this.$tc('mission.slot.assignee.registration', 0)}` }}</span>
      <span v-if="!missionSlotDetails.blocked && !missionSlotDetails.assignee && !missionSlotDetails.externalAssignee && missionSlotDetails.registrationCount && missionSlotDetails.registrationCount > 0" class="text-muted">{{ `${this.missionSlotDetails.registrationCount} ${this.$tc('mission.slot.assignee.registration', this.missionSlotDetails.registrationCount > 1 ? 2 : 1)}` }}</span>
    </td>
    <td v-if="hasAnyMissionSlotDescription">{{ missionSlotDetails.description }}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Mission slot actions">
        <b-btn variant="primary" @click="prepareMissionSlotDetails" v-b-modal.missionSlotDetailsModal>
          <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
        </b-btn>
        <b-btn variant="success" v-if="loggedIn && !missionSlotDetails.registrationUid && !hasMissionEnded" :disabled="missionSlotDetails.blocked || !canRegisterForSlot" @click="setMissionSlotDetails" v-b-modal.missionSlotRegistrationModal>
          <i class="fa fa-ticket" aria-hidden="true"></i> {{ $t('button.register') }}
        </b-btn>
        <click-confirm v-if="loggedIn && missionSlotDetails.registrationUid && !hasMissionEnded" yes-icon="fa fa-eraser" yes-class="btn btn-warning" button-size="sm" :messages="{title: $t('mission.slot.confirm.unregister'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="warning" size="sm" @click="deleteMissionSlotRegistration">
            <i class="fa fa-eraser" aria-hidden="true"></i> {{ $t('button.unregister') }}
          </b-btn>
        </click-confirm>
        <click-confirm v-if="isMissionEditor && !hasMissionEnded" yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.slot.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="danger" size="sm" @click="deleteMissionSlot">
            <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
          </b-btn>
        </click-confirm>
      </div>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

export default {
  props: [
    'hasAnyMissionSlotDescription',
    'missionSlotDetails',
    'missionSlotGroup'
  ],
  computed: {
    anyMissionSlotSelected() {
      return !_.isEmpty(this.$store.getters.missionSlotSelection)
    },
    canRegisterForSlot() {
      const user = this.$store.getters.user
      let userCommunityUid = null;
      if (!_.isNil(user) && !_.isNil(user.community)) {
        userCommunityUid = user.community.uid
      }

      let restrictedCommunityUid = null;
      if (!_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        restrictedCommunityUid = this.missionSlotDetails.restrictedCommunity.uid
      }

      return _.isNil(this.missionSlotDetails.assignee) &&_.isNil(this.missionSlotDetails.externalAssignee) && (_.isNil(restrictedCommunityUid) || _.isEqual(userCommunityUid, restrictedCommunityUid))
    },
    difficultyColor() {
      switch (this.missionSlotDetails.difficulty) {
        case 0:
          return 'text-muted'
        case 1:
          return 'text-info'
        case 2:
          return 'text-primary'
        case 3:
          return 'text-warning'
        case 4:
          return 'text-danger'
        default:
          return ''
      }
    },
    difficultyIcon() {
      return `${this.difficultyColor} fa fa-thermometer-${this.missionSlotDetails.difficulty} fa-lg`
    },
    formattedTitle() {
      if (_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        return `<i class="${this.difficultyIcon}" aria-hidden="true"></i> ${this.missionSlotDetails.title}`
      }

      return `<i class="${this.difficultyIcon}" aria-hidden="true"></i> ${this.missionSlotDetails.title} - [${this.missionSlotDetails.restrictedCommunity.tag}]`
    },
    hasMissionEnded() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return moment().isAfter(moment(this.missionDetails.endTime))
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionSlotRequiredDLCs() {
      if (_.isNil(this.missionSlotDetails)) {
        return []
      }

      if (_.isEmpty(this.missionSlotDetails.requiredDLCs)) {
        return []
      }

      return _.map(this.missionSlotDetails.requiredDLCs, (requiredDLC) => {
        return `https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/${requiredDLC.toLowerCase()}.png`
      })
    },
    missionSlotSelected() {
      return _.indexOf(this.missionSlotSelection, this.missionSlotDetails.uid) >= 0
    },
    missionSlotSelection() {
      return this.$store.getters.missionSlotSelection
    },
    titleColor() {
      if (this.missionSlotDetails.blocked || !_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        return 'text-primary'
      } else if (this.missionSlotDetails.reserve) {
        return 'text-muted font-italic'
      }
    },
    titlePopoverContent() {
      if (this.missionSlotDetails.blocked) {
        return this.$t('mission.slot.blocked.popover')
      } else if (!_.isNil(this.missionSlotDetails.restrictedCommunity)) {
        return this.$t('mission.slot.restricted.popover', { communityInfo: `[${this.missionSlotDetails.restrictedCommunity.tag}] ${this.missionSlotDetails.restrictedCommunity.name}` })
      } else if (this.missionSlotDetails.reserve) {
        return this.$t('mission.slot.reserve.popover')
      }
    }
  },
  methods: {
    deleteMissionSlot() {
      this.$store.dispatch('deleteMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      });
    },
    deleteMissionSlotRegistration() {
      this.$store.dispatch('unregisterFromMissionSlot', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        registrationUid: this.missionSlotDetails.registrationUid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })
    },
    prepareMissionSlotDetails() {
      this.$store.dispatch('getMissionSlotRegistrations', {
        missionSlug: this.$route.params.missionSlug,
        slotUid: this.missionSlotDetails.uid,
        slotOrderNumber: this.missionSlotDetails.orderNumber,
        slotTitle: this.missionSlotDetails.title
      })

      this.setMissionSlotDetails()
      this.setMissionSlotGroupDetails()
    },
    setMissionSlotDetails() {
      this.$store.dispatch('setMissionSlotDetails', this.missionSlotDetails)
    },
    setMissionSlotGroupDetails() {
      this.$store.dispatch('setMissionSlotGroupDetails', this.missionSlotGroup)
    },
    toggleMissionSlotSelection() {
      if (!this.loggedIn || !this.isMissionEditor || this.hasMissionEnded) {
        return
      }

      this.$store.dispatch('toggleMissionSlotSelection', { missionSlotUid: this.missionSlotDetails.uid })
    }
  }
}
</script>
