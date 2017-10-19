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
          <div class="col">
            <h5>{{ $t('account.timezone') }}</h5>
            <p>{{ timezone }}
              <span class="text-muted small" if="currentTime">({{ $t('account.currentTime') }} {{ currentTime }})</span>
            </p>
          </div>
        </div>
        <hr class="my-4">
        <div class="row justify-content-center">
          <b-btn variant="primary" v-b-modal.accountEditModal>
            <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
          </b-btn>&nbsp;
          <b-popover :content="$t('button.refresh.authentication.explanation')" :triggers="['hover']">
            <b-btn variant="secondary" @click="refreshAuthentication">
              <i class="fa fa-key" aria-hidden="true"></i> {{ $t('button.refresh.authentication') }}
            </b-btn>
          </b-popover>&nbsp;
          <b-btn variant="danger" v-b-modal.accountDeleteModal>
            <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete.account') }}
          </b-btn>
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
      <account-delete-modal></account-delete-modal>
      <account-edit-modal></account-edit-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

import AccountDeleteModal from '../components/account/modals/AccountDeleteModal.vue'
import AccountEditModal from '../components/account/modals/AccountEditModal.vue'
import AccountMissions from '../components/account/AccountMissions.vue'
import AccountPermissions from '../components/account/AccountPermissions.vue'

import utils from '../utils'

export default {
  components: {
    AccountDeleteModal,
    AccountEditModal,
    AccountMissions,
    AccountPermissions
  },
  beforeCreate: function() {
    this.$store.dispatch('getAccountDetails')
  },
  created: function() {
    utils.setTitle(this.$t('nav.account'))

    this.currentTime = moment().format('L LTS')
    this.currentTimeSetInterval = setInterval(() => {
      this.currentTime = moment().format('L LTS')
    }, 1000)
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearAccountDetails')

    if (!_.isNil(this.currentTimeSetInterval)) {
      clearInterval(this.currentTimeSetInterval)
    }
  },
  data() {
    return {
      currentTime: null,
      currentTimeSetInterval: null
    }
  },
  computed: {
    accountDetails() {
      return this.$store.getters.accountDetails
    },
    timezone() {
      return this.$store.getters.timezone
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
