<template>
  <tr>
    <td>{{ formatDateTime(mission.startTime) }}</td>
    <td>{{ mission.title }}</td>
    <td>{{ mission.description }}</td>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: mission.creator.uid}}">{{ formatUserWithTag(mission.creator) }}</router-link>
    </td>
    <td class="text-center">
      <b-popover v-if="mission.isAssignedToAnySlot" :content="$t('mission.list.slotStatus.assigned')" :triggers="['hover']">
        <i class="fa fa-check fa-lg text-success" aria-hidden="true"></i>
      </b-popover>
      <b-popover v-if="!mission.isAssignedToAnySlot && mission.isRegisteredForAnySlot" :content="$t('mission.list.slotStatus.registered')" :triggers="['hover']">
        <i class="fa fa-question-circle fa-lg text-muted" aria-hidden="true"></i>
      </b-popover>
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
