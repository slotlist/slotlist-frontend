<template>
  <tr>
    <td>{{ slot.orderNumber }}</td>
    <td>{{ slot.title }}</td>
    <td v-html="optionalAssignee"></td>
    <td>{{ slot.shortDescription }}</td>
  </tr>
</template>

<script>
import * as _ from 'lodash'

export default {
  computed: {
    optionalAssignee() {
      return _.isNil(this.slot.assignee) ? '<span class="text-muted font-italic">not assigned</span>' : this.slot.assignee.nickname
    }
  },
  props: [
    'slot'
  ]
}
</script>
