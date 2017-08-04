<template>
  <div>
    <!-- Begin of content -->
    <div v-if="accountDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ accountDetails.nickname }}</h1>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>Community</h5>
            <p>
              <router-link v-if="accountDetails.community" :to="{name: 'communityDetails', params: {communitySlug: accountDetails.community.slug}}">{{ accountDetails.community.name }}</router-link>
              <span v-if="!accountDetails.community" class="text-muted font-italic">not associated</span>
            </p>
          </div>
        </div>
        <hr class="my-4">
        <div class="row justify-content-center">
          <div class="btn-group" role="group" aria-label="Account actions">
            <button type="button" class="btn btn-primary" @click="showAccountEditModal">
              <i class="fa fa-edit" aria-hidden="true"></i> Edit
            </button>
            <button type="button" class="btn btn-secondary" @click="refreshAuthentication">
              <i class="fa fa-key" aria-hidden="true"></i> Refresh Authentication
            </button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Missions</h4>
          <account-missions></account-missions>
        </div>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h4 class="card-title">Permissions</h4>
          <account-permissions></account-permissions>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <b-modal ref="accountEditModal" id="accountEditModal" size="lg" title="Edit account details" @show="populateAccountEditModal">
        <div class="container-fluid">
          <b-form @submit.stop.prevent="editAccount">
            <div class="row">
              <div class="col">
                <b-form-fieldset label="Nickname" :state="accountEditNicknameState" :feedback="accountEditNicknameFeedback">
                  <b-form-input v-model="accountEdit.nickname" type="text" required></b-form-input>
                </b-form-fieldset>
              </div>
            </div>
          </b-form>
        </div>
        <div slot="modal-footer">
          <div class="btn-group" role="group" aria-label="Account edit actions">
            <button type="button" class="btn btn-success" @click="editAccount">
              <i class="fa fa-save" aria-hidden="true"></i> Save
            </button>
            <button type="button" class="btn btn-secondary" @click="hideAccountEditModal">
              <i class="fa fa-close" aria-hidden="true"></i> Cancel
            </button>
          </div>
        </div>
      </b-modal>
    </div>
    <!-- End of modals -->
    <!-- Begin of overlays -->
    <div>
    </div>
    <!-- End of overlays -->
  </div>
</template>

<script>
import * as _ from 'lodash'

import AccountMissions from '../components/account/AccountMissions.vue'
import AccountPermissions from '../components/account/AccountPermissions.vue'

import utils from '../utils'

export default {
  components: {
    AccountMissions,
    AccountPermissions
  },
  beforeCreate: function () {
    this.$store.dispatch('getAccountDetails')
  },
  created: function () {
    utils.setTitle('Account')
  },
  beforeDestroy: function () {
    this.$store.dispatch('clearAccountDetails')
  },
  data() {
    return {
      accountEdit: {
        nickname: null
      }
    }
  },
  computed: {
    accountDetails() {
      return this.$store.getters.accountDetails
    },
    accountEditNicknameFeedback() {
      return _.isNil(this.accountEdit.nickname) || _.isEmpty(this.accountEdit.nickname) ? 'Please enter a nickname' : ''
    },
    accountEditNicknameState() {
      return _.isNil(this.accountEdit.nickname) || _.isEmpty(this.accountEdit.nickname) ? 'danger' : 'success'
    }
  },
  methods: {
    editAccount() {
      this.hideAccountEditModal()

      const updatedAccountDetails = {}
      _.each(this.accountEdit, (value, key) => {
        if (!_.isEqual(value, this.accountDetails[key])) {
          updatedAccountDetails[key] = value
        }
      })

      if (_.isEmpty(updatedAccountDetails)) {
        return this.$store.dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'warning',
          alertMessage: `<i class="fa fa-warning" aria-hidden="true"></i> No changes made to account details`
        })
      }

      this.$store.dispatch('editAccount', {
        updatedAccountDetails
      })
    },
    hideAccountEditModal() {
      this.$refs.accountEditModal.hide()
    },
    populateAccountEditModal() {
      this.accountEdit.nickname = this.accountDetails.nickname
    },
    refreshAuthentication() {
      this.$store.dispatch("refreshToken").then(() => {
        this.$store.dispatch("getAccountDetails")
      })
    },
    showAccountEditModal() {
      this.$refs.accountEditModal.show()
    }
  }
}
</script>
