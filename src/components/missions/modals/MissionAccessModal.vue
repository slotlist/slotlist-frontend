<template>
  <div>
    <b-modal id="missionAccessModal" ref="missionAccessModal" size="lg" :title="$t('mission.modal.access')" @shown="setMissionAccesses" no-close-on-backdrop>
      <div class="container-fluid">
        <div class="row">
          <div class="col col-12 font-weight-bold">{{ $t('mission.access.existing') }}</div>
        </div>
        <br>
        <div class="row">
          <div class="col col-12">
            <mission-accesses :missionAccesses="missionAccesses"></mission-accesses>
          </div>
        </div>
        <hr class="my-4">
        <div class="row">
          <div class="col col-12 font-weight-bold">{{ $t('mission.access.add') }}</div>
          <div class="col col-12" v-html="$t('mission.access.add.explanation')"></div>
        </div>
        <br>
        <div class="row">
          <div class="col">
            <b-form @submit.stop.prevent="addMissionAccess">
              <div class="row">
                <div class="col">
                  <b-form-fieldset :label="$t('mission.access.community.selection')" :state="missionAccessAddCommunityState" :description="$t('mission.access.community.selection.description')">
                    <typeahead ref="missionAccessAddCommunityTypeahead" action="searchCommunities" actionIndicator="searchingCommunities" :onHit="permissionCommunitySelected"></typeahead>
                  </b-form-fieldset>
                </div>
                <div class="col">
                  <b-form-fieldset :label="$t('mission.access.user.selection')" :state="missionAccessAddUserState" :description="$t('mission.access.user.selection.description')">
                    <typeahead ref="missionAccessAddUserTypeahead" action="searchUsers" actionIndicator="searchingUsers" :onHit="permissionUserSelected"></typeahead>
                  </b-form-fieldset>
                </div>
              </div>
              <div class="row">
                <div class="col text-center">
                  <b-btn variant="success" @click="addMissionAccess">
                    <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.add.mission.access') }}
                  </b-btn>
                </div>
              </div>
            </b-form>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission access actions">
          <b-btn @click="hideMissionAccessModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.close') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'
import MissionAccesses from '../MissionAccesses.vue'

export default {
  components: {
    MissionAccesses
  },
  data() {
    return {
      missionAccessAdd: {
        communityUid: null,
        userUid: null
      }
    }
  },
  computed: {
    missionAccessAddCommunityState() {
      if ((_.isNil(this.missionAccessAdd.communityUid) && _.isNil(this.missionAccessAdd.userUid)) || (!_.isNil(this.missionAccessAdd.communityUid) && !_.isNil(this.missionAccessAdd.userUid))) {
        return 'danger'
      }

      return 'success'
    },
    missionAccessAddUserState() {
      if ((_.isNil(this.missionAccessAdd.communityUid) && _.isNil(this.missionAccessAdd.userUid)) || (!_.isNil(this.missionAccessAdd.communityUid) && !_.isNil(this.missionAccessAdd.userUid))) {
        return 'danger'
      }

      return 'success'
    },
    missionAccesses() {
      return this.$store.getters.missionAccesses
    },
  },
  methods: {
    addMissionAccess() {
      if (_.isNil(this.missionAccessAdd.communityUid) && _.isNil(this.missionAccessAdd.userUid)) {
        return
      }

      const missionAccessDetails = {
        communityUid: _.isNil(this.missionAccessAdd.communityUid) ? undefined : this.missionAccessAdd.communityUid,
        userUid: _.isNil(this.missionAccessAdd.userUid) ? undefined : this.missionAccessAdd.userUid
      }

      this.$refs.missionAccessAddCommunityTypeahead.reset()
      this.$refs.missionAccessAddUserTypeahead.reset()

      this.$store.dispatch('addMissionAccess', {
        missionSlug: this.$route.params.missionSlug,
        missionAccessDetails
      })
    },
    hideMissionAccessModal() {
      this.$refs.missionAccessModal.hide()
    },
    permissionCommunitySelected(item) {
      this.missionAccessAdd.communityUid = item.value.uid

      if (!_.isNil(this.missionAccessAdd.userUid)) {
        this.missionAccessAdd.userUid = null
        this.$refs.missionAccessAddUserTypeahead.reset()
      }
    },
    permissionUserSelected(item) {
      this.missionAccessAdd.userUid = item.value.uid

      if (!_.isNil(this.missionAccessAdd.communityUid)) {
        this.missionAccessAdd.communityUid = null
        this.$refs.missionAccessAddCommunityTypeahead.reset()
      }
    },
    setMissionAccesses() {
      this.$store.dispatch('getMissionAccesses', { missionSlug: this.$route.params.missionSlug })

      this.missionAccessAdd = {
        communityUid: null,
        userUid: null
      }

      this.$refs.missionAccessAddCommunityTypeahead.reset()
      this.$refs.missionAccessAddUserTypeahead.reset()
    }
  }
}
</script>
