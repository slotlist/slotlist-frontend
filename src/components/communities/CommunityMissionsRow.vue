<template>
  <tr>
    <td>{{ formatDateTime(communityMission.startTime) }}</td>
    <td>{{ communityMission.title }}</td>
    <td>{{ communityMission.shortDescription }}</td>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: communityMission.creator.uid}}">{{ formatUserWithTag(communityMission.creator) }}</router-link>
    </td>
    <td class="text-center">
      <router-link tag="button" class="btn btn-primary btn-sm" :to="{name: 'missionDetails', params: {missionSlug: communityMission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> Details
      </router-link>
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
