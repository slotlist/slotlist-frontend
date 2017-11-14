<template>
  <tr>
    <td>{{ formatDateTime(userMission.startTime) }}</td>
    <td>{{ userMission.title }}</td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'missionDetails', params: {missionSlug: userMission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'userMission'
  ]
}
</script>
