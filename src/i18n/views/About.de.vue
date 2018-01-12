<template>
  <b-jumbotron header="Über slotlist.info">
    <p class="text-justify">
      <router-link :to="{name: 'home'}">slotlist.info</router-link> wurde von
      <a href="https://github.com/MorpheusXAUT">MorpheusXAUT</a> entwickelt, da das andauernde Neu-Registrieren bei zahllosen ArmA-Communities, nur um bei deren Missionen mitzuspielen, nervig wurde. Das Tool erlaubt eine einfachere Erstellung und Verwaltung von Missionen und bietet schnellen und direkten Zugang für alle Benutzer - alles was dafür benötigt wird, ist ein Steam Account - und diesen sollte jeder hoffentlich haben, ansonsten wird das ArmA-Spielen schwer
      <i class="fa fa-smile-o"></i>
      <br>
      <br>Dieser Service wird gratis und ohne jegliche Garantie über Verfügbarkeit oder Erreichbarkeit angeboten - wir können
      <router-link :to="{name: 'home'}">slotlist.info</router-link> jederzeit und ohne weitere Vorwarnungen beendigen. Da es unser Ziel ist, ein einfaches Mittel für eine breite Anzahl an ArmA-Enthusiasten zur Verfügung zu stellen, bemühen wir uns, die höchste Verfügbarkeit und Langlebigkeit zu erreichen und freuen uns dabei über jedes Feedback.
    </p>
    <h4>Entwicklung</h4>
    <p class="text-justify">
      <router-link :to="{name: 'home'}">slotlist.info</router-link> wird aktuell ausschließlich von
      <a href="https://github.com/MorpheusXAUT">MorpheusXAUT</a> entwickelt. Die Repostories des Frontend- und Backend-Sourcecodes sowie die aktuell eingesetzten Versionen können unterhalb gefunden werden. Bitte gib diese Informationen in jeglichen Fehlermeldungen an, da es die Fehlersuche erleichtert.
      <dl class="row">
        <dt class="col-1">Frontend</dt>
        <dd class="col-2">
          <a href="https://github.com/MorpheusXAUT/slotlist-frontend">
            <i class="fa fa-github" aria-hidden="true"></i> slotlist-frontend</a>
        </dd>
        <dd class="col-9">
          <span v-show="frontendVersion">{{ frontendVersion }}</span>
        </dd>
        <dt class="col-1">Backend</dt>
        <dd class="col-2">
          <a href="https://github.com/MorpheusXAUT/slotlist-backend">
            <i class="fa fa-github" aria-hidden="true"></i> slotlist-backend</a>
        </dd>
        <dd class="col-9">
          <span v-show="backendVersion">{{ backendVersion }}</span>
        </dd>
      </dl>
      Die Repositories sowie deren Fehler-Tracker können außerdem dazu verwenden werden, um etwaige Bugs zu melden - alternativ kann dies über eine der unten genannten Kontaktmöglichkeiten geschehen.
    </p>
    <h4>Kontaktiere uns</h4>
    <p class="text-justify">
      Sollten irgendwelche Probleme oder Fehler auftreten oder solltest du Vorschläge for unsere Seite haben, dann:
      <dl class="row">
        <dt class="col-sm-3">öffne einen Fehlerbericht auf GitHub</dt>
        <dd class="col-sm-9">
          <a href="https://github.com/MorpheusXAUT/slotlist-frontend/issues">Fehler-Tracker</a>
        </dd>
        <dt class="col-sm-3">schick uns eine Email</dt>
        <dd class="col-sm-9">
          <a href="mailto:hello@slotlist.info?subject=slotlist.info - Hallo!">hello@slotlist.info</a>
        </dd>
        <dt class="col-sm-3">tritt unserem Discord Server bei</dt>
        <dd class="col-sm-9">
          <a href="https://discord.gg/QZ5HpwT">Discord</a>
        </dd>
        <dt class="col-sm-3">füge den Entwickler als Steam-Freund hinzu</dt>
        <dd class="col-sm-9">
          <a href="https://steamcommunity.com/id/morpheusxaut">MorpheusXAUT</a>
        </dd>
      </dl>
      Kontakt-Details für rechtliche Anfrangen können im
      <router-link :to="{name: 'imprint'}">Impressum</router-link> gefunden werden.
    </p>
    <h4>Spezielle Danksagungen</h4>
    <p>
      Zuletzt gibt es noch einige Leute, bei denen ich, MorpheusXAUT, mich bedanken möchte (in keiner bestimmten Reihenfolge):
      <dl class="row">
        <dt class="col-sm-2">
          <a href="https://github.com/Regner">Regner</a>
        </dt>
        <dd class="col-sm-10">dafür, dass er mir beim Start des Projektes und dem Einrichten von Allem geholfen und meine Fragenbombardierungen ertragen hat</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] LeWarz</a>
        </dt>
        <dd class="col-sm-10">für das Vorschlagen von Features und Funktionalitäten, dem Testen der Services und dem allgemeinen Feedback</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] Belbo</a>
        </dt>
        <dd class="col-sm-10">für Feature-Vorschläge und -Feedback sowie dem Korrekturlesen meiner teils wirren Übersetzungen</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] Sinus</a>
        </dt>
        <dd class="col-sm-10">für Feedback zum Aufbau und Design der Seite, allgemeinem Testing und dem Füllen meiner Datenbank mit Datenmüll</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] buur</a>
        </dt>
        <dd class="col-sm-10">für konstantes Feedback und Verbesserungsvorschläge und das Testen aller möglichen Funktionalitäten</dd>
        <dt class="col-sm-2">
          <a href="https://task-force-wolf.de">[TFW] Isaac</a>
        </dt>
        <dd class="col-sm-10">für Feedback, Verbesserungsvorschläge und Fehlerberichte</dd>
        <dt class="col-sm-2">
          <a href="http://www.jaegerzug-achilles.de">[JgZg-A] Steff</a>
        </dt>
        <dd class="col-sm-10">für Feature-Vorschläge und die Übersetzung ins Österreichische</dd>
      </dl>
    </p>
  </b-jumbotron>
</template>

<script>
import * as _ from 'lodash'

export default {
  computed: {
    backendVersion() {
      if (_.isNil(this.$store.getters.backendVersion)) {
        return null
      }

      return _.startsWith(this.$store.getters.backendVersion, 'v') ? this.$store.getters.backendVersion : `v${this.$store.getters.backendVersion}`
    },
    frontendVersion() {
      return _.startsWith(process.env.FRONTEND_VERSION, 'v') ? process.env.FRONTEND_VERSION : `v${process.env.FRONTEND_VERSION}`
    }
  }
}
</script>
