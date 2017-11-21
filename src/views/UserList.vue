<template>
  <div>
    <user-list-table v-if="users"></user-list-table>
    <nav v-show="usersPageCount > 1">
      <paginate ref="usersPaginate" :pageCount="usersPageCount" :initial-page="0" :clickHandler="usersPaginate" :container-class="'pagination justify-content-center'" :page-class="'page-item'" :page-link-class="'page-link'" :prev-class="'page-item'" :prev-link-class="'page-link'" :next-class="'page-item'" :next-link-class="'page-link'"></paginate>
    </nav>
    <div class="text-center">
      <b-btn :disabled="refreshingUsers" @click="usersPaginate(1)">
        <i class="fa fa-refresh" :class="{'fa-spin': refreshingUsers}" aria-hidden="true"></i> {{ $t('button.refresh') }}
      </b-btn>
    </div>
    <br>
    <div class="row justify-content-center">
      <div class="col-4 text-center">
        <h6>{{ $t('user.list.search') }}</h6>
        <b-form-fieldset :description="$t('user.list.search.description')">
          <typeahead ref="userSearchTypeahead" action="searchUsers" actionIndicator="searchingUsers" :onHit="userSelected"></typeahead>
        </b-form-fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import UserListTable from '../components/users/UserListTable.vue'
import utils from '../utils'

export default {
  components: {
    UserListTable
  },
  data() {
    return {
      userSearch: null
    }
  },
  beforeCreate: function() {
    if (_.isNil(this.$store.getters.users) || _.isEmpty(this.$store.getters.users) || _.isNil(this.$store.getters.usersRefreshSetInterval)) {
      this.$store.dispatch('getUsers', { autoRefresh: true })
    }
  },
  created: function() {
    utils.setTitle(this.$t('nav.users'))
  },
  computed: {
    refreshingUsers() {
      return this.$store.getters.refreshingUsers
    },
    users() {
      return this.$store.getters.users
    },
    usersPageCount() {
      return this.$store.getters.usersPageCount
    }
  },
  methods: {
    userSelected(item) {
      this.$router.push({ name: 'userDetails', params: {userUid: item.value.uid}})
    },
    usersPaginate(page) {
      this.$store.dispatch('getUsers', { page, autoRefresh: true })
    }
  }
}
</script>
