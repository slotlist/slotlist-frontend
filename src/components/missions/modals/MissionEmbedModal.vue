<template>
  <div>
    <b-modal id="missionEmbedModal" ref="missionEmbedModal" size="lg" :title="$t('mission.modal.embed')" @shown="setMissionEmbedInformation" no-close-on-backdrop>
      <div class="container-fluid">
        <div class="row">
          <div class="col col-12 font-weight-bold" v-html="$t('mission.token')"></div>
        </div>
        <div class="row">
          <div class="col col-12" v-html="$t('mission.token.description')"></div>
        </div>
        <br>
        <div class="row">
          <div class="col col-12 text-center" v-html="formattedMissionToken"></div>
        </div>
        <br>
        <div class="row">
          <div class="col col-12 text-center">
            <b-btn variant="primary" @click="generateMissionToken">
              <i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('button.generate') }}
            </b-btn>
            <b-btn variant="danger" @click="deleteMissionToken" :disabled="missionToken === null">
              <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
            </b-btn>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission embed actions">
          <b-btn @click="hideMissionEmbedModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.close') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  computed: {
    formattedMissionToken() {
      return _.isNil(this.missionToken) ? `<code><em>${this.$t('mission.token.notGeneratedYet')}</em></code>` : `<code>${this.missionToken}</code>`
    },
    missionToken() {
      return this.$store.getters.missionToken
    }
  },
  methods: {
    deleteMissionToken() {
      this.$store.dispatch('deleteMissionToken', { missionSlug: this.$route.params.missionSlug })
    },
    generateMissionToken() {
      this.$store.dispatch('generateMissionToken', { missionSlug: this.$route.params.missionSlug })
    },
    hideMissionEmbedModal() {
      this.$refs.missionEmbedModal.hide()
    },
    setMissionEmbedInformation() {
      this.$store.dispatch('getMissionToken', { missionSlug: this.$route.params.missionSlug })
    }
  }
}
</script>
