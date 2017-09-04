<template>
  <div>
    <table class="table table-striped" v-if="communityApplications">
      <thead>
        <tr>
          <th style="width: 70%">{{ $t('community.application.nickname') }}</th>
          <th class="text-center" style="width: 10%">{{ $t('community.application.status') }}</th>
          <th style="width: 20%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <community-applications-row v-for="communityApplication in communityApplications" :communityApplication="communityApplication" :key="communityApplication.uid"></community-applications-row>
      </tbody>
      <tfoot v-show="communityApplications.length >= 10">
        <tr>
          <th style="width: 70%">{{ $t('community.application.nickname') }}</th>
          <th class="text-center" style="width: 10%">{{ $t('community.application.status') }}</th>
          <th style="width: 20%" class="text-center">{{ $t('misc.actions') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import CommunityApplicationsRow from './CommunityApplicationsRow.vue'

export default {
  components: {
    CommunityApplicationsRow
  },
  computed: {
    communityApplications() {
      return this.$store.getters.communityApplications
    }
  }
}
</script>
