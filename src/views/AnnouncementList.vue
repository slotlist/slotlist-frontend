<template>
  <div>
    <!-- Begin of content -->
    <div>
      <announcement-list-table v-if="announcements"></announcement-list-table>
      <nav v-show="announcementsPageCount > 1">
        <paginate ref="announcementsPaginate" :pageCount="announcementsPageCount" :initial-page="0" :clickHandler="announcementsPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
      </nav>
      <div class="text-center">
        <router-link tag="button" v-show="loggedIn && isAnnouncementAdmin" type="button" class="btn btn-success" :to="{name: 'announcementCreator'}">
          <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.announcement') }}
        </router-link>
        <b-btn :disabled="refreshingAnnouncements" @click="announcementsPaginate(1)">
          <i class="fa fa-refresh" :class="{'fa-spin': refreshingAnnouncements}" aria-hidden="true"></i> {{ $t('button.refresh') }}
        </b-btn>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <announcement-edit-modal v-if="loggedIn && isAnnouncementAdmin"></announcement-edit-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import AnnouncementEditModal from '../components/announcements/modals/AnnouncementEditModal.vue'
import AnnouncementListTable from '../components/announcements/AnnouncementListTable.vue'
import utils from '../utils'

export default {
  components: {
    AnnouncementEditModal,
    AnnouncementListTable
  },
  beforeCreate: function() {
    this.$store.dispatch('getAnnouncements')
  },
  created: function() {
    utils.setTitle(this.$t('nav.announcements'))
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearAnnouncements')
  },
  computed: {
    announcements() {
      return this.$store.getters.announcements
    },
    announcementsPageCount() {
      return this.$store.getters.announcementsPageCount
    },
    isAnnouncementAdmin() {
      return this.$acl.can(['admin.announcement'])
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    refreshingAnnouncements() {
      return this.$store.getters.refreshingAnnouncements
    }
  },
  methods: {
    announcementsPaginate(page) {
      this.$store.dispatch('getAnnouncements', { page })
    }
  }
}
</script>
