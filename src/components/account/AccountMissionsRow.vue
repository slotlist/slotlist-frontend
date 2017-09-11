<template>
  <tr>
    <td>{{ formatDateTime(accountMission.startTime) }}</td>
    <td>{{ accountMission.title }}</td>
    <td>{{ accountMission.description }}</td>
    <td class="text-center">
      <router-link tag="button" class="btn btn-primary btn-sm" :to="{name: 'missionDetails', params: {missionSlug: accountMission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </router-link>
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
