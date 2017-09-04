<template>
  <div>
    <b-modal ref="accountEditModal" id="accountEditModal" title="Edit account details" @show="setAccountEditData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editAccount">
          <div class="row">
            <div class="col">
              <b-form-fieldset label="Nickname" :state="accountEditNicknameState" :feedback="accountEditNicknameFeedback">
                <b-form-input v-model="accountEditData.nickname" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Account edit actions">
          <b-btn variant="success" @click="editAccount">
            <i class="fa fa-save" aria-hidden="true"></i> {{ $t('button.save') }}
          </b-btn>
          <b-btn variant="secondary" @click="hideAccountEditModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  data() {
    return {
      accountEditData: {
        nickname: null
      }
    }
  },
  computed: {
    accountDetails() {
      return this.$store.getters.accountDetails
    },
    accountEditNicknameFeedback() {
      return _.isNil(this.accountEditData.nickname) || _.isEmpty(this.accountEditData.nickname) ? this.$t('account.feedback.nickname') : ''
    },
    accountEditNicknameState() {
      return _.isNil(this.accountEditData.nickname) || _.isEmpty(this.accountEditData.nickname) ? 'danger' : 'success'
    }
  },
  methods: {
    editAccount() {
      if (_.isEmpty(this.accountEditData.nickname)) {
        return
      }

      const updatedAccountDetails = {}
      _.each(this.accountEditData, (value, key) => {
        if (!_.isEqual(value, this.accountDetails[key])) {
          updatedAccountDetails[key] = value
        }
      })

      this.hideAccountEditModal()

      if (_.isEmpty(updatedAccountDetails)) {
        return this.$store.dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'warning',
          alertMessage: `<i class="fa fa-warning" aria-hidden="true"></i> ${this.$t('account.noChanges')}`
        })
      }

      this.$store.dispatch('editAccount', {
        updatedAccountDetails
      })
    },
    hideAccountEditModal() {
      this.$refs.accountEditModal.hide()
    },
    setAccountEditData() {
      this.accountEditData = {
        nickname: this.accountDetails.nickname
      }
    }
  }
}
</script>
