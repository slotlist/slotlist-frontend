<template>
  <tr>
    <td>{{ info.id }}</td>
    <td>{{ info.name }}</td>
    <td></td>
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