<template>
  <div>
    <table class="table table-striped" v-if="communities">
      <thead>
        <tr>
          <th style="width: 15%">Tag</th>
          <th style="width: 45%">Name</th>
          <th style="width: 30%">Website</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <community-list-row v-for="community in communities" :community="community" :key="community.uid"></community-list-row>
      </tbody>
      <tfoot v-show="communities.length >= 10">
        <tr>
          <th style="width: 15%">Tag</th>
          <th style="width: 45%">Name</th>
          <th style="width: 30%">Website</th>
          <th style="width: 10%" class="text-center">Actions</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import CommunityListRow from './CommunityListRow.vue'

export default {
  components: {
    CommunityListRow
  },
  computed: {
    communities() {
      return this.$store.getters.communities
    }
  }
}
</script>
