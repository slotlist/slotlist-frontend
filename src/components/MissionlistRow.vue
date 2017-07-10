<template>
  <tr>
    <td>{{ info.title }}</td>
    <td>{{ info.initiator }}</td>
    <td>{{ info.shortDescription }}</td>
    <td>
      <router-link :to="{name: 'missionList', params: {slug: 'asd'}}">Mission Details</router-link>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'info'
  ]
}
</script>
