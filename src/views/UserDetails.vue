<template>
  <div>
    <!-- Begin of content -->
    <div v-if="userDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ userDetails.nickname }}</h1>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>Community</h5>
            <p>
              <router-link v-if="userDetails.community" :to="{name: 'communityDetails', params: {communitySlug: userDetails.community.slug}}">{{ userDetails.community.name }}</router-link>
              <span v-if="!userDetails.community" class="text-muted font-italic">not associated</span>
            </p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Missions</h4>
          <user-missions></user-missions>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
    </div>
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
    </div>
    <!-- End of overlays -->
  </div>
</template>

<script>
import UserMissions from '../components/users/UserMissions.vue'

import utils from '../utils'

export default {
  components: {
    UserMissions
  },
  beforeCreate: function () {
    this.$store.dispatch('getUserDetails', this.$route.params.userUid)
  },
  created: function () {
    utils.setTitle('User')
  },
  beforeDestroy: function () {
    this.$store.dispatch('clearUserDetails')
  },
  computed: {
    userDetails() {
      return this.$store.getters.userDetails
    }
  }
}
</script>
