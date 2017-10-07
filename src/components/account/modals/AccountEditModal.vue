<template>
  <div>
    <b-modal ref="accountEditModal" id="accountEditModal" :title="$t('account.modal.edit')" @show="setAccountEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editAccount">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('community.application.nickname')" :state="accountEditNicknameState" :feedback="accountEditNicknameFeedback">
                <b-form-input v-model="accountEditData.nickname" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('account.timezone')" state="success">
                <b-form-select v-model="accountEditTimezone" :options="accountEditTimezoneOptions" required></b-form-select>
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
import moment from 'moment-timezone'

export default {
  data() {
    return {
      accountEditData: {
        nickname: null
      },
      accountEditTimezone: null
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
    },
    accountEditTimezoneOptions() {
      return _.map(moment.tz.names(), (name) => {
        return { value: name, text: name }
      })
    },
    timezone() {
      return this.$store.getters.timezone
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

      const timezoneUpdated = this.accountEditTimezone !== this.timezone
      if (timezoneUpdated) {
        this.$store.dispatch('setTimezone', this.accountEditTimezone)
      }

      if (_.isEmpty(updatedAccountDetails) && !timezoneUpdated) {
        return this.$store.dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'warning',
          alertMessage: `<i class="fa fa-warning" aria-hidden="true"></i> ${this.$t('account.noChanges')}`
        })
      } else if (!_.isEmpty(updatedAccountDetails)) {
        this.$store.dispatch('editAccount', {
          updatedAccountDetails
        })
      }
    },
    hideAccountEditModal() {
      this.$refs.accountEditModal.hide()
    },
    setAccountEditData() {
      this.accountEditData = {
        nickname: this.accountDetails.nickname
      }
      this.accountEditTimezone = this.timezone
    }
  }
}
</script>
