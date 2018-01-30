<template>
  <b-jumbotron header="About slotlist.info">
    <p class="text-justify">
      <router-link :to="{name: 'home'}">slotlist.info</router-link> was created by
      <a href="https://github.com/MorpheusXAUT">MorpheusXAUT</a> due to being fed up of having to register in countless ArmA community forums just to participate in ArmA missions. The tools allows for easier creating and management of missions and provides easy and direct access to all users - all that's required is a Steam account, and you should already have that, otherwise you wouldn't be playing ArmA
      <i class="fa fa-smile-o"></i>
      <br>
      <br> This service is provided to you for free without any guarantees of uptime or availability - we might shut down
      <router-link :to="{name: 'home'}">slotlist.info</router-link> without any additional warnings at any time. Since it's our goal to provide an easy tool to a broad number of ArmA enthusiats, we aim for the highest availability and longevity possible and thus appreciate any feedback you have for us.
    </p>
    <h4>Development</h4>
    <p class="text-justify">
      <router-link :to="{name: 'home'}">slotlist.info</router-link> is currently solely developed by
      <a href="https://github.com/MorpheusXAUT">MorpheusXAUT</a>. The website's frontend and backend source code repositories as well as the current versions deployed can be found below. Please include this information is bug reports as it helps with narrowing down issues.
      <dl class="row">
        <dt class="col-1">frontend</dt>
        <dd class="col-2">
          <a href="https://github.com/MorpheusXAUT/slotlist-frontend">
            <i class="fa fa-github" aria-hidden="true"></i> slotlist-frontend</a>
        </dd>
        <dd class="col-9">
          <span v-show="frontendVersion">{{ frontendVersion }}</span>
        </dd>
        <dt class="col-1">backend</dt>
        <dd class="col-2">
          <a href="https://github.com/MorpheusXAUT/slotlist-backend">
            <i class="fa fa-github" aria-hidden="true"></i> slotlist-backend</a>
        </dd>
        <dd class="col-9">
          <span v-show="backendVersion">{{ backendVersion }}</span>
        </dd>
      </dl>
      You can also use these repositories and their respective issue trackers to report any bugs you encounter - or use one of the contact methods available, as mentioned below.
    </p>
    <h4>Contact us</h4>
    <p class="text-justify">
      Should you run into any issues or bugs or have a suggestion for our site, feel free to:
      <dl class="row">
        <dt class="col-sm-3">open an issue on GitHub</dt>
        <dd class="col-sm-9">
          <a href="https://github.com/MorpheusXAUT/slotlist-frontend/issues">issue tracker</a>
        </dd>
        <dt class="col-sm-3">email us directly</dt>
        <dd class="col-sm-9">
          <a href="mailto:hello@slotlist.info?subject=slotlist.info - Hello!">hello@slotlist.info</a>
        </dd>
        <dt class="col-sm-3">join our Discord server</dt>
        <dd class="col-sm-9">
          <a href="https://discord.gg/QZ5HpwT">Discord</a>
        </dd>
        <dt class="col-sm-3">add the developer on Steam</dt>
        <dd class="col-sm-9">
          <a href="https://steamcommunity.com/id/morpheusxaut">MorpheusXAUT</a>
        </dd>
      </dl>
      Contact details for legal inquiries can be found on the
      <router-link :to="{name: 'imprint'}">imprint</router-link>.
    </p>
    <h4>Special thanks &amp; credits</h4>
    <p>
      Last, but not least, there's a few people that I, MorpheusXAUT, would like to thank (in no particular order):
      <dl class="row">
        <dt class="col-sm-2">
          <a href="https://github.com/Regner">Regner</a>
        </dt>
        <dd class="col-sm-10">for helping me start this project, set everything up and not complaining about my question bombardment</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] LeWarz</a>
        </dt>
        <dd class="col-sm-10">for suggesting features and functionality, testing the service and providing general feedback</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] Belbo</a>
        </dt>
        <dd class="col-sm-10">for feature suggestions and feedback as well as proofreading my partly random translations</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] Sinus</a>
        </dt>
        <dd class="col-sm-10">for feedback regarding the structure and design of the site, general testing and filling my database with trash data</dd>
        <dt class="col-sm-2">
          <a href="http://spezialeinheit-luchs.de">[SeL] buur</a>
        </dt>
        <dd class="col-sm-10">for constant feedback and suggestions as well as testing all different kinds of functionality</dd>
        <dt class="col-sm-2">
          <a href="https://task-force-wolf.de">[TFW] Isaac</a>
        </dt>
        <dd class="col-sm-10">for feedback, suggestions and bug reports</dd>
        <dt class="col-sm-2">
          <a href="http://www.jaegerzug-achilles.de">[JgZg-A] Steff</a>
        </dt>
        <dd class="col-sm-10">for feature suggestions and providing an Austrian translation</dd>
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
