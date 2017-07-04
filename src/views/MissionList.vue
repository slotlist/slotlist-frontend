<template>
  <div>
    <p>
      HEY! It is the mission list page! :D
    </p>
    <router-link to="/missions/12345">Mission #12345</router-link>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function () {
    utils.setTitle('Missions')
  }
}
</script>
