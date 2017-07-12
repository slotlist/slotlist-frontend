<template>
  <tr>
    <td>{{ info.number }}</td>
    <td>{{ info.role }}</td>
    <td>{{ info.player }}</td>
    <td>{{ info.comment }}</td>
  </tr>
</template>

<script>
export default {
  props: [
    'info'
  ]
}
</script>
