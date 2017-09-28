<template>
  <div>
    <b-modal id="missionPermissionModal" ref="missionPermissionModal" size="lg" :title="$t('mission.modal.permission')" @shown="setMissionPermissions" no-close-on-backdrop>
      <div class="container-fluid">
        <div class="row font-weight-bold">
          <div class="col col-12">{{ $t('mission.permission.existing') }}</div>
        </div>
        <br>
        <div class="row">
          <div class="col col-12">
            <mission-permissions :missionPermissions="missionPermissions"></mission-permissions>
          </div>
        </div>
        <hr class="my-4">
        <div class="row font-weight-bold">
          <div class="col col-12">{{ $t('mission.permission.create') }}</div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            <b-form @submit.stop.prevent="createMissionPermission">
              <div class="row">
                <div class="col">
                  <b-form-fieldset :label="$t('mission.permission.user.selection')" :state="missionPermissionCreateUserState" :description="$t('mission.permission.user.selection.description')">
                    <typeahead ref="missionPermissionCreateUserTypeahead" action="searchUsers" actionIndicator="searchingUsers" :onHit="permissionUserSelected"></typeahead>
                  </b-form-fieldset>
                </div>
                <div class="col">
                  <b-form-fieldset :label="$t('mission.permission.permission')" :state="missionPermissionCreatePermissionState" :description="$t('mission.permission.permission.description')">
                    <b-form-select v-model="missionPermissionCreate.permission" :options="missionPermissionCreatePermissionOptions"></b-form-select>
                  </b-form-fieldset>
                </div>
              </div>
              <div class="row">
                <div class="col text-center">
                  <b-btn variant="success" @click="createMissionPermission">
                    <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.mission.permission') }}
                  </b-btn>
                </div>
              </div>
            </b-form>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission permission actions">
          <b-btn @click="hideMissionPermissionModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.close') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionPermissions from '../MissionPermissions.vue'

export default {
  components: {
    MissionPermissions
  },
  data() {
    return {
      missionPermissionCreate: {
        userUid: null,
        permission: null
      },
      missionPermissionCreatePermissionOptions: [
        { value: 'editor', text: this.$t('mission.permission.editor') },
        { value: 'creator', text: this.$t('mission.permission.creator'), disabled: true }
      ]
    }
  },
  computed: {
    missionPermissionCreatePermissionState() {
      return _.isNil(this.missionPermissionCreate.permission) ? 'danger' : 'success'
    },
    missionPermissionCreateUserState() {
      return _.isNil(this.missionPermissionCreate.userUid) ? 'danger' : 'success'
    },
    missionPermissions() {
      return this.$store.getters.missionPermissions
    },
  },
  methods: {
    createMissionPermission() {
      if (_.isNil(this.missionPermissionCreate.userUid) || _.isNil(this.missionPermissionCreate.permission)) {
        return
      }

      this.hideMissionPermissionModal()

      const permission = `mission.${this.$route.params.missionSlug}.${this.missionPermissionCreate.permission}`
      const permissionDetails = {
        userUid: this.missionPermissionCreate.userUid,
        permission
      }

      this.$store.dispatch('createMissionPermission', {
        missionSlug: this.$route.params.missionSlug,
        permissionDetails
      })
    },
    hideMissionPermissionModal() {
      this.$refs.missionPermissionModal.hide()
    },
    permissionUserSelected(item) {
      this.missionPermissionCreate.userUid = item.value.uid
    },
    setMissionPermissions() {
      this.$store.dispatch('getMissionPermissions', { missionSlug: this.$route.params.missionSlug })

      this.missionPermissionCreate = {
        userUid: null,
        permission: null
      }

      this.$refs.missionPermissionCreateUserTypeahead.reset()
    }
  }
}
</script>
