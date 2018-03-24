<template>
  <tr>
    <td>
      {{ formatDateTime(announcement.createdAt) }}
      <b-collapse :id="announcementCollapseId" :visible="isAnnouncementUidInQuery">
        <router-link :to="{name: 'userDetails', params: {userUid: announcement.user.uid}}">{{ formatUserWithTag(announcement.user) }}</router-link>
      </b-collapse>
    </td>
    <td>
      <span :class="{'text-muted': isAnnouncementNotVisibleYet, 'font-italic': isAnnouncementNotVisibleYet}">{{ announcement.title }}</span>
      <b-collapse :id="announcementCollapseId" class="html ql-editor" style="padding: 0px;" v-html="announcement.content" :visible="isAnnouncementUidInQuery"></b-collapse>
    </td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" v-b-toggle="announcementCollapseId">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
      <b-collapse :id="announcementCollapseId" v-if="loggedIn && isAnnouncementAdmin" :visible="isAnnouncementUidInQuery">
        <b-btn variant="primary" size="sm" v-b-modal.announcementEditModal @click="setAnnouncementDetails">
          <i class="fa fa-edit" aria-hidden="true"></i>
        </b-btn>
        <click-confirm yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('announcement.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="danger" size="sm" @click="deleteAnnouncement">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-btn>
        </click-confirm>
      </b-collapse>
    </td>
  </tr>
</template>

<script>
import * as _ from 'lodash';
import moment from 'moment-timezone'

export default {
  props: [
    'announcement'
  ],
  computed: {
    announcementCollapseId() {
      return `announcementCollapse_${this.announcement.uid}`
    },
    isAnnouncementAdmin() {
      return this.$acl.can(['admin.announcement'])
    },
    isAnnouncementNotVisibleYet() {
      if (_.isNil(this.announcement.visibleFrom)) {
        return false
      }

      return moment(this.announcement.visibleFrom).isAfter(moment())
    },
    isAnnouncementUidInQuery() {
      return this.$route.query.uid === this.announcement.uid
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
  },
  methods: {
    deleteAnnouncement() {
      this.$store.dispatch('deleteAnnouncement', {
        announcementUid: this.announcement.uid,
        announcementTitle: this.announcement.title
      })
    },
    setAnnouncementDetails() {
      this.$store.dispatch('setAnnouncementDetails', this.announcement)
    }
  }
}
</script>
