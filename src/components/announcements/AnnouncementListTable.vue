<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 18%">{{ $t('announcement.createdAt') }}</th>
          <th style="width: 78%">{{ $t('announcement.title') }}</th>
          <th style="width: 4%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <announcement-list-row v-for="announcement in announcements" :announcement="announcement" :key="announcement.uid"></announcement-list-row>
      </tbody>
      <tfoot v-show="announcements.length >= 10">
        <tr>
          <th style="width: 18%">{{ $t('announcement.createdAt') }}</th>
          <th style="width: 78%">{{ $t('announcement.title') }}</th>
          <th style="width: 4%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import AnnouncementListRow from './AnnouncementListRow.vue'

export default {
  components: {
    AnnouncementListRow
  },
  computed: {
    announcements() {
      return this.$store.getters.announcements
    }
  }
}
</script>
