<template>
  <div>
    <b-jumbotron header="Anmeldung via Steam" lead="slotlist.info benutzt Steam OpenID Authentifizierung. Du kannst daher deinen bestehenden Steam Account benutzen, um dich auf unserer Seite einzuloggen." v-if="!working">
      <p class="text-justify">
        Die Website kann weder deine Steam-Anmeldedaten lesen, noch speichern oder irgendeine Aktion mit deinem Steam Account durchführen.
        <br>Wir erhalten einzig die SteamID und einige öffentlich ersichtlichen Daten (wie z.B. den Nicknamen) über deinen Account.
        <br>Die Informationen, welche Steam an uns übermittelt, werden dazu verwendet, einen eindeutigen Benutzer in unserem Backend zu erstellen. Dadurch können alle notwendigen Funktionen von
        <router-link to="/">slotlist.info</router-link> verwendet werden.
        <br>Genauere Details bezüglich der Datenschutzerklärung dieser Website können
        <router-link to="/privacy">hier</router-link> gefunden werden.
      </p>
      <p v-if="loginRedirectUrl" class="lead text-center">
        <a :href="loginRedirectUrl">
          <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" alt="Anmeldung via Steam" title="Ja, das Login-Banner sieht absolut grässlich aus, aber leider zwingt uns Valve, es zu verwenden >.< Wie auch immer, klick hier zur Anmeldung via Steam">
        </a>
      </p>
    </b-jumbotron>
    <div class="row text-center">
      <div class="col">
        <h4>Häufig gestellte Fragen bezüglich des Steam-Logins</h4>
        <p>Auszug aus den Häufig gestellten Fragen von unserer
          <router-link :to="{name: 'home'}">Startseite</router-link>
        </p>
      </div>
    </div>
    <br>
    <div class="row text-justify">
      <div class="col-6">
        <h5>Wie funktioniert der Login?</h5>
        <p>
          Wir nutzen einen Login-Service, genannt
          <em>Steam OpenID</em> oder
          <em>Steam Single Sign On</em>, der von Steam zur Verfügung gestellt wird. Mehr Informationen zu diesem Service können
          <a href="https://steamcommunity.com/dev">hier</a> gefunden werden.<br>Wenn du auf den
          <em>Sign in through Steam</em> Knopf drückst, wirst du auf eine Steam Community-Seite weitergeleitet, auf welcher du dich in deinen Steam-Account einloggen sollst. Wir weisen darauf hin, dass wir keinerlei Zugang zu dieser Seite haben und deine Steam-Logindaten nicht erhalten. Der gesamte Login-Vorgang wird sicher von Steam über die
          <code>steamcommunity.com</code> Domain abgewickelt.
          <strong>Du musst deine Steam-Logindaten niemals auf unserer Website oder irgendeiner anderen, nicht-Steam Seite eingeben.</strong><br>Sobald du dich erfolgreich eingeloggt hast, wirst du von Steam wieder auf unsere Website zurückgeleitet und wir erhalten Daten, welche benötigt werden, um dich als einen Nutzer unserer Dienstes zu identifizieren.<br>Die Informationen, die von Steam's Login-Service an uns weitergegeben werden, beschränken sich dabei auf deine SteamID sowie deinen Nickname, welche beide öffentlich für jeden auf Steam ersichtlich sind.
        </p>
        <h5>Ich bin noch immer skeptisch oder verwirrt...</h5>
        <p>
          Gerne kommen wir für ein Gespräch zu euch, um unseren Dienst genauer zu erklären und möglichst alle Verwirrungen so gut wir können aufzuklären - kontaktiere uns einfach über einen der Wege, die auf unserer
          <router-link :to="{name: 'about'}">Über-Seite</router-link> angegeben sind. Während wir euch gerne als Nutzer unseres Dienstes begrüßen würden, können wir natürlich Skeptizismus auch verstehen und freuen uns über jegliche Art von Feedback.
        </p>
      </div>
      <div class="col-6">
        <h5>Kann auf meinen Steam-Account zugegriffen werden, nachdem ich mich auf eurer Website eingeloggt habe?</h5>
        <p>
          <strong>Nein, absolut nicht.</strong> Wie schon zuvor erwähnt führen wir keinerlei Login selbst durch, sondern nutzen einen Dienst, der von Steam für alle Entwickler zur Verfügung gestellt wird. Jegliche Authentifizierung wird von Steam selbst abgewickelt - wir erhalten jeglich eine "Zusicherung", dass du der Nutzer bist, der du vorgibst, zu sein.
          <strong>Die Informationen, die wir erhalten, ermöglichen uns keinerlei Zugang zu deinem Steam-Account, deiner Steam-Bibliothek oder den Login-Details, die damit verbunden sind.</strong>
        </p>
        <h5>Welche Informationen werden über mich gespeichert?</h5>
        <p>
          Wenn du dich das erste Mal einloggst, legt unser Backend einen neuen Benutzer in der Datenbank an und speichert die SteamID, welche uns von Steam's Login-Dienst übermittelt wird, sowie deinen (öffentlichen) Nickname zu diesem Zeitpunkt. Du kannst den Nickname auf dieser Website jederzeit ändern, indem du auf deine
          <router-link :to="{name: 'account'}">Account-Seite</router-link> gehst während du eingeloggt bist. Bitte beachte, dass die Änderung deines Steam-Nicknames nicht den Nickname auf
          <router-link :to="{name: 'home'}">slotlist.info</router-link> aktualisiert, weil wir die Steam-Server nach der initialen Anmeldung nicht mehr nach deinem Nickname fragen. Neben der SteamID und dem Nickname beinhaltet die gespeicherte Benutzerinformation auch noch eine eindeutige ID, welche von unserem Backend zufällig erstellt wird und benötigt wird, um einen Benutzer eindeutig im Service identifizieren zu können.<br>Wenn du dich für einen Missionsslot anmeldest, wird ein Datenbankeintrag angelegt, welcher die Slot ID, deine Benutzer ID sowie den optionale Kommentar - sofern du eines angegeben hast - speichert.<br>Solltest du einen Auszug aller Daten, die wir aktuell über dich speichern, erhalten wollen, kontaktiere uns bitte auf einem der Wege, die auf unserer
          <router-link :to="{name: 'about'}">Über-Seite</router-link> erwähnt werden, und wir stellen dir gerne alle Informationen zur Verfügung, die wir haben.<br>Genauere Informationen zur Datenschutzrichtlinie dieser Website können
          <router-link :to="{name: 'privacy'}">hier</router-link> gefunden werden.
        </p>
      </div>
    </div>
  </div>
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
