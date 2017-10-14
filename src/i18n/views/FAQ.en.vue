<template>
  <div>
    <div class="row text-center">
      <div class="col">
        <h4>Frequently Asked Questions</h4>
      </div>
    </div>
    <br>
    <div class="row text-justify">
      <div class="col-6">
        <h5>What is
          <router-link :to="{name: 'home'}">slotlist.info</router-link>?
        </h5>
        <p>
          <router-link :to="{name: 'home'}">slotlist.info</router-link> is an ArmA 3 slotlist and mission management tool. Mission creators as well as players can use it to easily organise missions and choose their slots.
        </p>
        <h5>Who made and runs
          <router-link :to="{name: 'home'}">slotlist.info</router-link>?
        </h5>
        <p>
          <router-link :to="{name: 'home'}">slotlist.info</router-link> was developed by
          <a href="https://steamcommunity.com/id/morpheusxaut">[SeL] MorpheusXAUT</a>, primarily as a slotting tool for
          <a href="http://spezialeinheit-luchs.de">Spezialeinheit Luchs</a>. We have decided to open the tool to everyone, hoping to provide a useful alternative to slotting managed via forums.
        </p>
        <h5>Do I have to sign in to see missions or slotlists?</h5>
        <p>
          No. You can browse all publicly visible
          <router-link :to="{name: 'missionList'}">missions</router-link> and check their details and slotlist without having to sign in. Please be aware that mission creators can limit access to only allow community members or selected users to view and participate in their missions - you thus might not see all missions available to you unless you log in.
        </p>
        <h5>Do I have to register for a slot on
          <router-link :to="{name: 'home'}">slotlist.info</router-link> in order to participate in a mission?
        </h5>
        <p>
          That solely depends on the mission creator -
          <router-link :to="{name: 'home'}">slotlist.info</router-link> only provides them with a tool to manage their mission and slotlist, how they decide to employ it is up to each creator themselves. Some mission creators might require everyone to register and have a slot assigned before the mission starts while others might also allow you to e.g. register for a slot on their community forums and only use this website as a way to advertise their mission. Lastly, some creators might let you simply join the mission when it starts and fill any slots that are still open. Your best bet would be to try and contact the mission creator beforehand and ask if you're unsure on how to participate.
        </p>
        <h5>Does everyone have to register on this site in order for me to use it for my missions?</h5>
        <p>
          Ideally, every one of your players would log in to
          <router-link :to="{name: 'home'}">slotlist.info</router-link> and register for their desired slot via your mission's slotlist. Since we are aware of people not wanting to use an external site to choose a slot for a mission, we have also provided mission creators with the possibility to "block" slots, preventing other
          <router-link :to="{name: 'home'}">slotlist.info</router-link> users from registering - manual slot assignments of "external" players can then be added as a slot description.<br>Whilst this does not provide the same functionality as a "regular" slot registration, we hope that it will provide a suitable alternative for more sceptical players.
        </p>
        <h5>How can I reserve slots for community
          <em>XYZ</em>?</h5>
        <p>
          Should the leadership of community
          <em>XYZ</em> have decided to represent their community on our website already and thus have created a
          <router-link :to="{name: 'communityList'}">community</router-link>, you can simply tick the "Restricted slot" checkbox when creating or editing a slot and search for the community name. Once restricted, only players registered as members of this community on
          <router-link :to="{name: 'home'}">slotlist.info</router-link> can sumbit a slot registration.<br>Should community
          <em>XYZ</em> decide they do not want to be represented on our website, you should block the slot by ticking the "Blocked slot" checkbox and add something along the lines of "Restricted to community
          <em>XYZ</em>" as the slot's description.<br>Same as with the manual player assignment via blocked slots, this will not provide you with the full functionality of
          <router-link :to="{name: 'home'}">slotlist.info</router-link>'s slotlist, but serves as an alternative should you not want to exclude users and communities that decide against using our service.
        </p>
        <h5>I am still sceptical or confused...</h5>
        <p>
          We would be happy to talk to you, explaining our service in more detail and trying to clear up any confusion as best as we can - just contact us via any method mentioned on our
          <router-link :to="{name: 'about'}">About</router-link> page. Whilst we obviously would like to have you as a user of our service, we can also understand scepticism and value any sort of feedback highly.
        </p>
      </div>
      <div class="col-6">
        <h5>How does the login work?</h5>
        <p>
          We are utilising a login service provided by Steam, called
          <em>Steam OpenID</em> or
          <em>Steam Single Sign On</em>. You can find more information about this service
          <a href="https://steamcommunity.com/dev">here</a>.<br>When you click the
          <em>Sign in through Steam</em> button, you will be redirected to a Steam community page where you will be asked to log in to your Steam account. Please note that we have no access at all to this page and do not receive your Steam credentials. The whole login process is handled securely by Steam on the
          <code>steamcommunity.com</code> domain.
          <strong>You will never have to enter your Steam credentials on our website or any other non-Steam service.</strong><br>Once you have successfully completed your login, Steam will redirect you back to our website and provide us with information required to identify you as a user of our service.<br>The data provided by Steam's login service is limited to your SteamID as well as your nickname, both of which are also publicly visible to everyone on Steam.
        </p>
        <h5>Can you access my Steam account after I log in to your website?</h5>
        <p>
          No. As previously mentioned, we do not handle any login at all, but use a service provided by Steam to all developers. All authentication is handled by Steam itself - we only receive an "assurance" you actually are who you claim to be.
          <strong>The information we receive does not grant us any access to your Steam account, Steam library or any credentials associated.</strong>
        </p>
        <h5>What information do you store about me?</h5>
        <p>
          When you log in for the first time, our backend creates a new user in our database, storing the SteamID provided by Steam's login service as well as your (public) Steam nickname at that point. You can change your nickname on this website at any point by going to your
          <router-link :to="{name: 'account'}">Account</router-link> page while logged in. Please note that changing your Steam nickname will not update your nickname on
          <router-link :to="{name: 'home'}">slotlist.info</router-link> since we do not query Steam for your nickname after the initial login anymore. Beside your SteamID and nickname, the stored user information contains a unique user ID that is randomly generated by our backend and used to uniquely identify your user throughout the app.<br>When you register for a mission slot, a database entry containing the slot ID, your user ID and the optional comment - if provided - is created.<br>If you would like to receive a dump of all information currently stored about you, please contact us via any method mentioned on the
          <router-link :to="{name: 'about'}">About</router-link> page and we will be happy to provide you with any data we have.<br>More information regarding the privacy policy of this website can be found
          <router-link :to="{name: 'privacy'}">here</router-link>.
        </p>
        <h5>I want you to delete all data stored about me!</h5>
        <p>This is not a question, but sure!<br>Just head to the
          <router-link :to="{name: 'account'}">Account</router-link> page while logged in and press the "Delete account" button. After confirming the deletion, all information associated with your user will be deleted from our backend and you will be logged out.<br>Please be aware that this will also delete
          <strong>every</strong> mission created by you, every slot registration you submitted as well as all permissions granted to you. This also removes you as a community founder, thus removing your ability to delete your community - should you have created one. Please make sure to delete your community beforehand if you want to have its data removed as well.
          <strong>These changes are irreversible - we have no way of restoring the data once it has been deleted.</strong>
        </p>
        <h5>Are you evil?</h5>
        <p>
          Only on every second Tuesday.
        </p>
      </div>
    </div>
  </div>
</template>
