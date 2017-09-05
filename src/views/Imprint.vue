<template>
  <div>
    <b-jumbotron header="Imprint">
      <br>
      <h4>Legal disclosure</h4>
      <p class="text-justify">
        <address>
          <strong>Nick 'MorpheusXAUT' Müller</strong>
          <br>Bergmillergasse 8/2/13
          <br>1140, Vienna
          <br>Austria
          <br>
          <br>
          <abbr title="Telephone">Tel.:</abbr> +43 676 9044010
          <br>Email:
          <a href="mailto:nick@slotlist.info">nick@slotlist.info</a>
        </address>
      </p>
      <br>
      <h4>Disclaimer</h4>
      <h5>Accountability for content</h5>
      <p class="text-justify">
        The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this context, please note that we are accordingly not obliged to monitor merely the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity. This also includes content created by third-parties on our website (e.g. missions or communities, website links, descriptions and uploaded images).
      </p>
      <h5>Accountability for links</h5>
      <p class="text-justify">
        Responsibility for the content of external links (to web pages of third parties) lies solely with the operators of the linked pages. No violations were evident to us at the time of linking. Should any legal infringement become known to us, we will remove the respective link immediately.
      </p>
      <h5>Content rights</h5>
      <p class="text-justify">
        All rights reserved. Any duplication or distribution of the whole content or parts of it in any media is subject to consent of the publisher.
      </p>
    </b-jumbotron>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function() {
    utils.setTitle(this.$t('nav.imprint'))
  }
}
</script>
