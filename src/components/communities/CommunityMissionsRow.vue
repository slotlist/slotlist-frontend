<template>
  <tr>
    <td>{{ formatDateTime(communityMission.startTime) }}</td>
    <td>{{ communityMission.title }}</td>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: communityMission.creator.uid}}">{{ formatUserWithTag(communityMission.creator) }}</router-link>
    </td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'missionDetails', params: {missionSlug: communityMission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'communityMission'
  ]
}
</script>
