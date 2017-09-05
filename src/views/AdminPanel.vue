<template>
  <div>
    <p>
      HEY! It is the admin page! :D
    </p>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function() {
    utils.setTitle(this.$t('nav.admin.panel'))
  }
}
</script>
