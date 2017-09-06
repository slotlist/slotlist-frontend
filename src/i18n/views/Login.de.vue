<template>
  <b-jumbotron header="Anmeldung via Steam" lead="slotlist.info benutzt Steam OpenID Authentifizierung. Du kannst daher deinen bestehenden Steam Account benutzen, um dich auf unserer Seite einzuloggen." v-if="!working">
    <p class="text-justify">
      Die Website kann weder deine Steam-Anmeldedaten lesen noch speichern oder irgendeine Aktion mit deinem Steam-Account durchführen.
      <br> Wir erhalten einzig die SteamID und einige öffentlich ersichtlichen Daten (wie z.B. den Nickname) über deinen Account.
      <br> Die Informationen, welche Steam an uns übermittelt, werden dazu verwendet, einen eindeutigen Benutzer in unserem Backend zu erstellen. Dadurch können alle Funktionen von
      <router-link to="/">slotlist.info</router-link> verwendet werden.
      <br> Genauere Details bezüglich der Datenschutzerklärung dieser Website können
      <router-link to="/privacy">here</router-link> gefunden werden.
    </p>
    <p v-if="loginRedirectUrl" class="lead text-center">
      <a :href="loginRedirectUrl">
        <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" alt="Anmeldung via Steam" title="Ja, das Login-Banner sieht absolut grässlich aus, aber leider zwingt uns Valve, es zu verwenden >.< Wie auch immer, klick hier zur Anmeldung via Steam">
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
