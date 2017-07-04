<template>
  <div>
    <p>
      HEY! It is the about page! :D
    </p>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function () {
    utils.setTitle('About')
  }
}
</script>
