<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 5%" class="text-center">{{ $t('notification.seen') }}</th>
          <th style="width: 18%">{{ $t('notification.received') }}</th>
          <th style="width: 73%">{{ $t('notification.notification') }}</th>
          <th style="width: 4%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <notification-list-row v-for="notification in notifications" :notification="notification" :key="notification.uid"></notification-list-row>
      </tbody>
      <tfoot v-show="notifications.length >= 10">
        <tr>
          <th style="width: 5%" class="text-center">{{ $t('notification.seen') }}</th>
          <th style="width: 18%">{{ $t('notification.received') }}</th>
          <th style="width: 73%">{{ $t('notification.notification') }}</th>
          <th style="width: 4%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import NotificationListRow from './NotificationListRow.vue'

export default {
  components: {
    NotificationListRow
  },
  computed: {
    notifications() {
      return this.$store.getters.notifications
    }
  }
}
</script>
