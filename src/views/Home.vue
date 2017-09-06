<template>
  <div>
    <home-de v-if="$i18n.locale === 'de'"></home-de>
    <home-en v-else></home-en>
  </div>
</template>

<script>
import HomeDe from '../i18n/views/Home.de.vue'
import HomeEn from '../i18n/views/Home.en.vue'
import utils from '../utils'

export default {
  components: {
    HomeDe,
    HomeEn
  },
  created: function() {
    utils.clearTitle()
  }
}
</script>
