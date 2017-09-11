<template>
  <b-jumbotron header="slotlist.info" lead="ArmA 3 mission planning and slotlist management tool">
    <p class="text-justify">
      <router-link :to="{name: 'home'}">slotlist.info</router-link> allows you to create and manage
      <router-link :to="{name: 'missionList'}">missions</router-link>, including slotlists for users to register for their desired roles.
      <br>The
      <router-link :to="{name: 'communityList'}">communities</router-link> feature also allows you to represent your ArmA community on our website, further advertising your community's members and the missions created by them.
      <br>Since
      <router-link :to="{name: 'home'}">slotlist.info</router-link> uses Steam Single Sign-on, there's no need for your to create yet another account on a different website - all authentication is securely handled by Steam servers. You can get started right away by
      <router-link :to="{name: 'login'}">logging in</router-link> and
      <router-link :to="{name:'missionCreator'}">creating a new mission</router-link>!
      <br>
      <br>Since
      <router-link :to="{name: 'home'}">slotlist.info</router-link> is still in development, there will be ongoing changes to the sites and the features (or data) provided by it. We will do our best to keep downtimes low and prevent any data loss, but please
      <router-link :to="{name: 'about'}">contact us</router-link> regarding any suggestions or issues - should they arise.
      <br>
      <br>Thank you for using our service - I hope you enjoy it!
      <br>
      <br>
      <span class="text-muted font-italic">&mdash; MorpheusXAUT, slotlist.info developer</span>
    </p>
  </b-jumbotron>
</template>
