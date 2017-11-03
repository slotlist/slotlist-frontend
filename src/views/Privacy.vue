<template>
  <div>
    <privacy-de v-if="$i18n.locale === 'de' || $i18n.locale === 'de-at'"></privacy-de>
    <privacy-en v-else></privacy-en>
  </div>
</template>

<script>
import PrivacyDe from '../i18n/views/Privacy.de.vue'
import PrivacyEn from '../i18n/views/Privacy.en.vue'
import utils from '../utils'

export default {
  components: {
    PrivacyDe,
    PrivacyEn
  },
  created: function() {
    utils.setTitle(this.$t('nav.privacy'))
  }
}
</script>
