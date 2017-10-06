<template>
  <tr>
    <td>{{ formatDateTime(userMission.startTime) }}</td>
    <td>{{ userMission.title }}</td>
    <td class="text-center">
      <router-link tag="button" class="btn btn-primary btn-sm" :to="{name: 'missionDetails', params: {missionSlug: userMission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </router-link>
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
