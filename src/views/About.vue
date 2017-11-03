<template>
  <div>
    <about-de v-if="$i18n.locale === 'de' || $i18n.locale === 'de-at'"></about-de>
    <about-en v-else></about-en>
  </div>
</template>

<script>
import AboutDe from '../i18n/views/About.de.vue'
import AboutEn from '../i18n/views/About.en.vue'
import utils from '../utils'

export default {
  components: {
    AboutDe,
    AboutEn
  },
  beforeCreate: function() {
    this.$store.dispatch('getBackendVersion')
  },
  created: function() {
    utils.setTitle(this.$t('nav.about'))
  }
}
</script>
