<template>
  <div>
    <div class="row text-center">
      <div class="col">
        <h4>Häufig gestellte Fragen</h4>
      </div>
    </div>
    <br>
    <div class="row text-justify">
      <div class="col-6">
        <h5>Was ist
          <router-link :to="{name: 'home'}">slotlist.info</router-link>?
        </h5>
        <p>
          <router-link :to="{name: 'home'}">slotlist.info</router-link> ist ein ArmA 3 Slotlist- und Missionsverwaltungs-Tool. Missionsersteller sowie Spieler können es benutzen, um einfach Missionen zu organisieren und Slots auszuwählen.
        </p>
        <h5>Wer hat
          <router-link :to="{name: 'home'}">slotlist.info</router-link> entwickelt und betreibt es?
        </h5>
        <p>
          <router-link :to="{name: 'home'}">slotlist.info</router-link> wurde von
          <a href="https://steamcommunity.com/id/morpheusxaut">[SeL] MorpheusXAUT</a>, hauptsächlich als Slotting-Tool für die
          <a href="http://spezialeinheit-luchs.de">Spezialeinheit Luchs</a>, entwickelt. Wir haben uns dazu entschieden, den Dienst für alle verfügbar zu machen und hoffen, dass er eine nützliche Alternative zu Anmeldungen über verschiedene Foren bietet.
        </p>
        <h5>Muss ich mich anmelden, um Missionen oder Slotlisten zu sehen?</h5>
        <p>
          Nein. Du kannst alle öffentlich sichtbaren
          <router-link :to="{name: 'missionList'}">Missionen</router-link> einsehen und deren Details und Slotliste ansehen, ohne dich anmelden zu müssen. Beachte dabei aber bitte, dass Missionsersteller die Möglichkeit haben, Missionen nur für Community-Mitglieder oder ausgewählte Benutzer sichtbar zu machen - du siehst daher eventuell nicht alle Missionen, die du sehen würdest, wenn du eingeloggt wärst.
        </p>
        <h5>Muss ich mich auf
          <router-link :to="{name: 'home'}">slotlist.info</router-link> für einen Slot anmelden, um an einer Mission teilnehmen zu können?
        </h5>
        <p>
          Das kommt einzig auf den Missionsersteller an -
          <router-link :to="{name: 'home'}">slotlist.info</router-link> stellt diesen nur einen Dienst zur Verfügung, um ihre Missionen und Slotlist zu verwalten, wie sie sich dazu entscheiden, diesen einzusetzen, ist jedem Ersteller vorbehalten. Manche Missionsersteller könnten verlangen, dass jeder Mitspieler für einen Slot angemeldet und bestätigt ist, bevor die Mission anfängt, während andere eine externe Anmeldung via z.B. Community-Forum auch zulassen könnten und diese Website nur nutzen, um ihre Mission zu bewerben. Zuletzt können manche Ersteller auch zulassen, dass du zum Missionsbeginn erscheinst und einen der übrigen, noch freien Slots belegst. Am besten versuchst du, den Missionsersteller vor dem Beginn zu kontaktieren und zu fragen, falls du dir nicht sicher bist.
        </p>
        <h5>Muss sicher jeder auf dieser Website anmelden, damit ich sie für meine Mission verwenden kann?</h5>
        <p>
          Idealerweise loggt sich jeder Spieler auf
          <router-link :to="{name: 'home'}">slotlist.info</router-link> ein und meldet sich für seinen gewünschten Slot über die Slotliste deiner Mission an. Da wir uns aber bewusst sind, dass manche Leute nicht gerne eine externe Seite benutzen, um sich einen Slot für eine Mission auszusuchen, haben wir Missionserstellern auch die Möglichkeit gegeben, einen Slot zu "blockieren", wodurch andere
          <router-link :to="{name: 'home'}">slotlist.info</router-link>-Benutzer sich nicht mehr auf diesen anmelden können - händische Slotzuweisungen von "externen" Spielern können dann als Slotbeschreibung hinzugefügt werden.<br>Während diese Art der Anmeldung nicht die selbe Funktionalität wie eine "normale" Anmeldung bietet, hoffen wir, dass dies eine akzeptable Alternative für unsere skeptischeren Spieler bietet.
        </p>
        <h5>Wie kann ich Slots für Community
          <em>XYZ</em> reservieren?</h5>
        <p>
          Sollte sich die Leitung der Community
          <em>XYZ</em> dazu entschieden haben, ihre Community auf unserer Website zu repräsentieren und darum eine
          <router-link :to="{name: 'communityList'}">Community</router-link> angelegt haben, kannst du einfach einen Haken bei der "Reservierter Slot" Checkbox setzen, während du einen Slot erstellst oder bearbeitest, und nach dem Community-Namen suchen. Sobald der Slot reserviert ist, können sich nur noch Benutzer dafür anmelden, die als Mitglieder dieser Community auf
          <router-link :to="{name: 'home'}">slotlist.info</router-link> gelistet sind.<br>Sollte sich Community
          <em>XYZ</em> dagegen entscheiden, auf unserer Website aufzutreten, solltest du den Slot blockieren, indem du einen Haken bei der "Blockierter Slot" Checkbox setzt und eine Nachricht ähnlich "Reserviert für Community
          <em>XYZ</em>" als Slotbeschreibung hinzufügst.<br>Genau wie bei der Spielerzuweisung via blockierten Slots stellt dies nicht die volle Funktionalität der Slotliste von
          <router-link :to="{name: 'home'}">slotlist.info</router-link> zur Verfügung, dient aber als Alternative, falls du Spieler und Communities nicht ausschließen wollen, wenn diese sich gegen die Verwendung unseres Dienstes entscheiden.
        </p>
        <h5>Ich bin noch immer skeptisch oder verwirrt...</h5>
        <p>
          Gerne kommen wir für ein Gespräch zu euch, um unseren Dienst genauer zu erklären und möglichst alle Verwirrungen so gut wir können aufzuklären - kontaktiere uns einfach über einen der Wege, die auf unserer
          <router-link :to="{name: 'about'}">Über-Seite</router-link> angegeben sind. Während wir euch gerne als Nutzer unseres Dienstes begrüßen würden, können wir natürlich Skeptizismus auch verstehen und freuen uns über jegliche Art von Feedback.
        </p>
      </div>
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
        <h5>Ich möchte, dass ihr alle Daten über mich löscht!</h5>
        <p>Das ist zwar keine Frage, aber klar!<br>Gehe dazu einfach auf deine
          <router-link :to="{name: 'account'}">Account-Seite</router-link> während du eingeloggt bist und drücken den "Account löschen" Knopf. Nach Bestätigung der Löschung werden alle Informationen, die mit deinem Benutzer verbunden sind, aus unserem Backend gelöscht und du wirst ausgeloggt.<br>Wir weisen darauf hin, dass dies auch
          <strong>jede</strong> von dir erstelle Mission, jede von dir abgeschickte Slotanmeldung sowie jede Berechtigung, die an dich vergeben wurden, löschen wird. Dies entfernt dich auch als Community-Gründer und nimmt dir dadurch die Möglichkeit, deine Community zu löschen - falls du eine erstellt hast. Lösche daher bitte deine Community vor deinem Account, falls du deren Daten auch entfernt haben möchtest.
          <strong>Diese Änderungen sind irreversibel - wir haben keine Möglichkeit, diese Daten wiederherzustellen, sobald sie gelöscht wurden.</strong>
        </p>
        <h5>Seid ihr böse?</h5>
        <p>
          Nur an jedem zweiten Dienstag.
        </p>
      </div>
    </div>
  </div>
</template>
