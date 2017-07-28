<template>
  <div>
    <p>
      HEY! It is the user details page! :D
    </p>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function () {
    utils.setTitle('Privacy')
  }
}
</script>
