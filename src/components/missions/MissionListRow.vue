<template>
  <tr>
    <td>{{ formatDateTime(mission.startTime) }}</td>
    <td>{{ mission.title }}</td>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: mission.creator.uid}}">{{ formatUserWithTag(mission.creator) }}</router-link>
    </td>
    <td class="text-center">
      <b-popover :content="$t('mission.list.slot.counts.popover', mission.slotCounts)" :triggers="['hover']">
        {{ mission.slotCounts.open }}/{{ mission.slotCounts.total }}
      </b-popover>
    </td>
    <td class="text-center">
      <b-popover v-if="mission.isAssignedToAnySlot" :content="$t('mission.list.slot.status.assigned')" :triggers="['hover']">
        <i class="fa fa-check fa-lg text-success" aria-hidden="true"></i>
      </b-popover>
      <b-popover v-if="!mission.isAssignedToAnySlot && mission.isRegisteredForAnySlot" :content="$t('mission.list.slot.status.registered')" :triggers="['hover']">
        <i class="fa fa-question-circle fa-lg text-muted" aria-hidden="true"></i>
      </b-popover>
    </td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'missionDetails', params: {missionSlug: mission.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
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
