<template>
  <div>
    <b-modal id="communityLogoModal" ref="communityLogoModal" v-if="communityDetails" :title="$t('community.modal.logo')" @shown="setCommunityLogoData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="uploadCommunityLogo">
          <div class="row">
            <div class="col text-center" v-if="communityLogoData.url">
              <img :src="communityLogoData.url" style="max-width: 100%; max-height: 100px">
              <br><br>
            </div>
            <div class="col text-center font-italic" v-else>
              {{ $t('community.logo.notSelected') }}
              <br><br>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('community.logo')" :state="communityLogoState" :feedback="communityLogoFeedback" :description="$t('community.logo.description')">
                <b-form-file id="communityLogoSelection" ref="communityLogoSelection" v-model="communityLogoData.file" accept="image/jpeg, image/png, image/gif" :choose-label="$t('community.logo.choose')"></b-form-file>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Community logo actions">
          <b-btn variant="success" @click="uploadCommunityLogo">
            <i class="fa fa-upload" aria-hidden="true"></i> {{ $t('button.upload') }}
          </b-btn>
          <b-btn variant="danger" @click="deleteCommunityLogo" :disabled="!communityLogoData.url">
            <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
          </b-btn>
          <b-btn @click="hideCommunityLogoModal">
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
      communityLogoData: {
        file: null,
        url: null
      },
      communityLogoFileTypeRegex: /image\/(jpeg|png|gif)/,
      communityLogoMaxSize: 2097152 // Allow max. upload size of 2 MiB
    }
  },
  computed: {
    communityLogoFeedback() {
      if (_.isNil(this.communityLogoData.file)) {
        return ''
      }

      if (this.communityLogoData.file.size > this.communityLogoMaxSize) {
        return this.$t('community.logo.feedback.size')
      } else if (!this.communityLogoData.file.type.match(this.communityLogoFileTypeRegex)) {
        return this.$t('community.logo.feedback.fileType')
      }

      return ''
    },
    communityLogoState() {
      if (_.isNil(this.communityLogoData.file)) {
        return 'success'
      }

      if (this.communityLogoData.file.size > this.communityLogoMaxSize) {
        return 'danger'
      } else if (!this.communityLogoData.file.type.match(this.communityLogoFileTypeRegex)) {
        return 'danger'
      }

      return 'success'
    },
    communityDetails() {
      return this.$store.getters.communityDetails
    }
  },
  methods: {
    deleteCommunityLogo() {
      this.hideCommunityLogoModal()

      this.$store.dispatch('deleteCommunityLogo', {
        communitySlug: this.$route.params.communitySlug
      })
    },
    hideCommunityLogoModal() {
      this.$refs.communityLogoModal.hide()
    },
    setCommunityLogoData() {
      this.communityLogoData = {
        file: null,
        url: this.communityDetails.logoUrl
      }

      this.$refs.communityLogoSelection.reset()
    },
    uploadCommunityLogo() {
      if (_.isNil(this.communityLogoData.file)
        || this.communityLogoData.file.size > this.communityLogoMaxSize
        || !this.communityLogoData.file.type.match(this.communityLogoFileTypeRegex)) {
        return
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.hideCommunityLogoModal()

        this.$store.dispatch('uploadCommunityLogo', {
          communitySlug: this.$route.params.communitySlug,
          imageType: this.communityLogoData.file.type,
          imageData: fileReader.result
        })
      })

      fileReader.readAsDataURL(this.communityLogoData.file);
    }
  }
}
</script>
