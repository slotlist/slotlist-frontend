<template>
  <div>
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
        <a href="https://github.com/MorpheusXAUT">MorpheusXAUT</a>. The website's frontend and backend source code can be found on GitHub:
        <dl class="row">
          <dt class="col-sm-3">Frontend repository</dt>
          <dd class="col-sm-9">
            <a href="https://github.com/MorpheusXAUT/slotlist-frontend">slotlist-frontend</a>
          </dd>
          <dt class="col-sm-3">Backend repository</dt>
          <dd class="col-sm-9">
            <a href="https://github.com/MorpheusXAUT/slotlist-backend">slotlist-backend</a>
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
            <a href="mailto:hello@slotlist.info">hello@slotlist.info</a>
          </dd>
          <dt class="col-sm-3">join our Discord server</dt>
          <dd class="col-sm-9">
            <a href="https://discord.gg/QZ5HpwT">Discord</a>
          </dd>
        </dl>
      </p>
    </b-jumbotron>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function () {
    utils.setTitle('About')
  }
}
</script>
