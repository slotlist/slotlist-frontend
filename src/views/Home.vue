<template>
  <div>
    <home-de v-if="$i18n.locale === 'de' || $i18n.locale === 'de-at'"></home-de>
    <home-en v-else></home-en>
    <calendar></calendar>
    <br>
    <faq-de v-if="$i18n.locale === 'de' || $i18n.locale === 'de-at'"></faq-de>
    <faq-en v-else></faq-en>
  </div>
</template>

<script>
import Calendar from '../components/Calendar.vue'
import FaqDe from '../i18n/views/FAQ.de.vue'
import FaqEn from '../i18n/views/FAQ.en.vue'
import HomeDe from '../i18n/views/Home.de.vue'
import HomeEn from '../i18n/views/Home.en.vue'
import utils from '../utils'

export default {
  components: {
    Calendar,
    FaqDe,
    FaqEn,
    HomeDe,
    HomeEn
  },
  created: function() {
    utils.clearTitle()
  }
}
</script>
