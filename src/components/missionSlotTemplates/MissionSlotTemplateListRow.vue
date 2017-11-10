<template>
  <tr>
    <td>{{ missionSlotTemplate.title }}</td>
    <td>
      <router-link :to="{name: 'userDetails', params: {userUid: missionSlotTemplate.creator.uid}}">{{ formatUserWithTag(missionSlotTemplate.creator) }}</router-link>
    </td>
    <td class="text-center">{{ missionSlotTemplate.slotGroupCount }}</td>
    <td class="text-center">{{ missionSlotTemplate.slotCount }}</td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'missionSlotTemplateDetails', params: {missionSlotTemplateUid: missionSlotTemplate.uid}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'missionSlotTemplate'
  ]
}
</script>
