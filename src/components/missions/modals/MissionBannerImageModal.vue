<template>
  <div>
    <b-modal id="missionBannerImageModal" ref="missionBannerImageModal" v-if="missionDetails" :title="$t('mission.modal.bannerImage')" @shown="setMissionBannerImageData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="uploadMissionBannerImage">
          <div class="row">
            <div class="col text-center" v-if="missionBannerImageData.url">
              <img :src="missionBannerImageData.url" style="max-width: 100%; max-height: 150px">
              <br><br>
            </div>
            <div class="col text-center font-italic" v-else>
              {{ $t('mission.bannerImage.notSelected') }}
              <br><br>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.bannerImage')" :state="missionBannerImageState" :feedback="missionBannerImageFeedback" :description="$t('mission.bannerImage.description')">
                <b-form-file id="missionBannerImageSelection" ref="missionBannerImageSelection" v-model="missionBannerImageData.file" accept="image/jpeg, image/png, image/gif" :choose-label="$t('mission.bannerImage.choose')"></b-form-file>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission banner image actions">
          <b-btn variant="success" @click="uploadMissionBannerImage">
            <i class="fa fa-upload" aria-hidden="true"></i> {{ $t('button.upload') }}
          </b-btn>
          <b-btn variant="danger" @click="deleteMissionBannerImage" :disabled="!missionBannerImageData.url">
            <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
          </b-btn>
          <b-btn @click="hideMissionBannerImageModal">
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
      missionBannerImageData: {
        file: null,
        url: null
      },
      missionBannerImageFileTypeRegex: /image\/(jpeg|png|gif)/,
      missionBannerImageMaxSize: 2097152 // Allow max. upload size of 2 MiB
    }
  },
  computed: {
    missionBannerImageFeedback() {
      if (_.isNil(this.missionBannerImageData.file)) {
        return ''
      }

      if (this.missionBannerImageData.file.size > this.missionBannerImageMaxSize) {
        return this.$t('mission.bannerImage.feedback.size')
      } else if (!this.missionBannerImageData.file.type.match(this.missionBannerImageFileTypeRegex)) {
        return this.$t('mission.bannerImage.feedback.fileType')
      }

      return ''
    },
    missionBannerImageState() {
      if (_.isNil(this.missionBannerImageData.file)) {
        return 'success'
      }

      if (this.missionBannerImageData.file.size > this.missionBannerImageMaxSize) {
        return 'danger'
      } else if (!this.missionBannerImageData.file.type.match(this.missionBannerImageFileTypeRegex)) {
        return 'danger'
      }

      return 'success'
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    }
  },
  methods: {
    deleteMissionBannerImage() {
      this.hideMissionBannerImageModal()

      this.$store.dispatch('deleteMissionBannerImage', {
        missionSlug: this.$route.params.missionSlug
      })
    },
    hideMissionBannerImageModal() {
      this.$refs.missionBannerImageModal.hide()
    },
    setMissionBannerImageData() {
      this.missionBannerImageData = {
        file: null,
        url: this.missionDetails.bannerImageUrl
      }

      this.$refs.missionBannerImageSelection.reset()
    },
    uploadMissionBannerImage() {
      if (_.isNil(this.missionBannerImageData.file)
        || this.missionBannerImageData.file.size > this.missionBannerImageMaxSize
        || !this.missionBannerImageData.file.type.match(this.missionBannerImageFileTypeRegex)) {
        return
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.hideMissionBannerImageModal()

        this.$store.dispatch('uploadMissionBannerImage', {
          missionSlug: this.$route.params.missionSlug,
          imageType: this.missionBannerImageData.file.type,
          imageData: fileReader.result
        })
      })

      fileReader.readAsDataURL(this.missionBannerImageData.file);
    }
  }
}
</script>
