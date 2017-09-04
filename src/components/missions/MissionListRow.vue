<template>
  <tr>
    <td>{{ formatDateTime(mission.startTime) }}</td>
    <td>{{ mission.title }}</td>
    <td>{{ mission.shortDescription }}</td>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: mission.creator.uid}}">{{ formatUserWithTag(mission.creator) }}</router-link>
    </td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'missionDetails', params: {missionSlug: mission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('misc.details') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'mission'
  ]
}
</script>
