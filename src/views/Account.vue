<template>
  <div>
    <!-- Begin of content -->
    <div v-if="accountDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ accountDetails.nickname }}</h1>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.community') }}</h5>
            <p>
              <router-link v-if="accountDetails.community" :to="{name: 'communityDetails', params: {communitySlug: accountDetails.community.slug}}">{{ accountDetails.community.name }}</router-link>
              <span v-if="!accountDetails.community" class="text-muted font-italic">{{ $t('account.notAssociated') }}</span>
            </p>
          </div>
        </div>
        <hr class="my-4">
        <div class="row justify-content-center">
          <div class="btn-group" role="group" aria-label="Account actions">
            <b-btn variant="primary" v-b-modal.accountEditModal>
              <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
            </b-btn>
            <b-btn variant="secondary" @click="refreshAuthentication">
              <i class="fa fa-key" aria-hidden="true"></i> {{ $t('button.refresh.authentication') }}
            </b-btn>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('nav.missions') }}</h4>
          <account-missions></account-missions>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">{{ $t('account.permissions') }}</h4>
          <account-permissions></account-permissions>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <account-edit-modal></account-edit-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'

import AccountEditModal from '../components/account/modals/AccountEditModal.vue'
import AccountMissions from '../components/account/AccountMissions.vue'
import AccountPermissions from '../components/account/AccountPermissions.vue'

import utils from '../utils'

export default {
  components: {
    AccountEditModal,
    AccountMissions,
    AccountPermissions
  },
  beforeCreate: function() {
    this.$store.dispatch('getAccountDetails')
  },
  created: function() {
    utils.setTitle(this.$t('nav.account'))
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearAccountDetails')
  },
  computed: {
    accountDetails() {
      return this.$store.getters.accountDetails
    }
  },
  methods: {
    refreshAuthentication() {
      this.$store.dispatch("refreshToken").then(() => {
        this.$store.dispatch("getAccountDetails")
      })
    }
  }
}
</script>
