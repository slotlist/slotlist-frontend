<template>
  <div>
    <p>
      HEY! It is the account page! :D
    </p>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function () {
    utils.setTitle('Account')
  }
}
</script>
