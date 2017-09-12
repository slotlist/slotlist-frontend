<template>
  <b-jumbotron header="slotlist.info" lead="ArmA 3 Missions- und Slotlist-Management">
    <p class="text-justify">
      <router-link :to="{name: 'home'}">slotlist.info</router-link> ermöglicht das Erstellen und Verwalten von
      <router-link :to="{name: 'missionList'}">Missionen</router-link> - inklusive Slotlisten, bei denen Benutzer sich für ihre gewünschten Slots anmelden können.
      <br>Das
      <router-link :to="{name: 'communityList'}">Community-Feature</router-link> erlaubt es Arma-Communities, ihre Gemeinschaft auf unserer Website zu präsentieren und dadurch für ihre selbsterstellten Missionen zu werben.
      <br>Da
      <router-link :to="{name: 'home'}">slotlist.info</router-link> Steam Single Sign-on benutzt, wird keine lästige Registrierung und kein weiterer Account auf noch einer weiteren Seite benötigt - alle Authentifizierung wird sicher von den Steam Servern erledigt. Zum Loslegen einfach
      <router-link :to="{name: 'login'}">anmelden</router-link> und
      <router-link :to="{name:'missionCreator'}">eine neue Mission erstellen</router-link>!
      <br>
      <br>Weil sich
      <router-link :to="{name: 'home'}">slotlist.info</router-link> noch immer in der Entwicklungsphase befindet, wird es immer wieder Änderungen an den Seiten und deren Features (oder Daten) geben. Wir werden unser Bestes geben, um Service-Ausfälle möglichst kurz zu halten und Datenverluste zu verhindern.
      <router-link :to="{name: 'about'}">Kontaktiere uns</router-link> aber bitte jederzeit, falls irgendwelche Probleme auftreten sollten oder es Anregungen gibt.
      <br>
      <br>Vielen Dank für die Nutzung unserer Services - ich hoffe, sie sind von gutem Nutzen!
      <br>
      <br>
      <span class="text-muted font-italic">&mdash; MorpheusXAUT, slotlist.info Entwickler</span>
    </p>
  </b-jumbotron>
</template>
