<template>
  <b-jumbotron header="Sign in using Steam" lead="slotlist.info uses Steam OpenID authentication. This allows you to use your existing Steam account to log into our site." v-if="!working">
    <p class="text-justify">
      The site will not be able to read or store your Steam login credentials or perform any action regarding your Steam account.
      <br> We will only receive your SteamID as well as some other public information such as your username.
      <br> The information provided by Steam will be used to create a unique user in our backend for you, allowing you to use all features on
      <router-link to="/">slotlist.info</router-link>.
      <br> More information regarding the privacy policy of this site can be found
      <router-link to="/privacy">here</router-link>.
    </p>
    <p v-if="loginRedirectUrl" class="lead text-center">
      <a :href="loginRedirectUrl">
        <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" alt="Sign in through Steam" title="Yes, this login banner looks atrocious, unfortunately Valve forces us to use it >.< Anyways, click to sign in through Steam">
      </a>
    </p>
  </b-jumbotron>
</template>

<script>
export default {
  computed: {
    loginRedirectUrl() {
      return this.$store.getters.loginRedirectUrl
    },
    working() {
      return this.$store.getters.working
    }
  }
}
</script>
