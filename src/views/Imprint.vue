<template>
  <div>
    <imprint-de v-if="$i18n.locale === 'de' || $i18n.locale === 'de-at'"></imprint-de>
    <imprint-en v-else></imprint-en>
  </div>
</template>

<script>
import ImprintDe from '../i18n/views/Imprint.de.vue'
import ImprintEn from '../i18n/views/Imprint.en.vue'
import utils from '../utils'

export default {
  components: {
    ImprintDe,
    ImprintEn
  },
  created: function() {
    utils.setTitle(this.$t('nav.imprint'))
  }
}
</script>
