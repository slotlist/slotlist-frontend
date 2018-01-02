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
          <div class="col col-12">{{ $t('mission.permission.add') }}</div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            <b-form @submit.stop.prevent="addMissionPermission">
              <div class="row">
                <div class="col">
                  <b-form-fieldset :label="$t('mission.permission.user.selection')" :state="missionPermissionAddUserState" :description="$t('mission.permission.user.selection.description')">
                    <typeahead ref="missionPermissionAddUserTypeahead" action="searchUsers" actionIndicator="searchingUsers" :onHit="permissionUserSelected"></typeahead>
                  </b-form-fieldset>
                </div>
                <div class="col">
                  <b-form-fieldset :label="$t('mission.permission.permission')" :state="missionPermissionAddPermissionState" :description="$t('mission.permission.permission.description')">
                    <b-form-select v-model="missionPermissionAdd.permission" :options="missionPermissionAddPermissionOptions"></b-form-select>
                  </b-form-fieldset>
                </div>
              </div>
              <div class="row">
                <div class="col text-center">
                  <b-form-fieldset :label="$t('notification.suppress')" state="success" :description="$t('notification.suppress.description')">
                    <b-form-checkbox v-model="missionPermissionAddSuppressNotifications"></b-form-checkbox>
                  </b-form-fieldset>
                </div>
              </div>
              <div class="row">
                <div class="col text-center">
                  <b-btn variant="success" @click="addMissionPermission">
                    <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.add.mission.permission') }}
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
      missionPermissionAdd: {
        userUid: null,
        permission: null
      },
      missionPermissionAddSuppressNotifications: false
    }
  },
  computed: {
    missionPermissionAddPermissionOptions() {
      return [
        { value: 'editor', text: this.$t('mission.permission.editor') },
        { value: 'slotlist.community', text: this.$t('mission.permission.slotlist.community') }
      ]
    },
    missionPermissionAddPermissionState() {
      return _.isNil(this.missionPermissionAdd.permission) ? 'danger' : 'success'
    },
    missionPermissionAddUserState() {
      return _.isNil(this.missionPermissionAdd.userUid) ? 'danger' : 'success'
    },
    missionPermissions() {
      return this.$store.getters.missionPermissions
    },
  },
  methods: {
    addMissionPermission() {
      if (_.isNil(this.missionPermissionAdd.userUid) || _.isNil(this.missionPermissionAdd.permission)) {
        return
      }

      const permission = `mission.${this.$route.params.missionSlug}.${this.missionPermissionAdd.permission}`
      const permissionDetails = {
        userUid: this.missionPermissionAdd.userUid,
        permission
      }
      const suppressNotifications = this.missionPermissionAddSuppressNotifications

      this.missionPermissionAdd = {
        userUid: null,
        permission: null
      }

      this.missionPermissionAddSuppressNotifications = false

      this.$refs.missionPermissionAddUserTypeahead.reset()

      this.$store.dispatch('addMissionPermission', {
        missionSlug: this.$route.params.missionSlug,
        permissionDetails,
        suppressNotifications
      })
    },
    hideMissionPermissionModal() {
      this.$refs.missionPermissionModal.hide()
    },
    permissionUserSelected(item) {
      this.missionPermissionAdd.userUid = item.value.uid
    },
    setMissionPermissions() {
      this.$store.dispatch('getMissionPermissions', { missionSlug: this.$route.params.missionSlug })

      this.missionPermissionAdd = {
        userUid: null,
        permission: null
      }

      this.missionPermissionAddSuppressNotifications = false

      this.$refs.missionPermissionAddUserTypeahead.reset()
    }
  }
}
</script>
