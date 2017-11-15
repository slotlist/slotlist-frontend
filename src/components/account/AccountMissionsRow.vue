<template>
  <tr>
    <td>{{ formatDateTime(accountMission.startTime) }}</td>
    <td>{{ accountMission.title }}</td>
    <td>{{ accountMission.description }}</td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'missionDetails', params: {missionSlug: accountMission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'accountMission'
  ]
}
</script>
