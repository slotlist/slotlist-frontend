<template>
  <div>
    <b-modal id="communityPermissionModal" ref="communityPermissionModal" size="lg" :title="$t('community.modal.permission')" @shown="setCommunityPermissions" no-close-on-backdrop>
      <div class="container-fluid">
        <div class="row font-weight-bold">
          <div class="col col-12">{{ $t('community.permission.existing') }}</div>
        </div>
        <br>
        <div class="row">
          <div class="col col-12">
            <community-permissions :communityPermissions="communityPermissions"></community-permissions>
          </div>
        </div>
        <hr class="my-4">
        <div class="row font-weight-bold">
          <div class="col col-12">{{ $t('community.permission.create') }}</div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            <b-form @submit.stop.prevent="createCommunityPermission">
              <div class="row">
                <div class="col">
                  <b-form-fieldset :label="$t('community.permission.user.selection')" :state="communityPermissionCreateUserState" :description="$t('community.permission.user.selection.description')">
                    <typeahead ref="communityPermissionCreateUserTypeahead" action="searchUsers" actionIndicator="searchingUsers" :onHit="permissionUserSelected"></typeahead>
                  </b-form-fieldset>
                </div>
                <div class="col">
                  <b-form-fieldset :label="$t('community.permission.permission')" :state="communityPermissionCreatePermissionState" :description="$t('community.permission.permission.description')">
                    <b-form-select v-model="communityPermissionCreate.permission" :options="communityPermissionCreatePermissionOptions"></b-form-select>
                  </b-form-fieldset>
                </div>
              </div>
              <div class="row">
                <div class="col text-center">
                  <b-btn variant="success" @click="createCommunityPermission">
                    <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.community.permission') }}
                  </b-btn>
                </div>
              </div>
            </b-form>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Community permission actions">
          <b-btn @click="hideCommunityPermissionModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.close') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'
import CommunityPermissions from '../CommunityPermissions.vue'

export default {
  components: {
    CommunityPermissions
  },
  data() {
    return {
      communityPermissionCreate: {
        userUid: null,
        permission: null
      }
    }
  },
  computed: {
    communityPermissionCreatePermissionOptions() {
      return [
        { value: 'leader', text: this.$t('community.permission.leader') },
        { value: 'recruitment', text: this.$t('community.permission.recruitment') }
      ]
    },
    communityPermissionCreatePermissionState() {
      return _.isNil(this.communityPermissionCreate.permission) ? 'danger' : 'success'
    },
    communityPermissionCreateUserState() {
      return _.isNil(this.communityPermissionCreate.userUid) ? 'danger' : 'success'
    },
    communityPermissions() {
      return this.$store.getters.communityPermissions
    },
  },
  methods: {
    createCommunityPermission() {
      if (_.isNil(this.communityPermissionCreate.userUid) || _.isNil(this.communityPermissionCreate.permission)) {
        return
      }

      const permission = `community.${this.$route.params.communitySlug}.${this.communityPermissionCreate.permission}`
      const permissionDetails = {
        userUid: this.communityPermissionCreate.userUid,
        permission
      }

      this.communityPermissionCreate = {
        userUid: null,
        permission: null
      }

      this.$refs.communityPermissionCreateUserTypeahead.reset()

      this.$store.dispatch('createCommunityPermission', {
        communitySlug: this.$route.params.communitySlug,
        permissionDetails
      })
    },
    hideCommunityPermissionModal() {
      this.$refs.communityPermissionModal.hide()
    },
    permissionUserSelected(item) {
      this.communityPermissionCreate.userUid = item.value.uid
    },
    setCommunityPermissions() {
      this.$store.dispatch('getCommunityPermissions', { communitySlug: this.$route.params.communitySlug })

      this.communityPermissionCreate = {
        userUid: null,
        permission: null
      }

      this.$refs.communityPermissionCreateUserTypeahead.reset()
    }
  }
}
</script>
