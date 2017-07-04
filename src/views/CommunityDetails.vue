<template>
  <div>
    <p>
      HEY! It is the community details page! :D
    </p>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function () {
    utils.setTitle('Testcommunity')
  }
}
</script>
