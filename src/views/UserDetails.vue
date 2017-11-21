<template>
  <div>
    <!-- Begin of content -->
    <div v-if="userDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ userDetails.nickname }}</h1>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.community') }}</h5>
            <p>
              <router-link v-if="userDetails.community" :to="{name: 'communityDetails', params: {communitySlug: userDetails.community.slug}}">[{{ userDetails.community.tag }}] {{ userDetails.community.name }}</router-link>
              <span v-if="!userDetails.community" class="text-muted font-italic">{{ $t('account.notAssociated') }}</span>
            </p>
          </div>
          <div class="col" v-if="isUserAdmin">
            <h5>
              <i class="fa fa-steam-square" aria-hidden="true"></i> {{ $t('user.steamId') }}</h5>
            <p>
              <a :href="`https://steamcommunity.com/profiles/${userDetails.steamId}`" target="_blank">
                {{ userDetails.steamId }}
              </a>
            </p>
          </div>
          <div class="col" v-if="isUserAdmin">
            <h5>
              <i class="fa fa-flag" aria-hidden="true"></i> {{ $t('user.status') }}
            </h5>
            <p :class="{'text-success': userDetails.active, 'text-danger': !userDetails.active}">
              <i class="fa" :class="{'fa-check': userDetails.active, 'fa-times': !userDetails.active}" aria-hidden="true"></i> {{ userDetails.active ? $t('user.status.normal') : $t('user.status.deactivated') }}
            </p>
          </div>
        </div>
        <hr class="my-4" v-if="isUserAdmin">
        <div class="row justify-content-center" v-if="isUserAdmin">
          <b-btn variant="primary" v-b-modal.userEditModal>
            <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
          </b-btn>&nbsp;
          <click-confirm v-if="userDetails.active" yes-icon="fa fa-user-times" yes-class="btn btn-warning" button-size="sm" :messages="{title: $t('user.confirm.deactivate'), yes: $t('button.confirm'), no: $t('button.cancel')}">
            <b-btn variant="warning" @click="modifyUserStatus(false)">
              <i class="fa fa-user-times" aria-hidden="true"></i> {{ $t('button.deactivate.user') }}
            </b-btn>
          </click-confirm>
          <click-confirm v-if="!userDetails.active" yes-icon="fa fa-user-plus" yes-class="btn btn-success" button-size="sm" :messages="{title: $t('user.confirm.activate'), yes: $t('button.confirm'), no: $t('button.cancel')}">
            <b-btn variant="success" @click="modifyUserStatus(true)">
              <i class="fa fa-user-plus" aria-hidden="true"></i> {{ $t('button.activate.user') }}
            </b-btn>
          </click-confirm>&nbsp;
          <click-confirm yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('user.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
            <b-btn variant="danger" @click="deleteUser">
              <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete.user') }}
            </b-btn>
          </click-confirm>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('nav.missions') }}</h4>
          <user-missions></user-missions>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <user-edit-modal v-if="isUserAdmin"></user-edit-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import UserEditModal from '../components/users/modals/UserEditModal.vue'
import UserMissions from '../components/users/UserMissions.vue'

import utils from '../utils'

export default {
  components: {
    UserEditModal,
    UserMissions
  },
  beforeCreate: function() {
    this.$store.dispatch('getUserDetails', this.$route.params.userUid)
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearUserDetails')
  },
  computed: {
    isUserAdmin() {
      return this.$acl.can(['admin.user'], true)
    },
    userDetails() {
      return this.$store.getters.userDetails
    }
  },
  methods: {
    deleteUser() {
      this.$store.dispatch('deleteUser', { userUid: this.$route.params.userUid })
    },
    modifyUserStatus(active) {
      this.$store.dispatch('editUser', {
        userUid: this.$route.params.userUid,
        updatedUserDetails: {
          active
        }
      })
    }
  }
}
</script>
