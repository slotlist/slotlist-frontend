<template>
  <div>
    <b-jumbotron header="API documentation" lead="slotlist.info provides a public JSON REST API to all of its users">
      <p class="text-justify">
        <span v-if="$i18n.locale === 'de'" class="font-weight-bold text-danger">Diese API-Information ist nur in Englisch verfügbar, da die eigentliche
          <a href="https://api.slotlist.info/documentation">API-Dokumentation</a> auch nur in englischer Sprache ausgeliefert wird. Für etwaige Fragen stehen wir trotzdem gerne zur Verfügung.<br><br></span>
        You can use this API to integrate
        <router-link :to="{name: 'home'}">slotlist.info</router-link>'s mission and slotlists into your own community page and provide a better overview of your missions right alongside your own community's web appearance.
        <br>
        <br>The API can be found at
        <code>https://api.slotlist.info</code>, the current API version being
        <code>v1</code>. All current endpoints are thus available at
        <code>https://api.slotlist.info/v1/ENDPOINT</code>, e.g. the current list of (publicly visible) missions can be retrieved from
        <code>
          <a href="https://api.slotlist.info/v1/missions">https://api.slotlist.info/v1/missions</a>
        </code>.
        <br>
        <br>
        <strong>The full (swagger) API documentation can be found at
          <a href="https://api.slotlist.info/documentation">https://api.slotlist.info/documentation</a>
        </strong>, the corresponding swagger file is available
        <a href="https://api.slotlist.info/swagger.json">here</a> and can be used to automatically
        <a href="https://github.com/swagger-api/swagger-codegen">generate client libraries</a>.
        <br>
        <br>All information is served via HTTPS and represented as JSON, no other formats are available. Endpoints that return a list of objects (e.g. missions, slots or communities) are paginated and can be walked using
        <code>?limit=NUMBER&offset=NUMBER</code> query parameters (explained in more details in the respective endpoint's swagger documentation).
        <br>
        <br> Breaking changes to the API will lead to an incremented API version number (e.g.
        <code>v2</code>), old endpoints will still be supported as long as possible, but we reserve the right to remove any endpoints should we deem it necessary.
        <br>Deprecated endpoints will be indicated as such in the swagger API documentation and their responses will also contain a
        <code>Warning</code> header in the format of
        <code>299 - "The endpoint
          <em>NAME</em> is deprecated and will be removed by
          <em>DATE</em>. Please see
          <em>LINK</em> for details."</code>
        Deprecated endpoints should
        <strong>not</strong> be used and applications migrationed to the newest version as soon as possible. All deprecation notices will also be posted to the Discord server's
        <code>#announcements-api</code> channel.
        <br>
        <br>Whilst some endpoints such as mission creation, slot registration or likewise required authentication (via Steam SSO), many endpoints - especially the overview ones like mission list and details - can be retrieved unauthenticated by everyone. At the moment, there is no easy way for an external application to authenticate with the
        <router-link :to="{name: 'home'}">slotlist.info</router-link> backend since the Steam SSO login redirects to our pages. In the future, we might provide an API key page for users to allow external apps to act on their behalf.
        <br>
        <br>As of now, there is no fixed limits for the number of API requests allowed per app, however we are monitoring the requests received and reserve the right to block third parties as we see fit. Ratelimits might be introduced in the feature without additional notice (beside this page) as well. Please also make sure you've read our
        <router-link :to="{name: 'privacy'}">privacy policy</router-link> - by using our API, you also explicity agree to it.
        <br>Please provide some sort of identifying information about your site or application in your requests, e.g. as a custom User-Agent like
        <code>User-Agent: spezialeinheit-luchs.de v1.0.0 / info@spezialeinheit-luchs.de</code>. This allows us to contact you in case your requests are causing issues or could be optimized in any way. We will not use this information to send you any unrelated or advertisement messages and will not pass it on to any third parties for any purposes.
        <br>
        <br>
        <router-link :to="{name: 'home'}">slotlist.info</router-link> provides no guarantee about the uptime and availability of its API and might cease services at any point. We are not responsible for any outages or errors caused to your applications due to our system.
        <br>
        <br>Should you run into any issues with the API, please open an issues on our
        <a href="https://github.com/MorpheusXAUT/slotlist-backend/issues">backend repository issue tracker</a> on GitHub or use any of the other contact methods mentioned on the
        <router-link :to="{name: 'about'}">About</router-link> page to contact us. We're grateful for any report or suggestion - questions are best asked in our support Discord.
      </p>
    </b-jumbotron>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function() {
    utils.setTitle(this.$t('nav.api'))
  }
}
</script>
