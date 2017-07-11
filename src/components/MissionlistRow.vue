<template>
  <tr>
    <td>{{ mission.title }}</td>
    <td>{{ mission.shortDescription }}</td>
    <td>{{ mission.initiator }}</td>
    <td class="text-center">
      <router-link :to="{name: 'missionDetails', params: {slug: mission.slug}}">Details</router-link>
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
