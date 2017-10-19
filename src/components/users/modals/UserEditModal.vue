<template>
  <div>
    <b-modal ref="userEditModal" id="userEditModal" :title="$t('user.modal.edit')" @show="setUserEditData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editUser">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('community.application.nickname')" :state="userEditNicknameState" :feedback="userEditNicknameFeedback">
                <b-form-input v-model="userEditData.nickname" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="User edit actions">
          <b-btn variant="success" @click="editUser">
            <i class="fa fa-save" aria-hidden="true"></i> {{ $t('button.save') }}
          </b-btn>
          <b-btn variant="secondary" @click="hideUserEditModal">
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
      userEditData: {
        nickname: null
      }
    }
  },
  computed: {
    userDetails() {
      return this.$store.getters.userDetails
    },
    userEditNicknameFeedback() {
      return _.isNil(this.userEditData.nickname) || _.isEmpty(this.userEditData.nickname) ? this.$t('account.feedback.nickname') : ''
    },
    userEditNicknameState() {
      return _.isNil(this.userEditData.nickname) || _.isEmpty(this.userEditData.nickname) ? 'danger' : 'success'
    }
  },
  methods: {
    editUser() {
      if (_.isEmpty(this.userEditData.nickname)) {
        return
      }

      const updatedUserDetails = {}
      _.each(this.userEditData, (value, key) => {
        if (!_.isEqual(value, this.userDetails[key])) {
          updatedUserDetails[key] = value
        }
      })

      this.hideUserEditModal()

      if (!_.isEmpty(updatedUserDetails)) {
        this.$store.dispatch('editUser', {
          userUid: this.$route.params.userUid,
          updatedUserDetails
        })
      }
    },
    hideUserEditModal() {
      this.$refs.userEditModal.hide()
    },
    setUserEditData() {
      this.userEditData = {
        nickname: this.userDetails.nickname
      }
    }
  }
}
</script>
