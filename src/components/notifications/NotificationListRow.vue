<template>
  <tr>
    <td class="text-center"><i class="fa" :class="{'fa-check': notification.seenAt, 'text-success': notification.seenAt}" aria-hidden="true"></i></td>
    <td>{{ formatDateTime(notification.createdAt) }}</td>
    <td v-html="notificationText"></td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :disabled="notificationTarget === null" :to="notificationTarget">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'notification'
  ],
  created: function() {
    const notificationsRequiringRefresh = ['community.application.accepted', 'community.application.removed', 'community.deleted', 'community.permission.granted', 'community.permission.revoked', 'mission.permission.granted', 'mission.permission.revoked'];
    if (_.isNil(this.notification.seenAt) && _.indexOf(notificationsRequiringRefresh, this.notification.notificationType) >= 0) {
      this.$store.dispatch('refreshToken', { silent: true })
    }
  },
  computed: {
    notificationTarget() {
      switch (this.notification.notificationType) {
        case 'community.application.accepted':
        case 'community.application.denied':
        case 'community.application.new':
        case 'community.application.removed':
        case 'community.permission.granted':
        case 'community.permission.revoked':
          return {name: 'communityDetails', params: {communitySlug: this.notification.data.communitySlug}}
        case 'community.application.deleted':
          return {name: 'userDetails', params: {userUid: this.notification.data.userUid}}
        case 'mission.permission.granted':
        case 'mission.permission.revoked':
        case 'mission.slot.assigned':
        case 'mission.slot.registration.new':
        case 'mission.slot.unassigned':
        case 'mission.slot.unregistered':
        case 'mission.updated':
          return {name: 'missionDetails', params: {missionSlug: this.notification.data.missionSlug}}
        default:
          return null
      }
    },
    notificationText() {
      switch (this.notification.notificationType) {
        case 'community.permission.granted':
        case 'community.permission.revoked':
        case 'mission.permission.granted':
        case 'mission.permission.revoked':
          const notificationDataPermission = _.clone(this.notification.data)
          notificationDataPermission.translatedPermission = this.translatePermission(this.notification.data.permission)
          return this.$t(`notification.type.${this.notification.notificationType}`, notificationDataPermission)
        case 'generic':
          return this.notification.data.message
        case 'mission.slot.registration.new':
        case 'mission.slot.unregistered':
          const notificationDataUserNickname = _.clone(this.notification.data)
          notificationDataUserNickname.userNicknameWithTag = _.isNil(this.notification.data.userCommunityTag) ? this.notification.data.userNickname : `[${this.notification.data.userCommunityTag}] ${this.notification.data.userNickname}`
          return this.$t(`notification.type.${this.notification.notificationType}`, notificationDataUserNickname)
        default:
          return this.$t(`notification.type.${this.notification.notificationType}`, this.notification.data)
      }
    }
  },
  methods: {
    translatePermission(permission) {
      const perm = permission.toLowerCase()

      if (_.startsWith(perm, 'community')) {
        if (_.endsWith(perm, 'founder')) {
          return this.$t('community.permission.founder')
        } else if (_.endsWith(perm, 'leader')) {
          return this.$t('community.permission.leader')
        } else if (_.endsWith(perm, 'recruitment')) {
          return this.$t('community.permission.recruitment')
        }
      } else if (_.startsWith(perm, 'mission')) {
        if (_.endsWith(perm, 'creator')) {
          return this.$t('mission.permission.creator')
        } else if (_.endsWith(perm, 'editor')) {
          return this.$t('mission.permission.editor')
        } else if (_.endsWith(perm, 'slotlist.community')) {
          return this.$t('mission.permission.slotlist.community')
        }
      }

      return permission
    }
  }
}
</script>
