<template>
  <div>
    <b-modal ref="accountDeleteModal" id="accountDeleteModal" v-if="accountDetails" :title="$t('account.modal.delete')" @show="clearAccountDeleteData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="deleteAccount">
          <div class="row">
            <div class="col-12" v-html="$t('account.delete.confirm')"></div>
          </div>
          <hr class="my-4">
          <div class="row">
            <div class="col col-12">
              <b-form-fieldset :label="$t('account.delete.nickname')" :description="$t('account.delete.nickname.description')" :feedback="accountEditNicknameFeedback" :state="accountEditNicknameState">
                <b-form-input v-model="accountDeleteData.nickname" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Account delete actions">
          <b-btn variant="danger" @click="deleteAccount">
            <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.confirm') }}
          </b-btn>
          <b-btn variant="secondary" @click="hideAccountDeleteModal">
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
      accountDeleteData: {
        nickname: null
      }
    }
  },
  computed: {
    accountDetails() {
      return this.$store.getters.accountDetails
    },
    accountEditNicknameFeedback() {
      return this.accountDeleteData.nickname !== this.accountDetails.nickname ? this.$t('account.delete.feedback.nickname') : ''
    },
    accountEditNicknameState() {
      return this.accountDeleteData.nickname !== this.accountDetails.nickname ? 'danger' : 'success'
    }
  },
  methods: {
    clearAccountDeleteData() {
      this.accountDeleteData = {
        nickname: null
      }
    },
    deleteAccount() {
      if (_.isEmpty(this.accountDeleteData.nickname)) {
        return
      }

      this.hideAccountDeleteModal()

      this.$store.dispatch('deleteAccount', { nickname: this.accountDeleteData.nickname })
    },
    hideAccountDeleteModal() {
      this.$refs.accountDeleteModal.hide()
    }
  }
}
</script>
