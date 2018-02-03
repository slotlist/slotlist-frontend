<template>
  <div>
    <div>
      <h3>{{ $t('community.creator.title') }}</h3>
    </div>
    <div>
      <b-form @submit.stop.prevent="createCommunity">
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('community.name')" :description="$t('community.name.description')" :state="communityCreateNameState" :feedback="communityCreateNameFeedback">
              <b-form-input v-model="communityCreate.name" type="text" required :formatter="communityCreateNameFormatter" lazy-formatter></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('community.slug')" :description="$t('community.slug.description')" :state="communityCreateSlugState" :feedback="communityCreateSlugFeedback">
              <b-input-group :right="communityCreateSlugAvailable">
                <b-form-input v-model="communityCreate.slug" type="text" required :formatter="communityCreateSlugFormatter" lazy-formatter></b-form-input>
              </b-input-group>
            </b-form-fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-fieldset :label="$t('community.tag')" :description="$t('community.tag.description')" :state="communityCreateTagState" :feedback="communityCreateTagFeedback">
              <b-form-input v-model="communityCreate.tag" type="text" required></b-form-input>
            </b-form-fieldset>
          </div>
          <div class="col">
            <b-form-fieldset :label="$t('community.website.optional')" :state="communityCreateWebsiteState" :feedback="communityCreateWebsiteFeedback">
              <b-form-input v-model="communityCreate.website" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
      </b-form>
    </div>
    <div class="text-center">
      <b-btn variant="success" @click="createCommunity">
        <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.create.community') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function() {
    utils.setTitle(this.$t('community.creator.title.browser'))
  },
  data() {
    return {
      communityCreate: {
        name: null,
        slug: null,
        tag: null,
        website: null
      }
    }
  },
  computed: {
    checkingCommunitySlugAvailability() {
      return this.$store.getters.checkingCommunitySlugAvailability
    },
    communityCreateNameFeedback() {
      return _.isNil(this.communityCreate.name) || _.isEmpty(this.communityCreate.name) ? this.$t('community.creator.feedback.name') : ''
    },
    communityCreateNameState() {
      return _.isNil(this.communityCreate.name) || _.isEmpty(this.communityCreate.name) ? 'danger' : 'success'
    },
    communityCreateSlugState() {
      if (_.isNil(this.communityCreate.slug) || _.isEmpty(this.communityCreate.slug)) {
        return 'danger'
      } else if (this.checkingCommunitySlugAvailability) {
        return 'warning'
      } else if (!this.communitySlugAvailable) {
        return 'danger'
      }

      return 'success'
    },
    communityCreateSlugFeedback() {
      if (_.isNil(this.communityCreate.slug) || _.isEmpty(this.communityCreate.slug)) {
        return this.$t('community.creator.feedback.slug')
      } else if (this.checkingCommunitySlugAvailability) {
        return this.$t('community.creator.feedback.slug.checking')
      } else if (!this.communitySlugAvailable) {
        return this.$t('community.creator.feedback.slug.notAvailable')
      }

      return ''
    },
    communityCreateSlugAvailable() {
      if (this.checkingCommunitySlugAvailability) {
        return '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>'
      } else if (this.communitySlugAvailable) {
        return '<i class="fa fa-check" aria-hidden="true"></i>'
      }

      return '<i class="fa fa-close" aria-hidden="true"></i>'
    },
    communityCreateTagFeedback(proerty) {
      return _.isNil(this.communityCreate.tag) || _.isEmpty(this.communityCreate.tag) ? this.$t('community.creator.feedback.tag') : ''
    },
    communityCreateTagState() {
      return _.isNil(this.communityCreate.tag) || _.isEmpty(this.communityCreate.tag) ? 'danger' : 'success'
    },
    communityCreateWebsiteFeedback() {
      if (_.isNil(this.communityCreate.website) || _.isEmpty(this.communityCreate.website)) {
        return ''
      }

      return this.isCommunityCreateWebsiteValidUrl ? '' : this.$t('community.creator.feedback.website')
    },
    communityCreateWebsiteState() {
      if (_.isNil(this.communityCreate.website) || _.isEmpty(this.communityCreate.website)) {
        return 'success'
      }

      return this.isCommunityCreateWebsiteValidUrl ? 'success' : 'danger'
    },
    communitySlugAvailable() {
      return this.$store.getters.communitySlugAvailable
    },
    isCommunityCreateWebsiteValidUrl() {
      // Taken from: https://stackoverflow.com/a/5717133 @ 2017-08-04 09:43
      const urlPattern = /^((https?|ftp):\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
      return urlPattern.test(this.communityCreate.website)
    }
  },
  methods: {
    communityCreateNameFormatter(val) {
      if (_.isNil(this.communityCreate.slug) || _.isEmpty(this.communityCreate.slug)) {
        this.communityCreate.slug = utils.slug(val)
        this.$store.dispatch('checkCommunitySlugAvailability', this.communityCreate.slug)
      }
      return val
    },
    communityCreateSlugFormatter(val) {
      if (!_.isNil(this.communityCreate.slug) && !_.isEmpty(this.communityCreate.slug)) {
        this.$store.dispatch('checkCommunitySlugAvailability', this.communityCreate.slug)
      }

      return val
    },
    createCommunity() {
      if (_.isEmpty(this.communityCreate.name) || _.isEmpty(this.communityCreate.slug) || _.isEmpty(this.communityCreate.tag)) {
        return
      }

      if (_.isEmpty(this.communityCreate.website)) {
        this.communityCreate.website = null
      }

      this.$store.dispatch('createCommunity', this.communityCreate)
    }
  }
}
</script>
