<template>
  <tr>
    <td>{{ formatDateTime(mission.startTime) }}</td>
    <td :class="{'text-primary': isMissionEditor}">
      <b-popover v-if="isMissionEditor" :content="$t('mission.list.isMissionEditor')" :triggers="['hover']">
        {{ mission.title }}
      </b-popover>
      <span v-else>{{ mission.title }}</span>
      </td>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: mission.creator.uid}}">{{ formatUserWithTag(mission.creator) }}</router-link>
    </td>
    <td class="text-center">
      <b-popover :content="$t('mission.list.slot.counts.popover', mission.slotCounts)" :triggers="['hover']">
        {{ mission.slotCounts.assigned + mission.slotCounts.unassigned }}/{{ mission.slotCounts.total }}
      </b-popover>
    </td>
    <td class="text-center">
      <b-popover :content="isUserInCommunity ? $t('mission.list.slot.counts.available.popover.community', {open: mission.slotCounts.open}) : $t('mission.list.slot.counts.available.popover', {open: mission.slotCounts.open})" :triggers="['hover']">
        {{ mission.slotCounts.open }}
      </b-popover>
    </td>
    <td>
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
import * as _ from 'lodash'

export default {
  props: [
    'mission'
  ],
  computed: {
    isMissionEditor() {
      return this.$acl.can([`mission.${this.mission.slug}.creator`, `mission.${this.mission.slug}.editor`], false, true)
    },
    isUserInCommunity() {
      const user = this.$store.getters.user
      if (_.isNil(user)) {
        return false
      }

      return !_.isNil(user.community)
    }
  }
}
</script>
