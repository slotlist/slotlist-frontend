<template>
  <tr>
    <td>{{ communityApplication.user.nickname }}</td>
    <td class="text-center" v-html="formattedCommunityApplicationStatus"></td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Community application actions">
        <router-link tag="button" class="btn btn-primary" :to="{name: 'userDetails', params: {userUid: communityApplication.user.uid}}">
          <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
        </router-link>
        <click-confirm yes-icon="fa fa-user-plus" yes-class="btn btn-success" button-size="sm" :messages="{title: $t('community.application.confirm.accept'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="success" size="sm" :disabled="isCommunityApplicationProcessed" @click="processCommunityApplication(true)">
            <i class="fa fa-user-plus" aria-hidden="true"></i> {{ $t('button.accept') }}
          </b-btn>
        </click-confirm>
        <click-confirm yes-icon="fa fa-user-times" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('community.application.confirm.deny'), yes: $t('button.confirm'), no: $t('button.cancel')}">
          <b-btn variant="danger" size="sm" :disabled="isCommunityApplicationProcessed" @click="processCommunityApplication(false)">
            <i class="fa fa-user-times" aria-hidden="true"></i> {{ $t('button.deny') }}
          </b-btn>
        </click-confirm>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'communityApplication'
  ],
  computed: {
    formattedCommunityApplicationStatus() {
      switch (this.communityApplication.status.toLowerCase()) {
        case 'accepted':
          return '<i class="fa fa-check fa-lg text-success" aria-hidden="true"></i>'
        case 'denied':
          return '<i class="fa fa-close fa-lg text-danger" aria-hidden="true"></i>'
        default:
          return '<i class="fa fa-question-circle fa-lg text-muted" aria-hidden="true"></i>'
      }
    },
    isCommunityApplicationProcessed() {
      return this.communityApplication.status.toLowerCase() !== 'submitted'
    }
  },
  methods: {
    processCommunityApplication(accepted) {
      this.$store.dispatch('processCommunityApplication', {
        communitySlug: this.$route.params.communitySlug,
        applicationUid: this.communityApplication.uid,
        applicationUserNickname: this.communityApplication.user.nickname,
        accepted
      })
    }
  }
}
</script>
