<template>
  <div>
    <b-modal ref="communityEditModal" id="communityEditModal" size="lg" :title="$t('community.modal.edit')" @show="setCommunityEditData">
      <div class="container-fluid">
        <b-form @submit.stop.prevent="editCommunity">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('community.name')" :state="communityEditNameState" :feedback="communityEditNameFeedback">
                <b-form-input v-model="communityEditData.name" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('community.tag')" :state="communityEditTagState" :feedback="communityEditTagFeedback">
                <b-form-input v-model="communityEditData.tag" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('community.website.optional')" :state="communityEditWebsiteState" :feedback="communityEditWebsiteFeedback">
                <b-form-input v-model="communityEditData.website" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Community edit actions">
          <b-btn variant="success" @click="editCommunity">
            <i class="fa fa-save" aria-hidden="true"></i> {{ $t('button.save') }}
          </b-btn>
          <b-btn variant="secondary" @click="hideCommunityEditModal">
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
      communityEditData: {
        name: null,
        tag: null,
        website: null
      }
    }
  },
  computed: {
    communityDetails() {
      return this.$store.getters.communityDetails
    },
    communityEditNameFeedback() {
      return _.isNil(this.communityEditData.name) || _.isEmpty(this.communityEditData.name) ? this.$t('community.creator.feedback.name') : ''
    },
    communityEditNameState() {
      return _.isNil(this.communityEditData.name) || _.isEmpty(this.communityEditData.name) ? 'danger' : 'success'
    },
    communityEditTagFeedback(proerty) {
      return _.isNil(this.communityEditData.tag) || _.isEmpty(this.communityEditData.tag) ? this.$t('community.creator.feedback.tag') : ''
    },
    communityEditTagState() {
      return _.isNil(this.communityEditData.tag) || _.isEmpty(this.communityEditData.tag) ? 'danger' : 'success'
    },
    communityEditWebsiteFeedback() {
      if (_.isNil(this.communityEditData.website) || _.isEmpty(this.communityEditData.website)) {
        return ''
      }

      return this.isCommunityEditWebsiteValidUrl ? '' : this.$t('community.creator.feedback.website')
    },
    communityEditWebsiteState() {
      if (_.isNil(this.communityEditData.website) || _.isEmpty(this.communityEditData.website)) {
        return 'success'
      }

      return this.isCommunityEditWebsiteValidUrl ? 'success' : 'danger'
    },
    isCommunityEditWebsiteValidUrl() {
      // Taken from: https://stackoverflow.com/a/5717133 @ 2017-08-04 09:43
      const urlPattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
      return urlPattern.test(this.communityEditData.website)
    },
  },
  methods: {
    editCommunity() {
      if (_.isEmpty(this.communityEditData.name) || _.isEmpty(this.communityEditData.tag)) {
        return
      }

      if (_.isEmpty(this.communityEditData.website)) {
        this.communityEditData.website = null
      }

      const updatedCommunityDetails = {}
      _.each(this.communityEditData, (value, key) => {
        if (!_.isEqual(value, this.communityDetails[key])) {
          updatedCommunityDetails[key] = value
        }
      })

      this.hideCommunityEditModal()

      if (_.isEmpty(updatedCommunityDetails)) {
        return this.$store.dispatch('showAlert', {
          showAlert: true,
          alertVariant: 'warning',
          alertMessage: `<i class="fa fa-warning" aria-hidden="true"></i> ${this.$t('community.noChanges')}`
        })
      }

      this.$store.dispatch('editCommunity', {
        communitySlug: this.$route.params.communitySlug,
        updatedCommunityDetails
      })
    },
    hideCommunityEditModal() {
      this.$refs.communityEditModal.hide()
    },
    setCommunityEditData() {
      this.communityEditData = {
        name: this.communityDetails.name,
        tag: this.communityDetails.tag,
        website: this.communityDetails.website
      }
    }
  }
}
</script>










