<template>
  <div>
    <mission-slotlist-table></mission-slotlist-table>
    <div>
      <button type="button" class="btn btn-primary">Do stuff</button>
      <button type="button" class="btn btn-danger">Delete</button>
    </div>
  </div>
</template>

<script>
import MissionSlotlistTable from './MissionSlotlistTable.vue'

export default {
  components: {
    MissionSlotlistTable
  }
}
</script>
