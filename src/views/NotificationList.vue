<template>
  <div>
    <notification-list-table v-if="notifications"></notification-list-table>
    <nav v-show="notificationsPageCount > 1">
      <paginate ref="notificationsPaginate" :pageCount="notificationsPageCount" :initial-page="0" :clickHandler="notificationsPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="small">
      <b-form-group :label="$t('notification.list.filter')" label-for="notificationListFilter">
        <div role="group" id="notificationListFilter">
          <b-form-checkbox v-model="notificationListFilter" name="seen" value="seen">
            {{ $t('notification.list.filter.seen') }}
          </b-form-checkbox>
        </div>
      </b-form-group>
    </div>
    <div class="text-center">
      <b-btn :disabled="refreshingNotifications" @click="refreshNotifications">
        <i class="fa fa-refresh" :class="{'fa-spin': refreshingNotifications}" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import NotificationListTable from '../components/notifications/NotificationListTable.vue'
import utils from '../utils'

export default {
  components: {
    NotificationListTable
  },
  beforeCreate: function() {
    this.$store.dispatch('getNotifications')
      .then(() => {
        this.$store.dispatch('getUnseenNotificationCount', { autoRefresh: true })
      })
  },
  created: function() {
    this.notificationListFilter = this.$store.getters.notificationListFilter

    utils.setTitle(this.$t('nav.notifications'))
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearNotifications')
  },
  data() {
    return {
      notificationListFilter: []
    }
  },
  computed: {
    notifications() {
      return this.$store.getters.notifications
    },
    notificationsPageCount() {
      return this.$store.getters.notificationsPageCount
    },
    refreshingNotifications() {
      return this.$store.getters.refreshingNotifications
    }
  },
  methods: {
    notificationsPaginate(page) {
      if (_.indexOf(this.notificationListFilter, 'seen') >= 0) {
        this.$store.dispatch('getNotifications', { page })
      } else {
        this.$store.dispatch('paginateNotifications', { page })
      }
    },
    refreshNotifications() {
      this.$store.dispatch('getNotifications', { silent: true })
        .then(() => {
          this.$store.dispatch('getUnseenNotificationCount', { autoRefresh: true })
        })
    }
  },
  watch: {
    notificationListFilter(val) {
      this.$store.dispatch('filterNotificationList', val)
    }
  }
}
</script>
