<template>
  <div>
    <table class="table table-striped" v-if="communityMembers">
      <thead>
        <tr>
          <th style="width: 70%">Nickname</th>
          <th style="width: 10%">Leader</th>
          <th style="width: 20%" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <community-members-row v-for="communityMember in communityMembers" :communityMember="communityMember" :key="communityMember.uid"></community-members-row>
      </tbody>
      <tfoot v-show="communityMembers.length >= 10">
        <tr>
          <th style="width: 70%">Nickname</th>
          <th style="width: 10%">Leader</th>
          <th style="width: 20%" class="text-center">Actions</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import CommunityMembersRow from './CommunityMembersRow.vue'

export default {
  components: {
    CommunityMembersRow
  },
  computed: {
    communityMembers() {
      return this.$store.getters.communityMembers
    }
  }
}
</script>
