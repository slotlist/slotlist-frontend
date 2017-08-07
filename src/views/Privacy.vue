<template>
  <div>
    <b-jumbotron header="Privacy policy" lead="Last updated: <strong>2017-07-07 16:04</strong>.">
      <p class="text-justify">
        The
        <router-link :to="{name: 'home'}">slotlist.info</router-link> team ("us", "we" or "our") operates the
        <router-link :to="{name: 'home'}">slotlist.info</router-link> website (the "Service").
        <br>
        <br>This page informs you of our policies regarding the collection, use and discolsure of personal information when you use our Service.
        <br>
        <br>Your privacy and information safety is important to us - we will
        <strong>not</strong> use or share your information with anyone except as described in this privacy policy.
        <br>
        <br>We use your personal information to provide this Service and improve its quality continously. By using our Service, you agree to the collection and processing of your information in accordance to this policy. Should you disagree with any points of our privacy policy, stop using our Service immediately as continued usage automatically counts as consent.
        <br>
        <h4>Information collection and use</h4>
        While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you.
        <br>This data includes - but is not restricted to your Steam ID and nickname (as retrieved via the public information avaiable from your Steam profile and the Steam Single Sign on) as well as any other information entered by you.
        <br>Our service never receives additional details about your Steam account beside your
        <code>Steam 64 ID</code> and the nickname associated with it at the time you first log into our Service (thus creating a new account). Your nickname can be changed at any time via the
        <router-link :to="{name: 'account'}">Account</router-link> page.
        <strong>We never receive your Steam username, password or the email address associated with your account</strong>.
        <br>
        <br>
        <h4>Log Data</h4>
        We collect information transmitted by your browser whenever you visit our Service ("Log Data"). This Log Data may include identifiable information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visits, the time spent on those Service pages as well as other statistics.
        <br>
        <br>
        <h4>Cookies</h4>
        Cookies are files with small amount of data, stored by your browser on your computer's hard drive. Cookies may contain an anonymous unique identifier and are sent to your browser from our Service or a third party used to provide our Service.
        <br>We (or our Service Providers) may use Cookies to collect information about your website usage. You can instruct your browser to reject all Cookies, however some parts of our Service might not work to their fullest extend when doing so.
        <br>Our Service currently does not use any additional tracking or storage Cookies, however our Service Provider
        <a href="https://cloudflare.com">Cloudflare</a> may add a cookie to better serve your requests.
        <br>
        <br>
        <h4>Service Providers</h4>
        We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is being used.
        <br>These third parties only have access to your personal information as required to perform their designated task and are obligated not to disclose or use it for any other purposes.
        <br>As of now, our Service uses
        <a href="https://cloudflare.com">Cloudflare</a> as a DNS-, CDN- and DDoS protection service as well as
        <a href="https://cloud.google.com">Google Cloud Platform</a> as a hosting provider. The respective privacy policies can be found on the companies' websites.
        <br>
        <br>
        <h4>Links to other sites</h4>
        Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be redirected to that respective third-party site. We do not have any control over, and assume no responsibility for the content, privacy policies and practices of any third-party sites or services and strongly advise you to review the privacy policy of any third-party site you visit.
        <br>Should you notice any illegal or otherwise offensive material on any third-party sites linked to by our Service, please contact us via any way mentioned at our
        <router-link :to="{name: 'about'}">About</router-link> page and inform us about the link.
        <br>
        <br>
        <h4>Children's privacy</h4>
        Our Service does not adress anyone under the age of 13 ("Child", Children").
        <br>We do not knowingly collect personally identifiable information from Children under 13. If you are a parent or guardian and you are aware that your Child has provided us with personal information, please contact us via any way mentioned at our
        <router-link :to="{name: 'about'}">About</router-link> page.
        <br>Should we discover any personal information provided by Children under the age of 13 years, we will delete such information from our servies immediately.
        <br>
        <br>
        <h4>Changes to this privacy policy</h4>
        We may update this privacy policy from time to time. We will notify you of any changes by posting the new, updated privacy policy on this page as well as a notice in the
        <code>#announcements</code> channel in our
        <a href="https://discord.gg/QZ5HpwT">support Discord server</a>.
        <br>We advise you to review this privacy policy periodically for any changes as they are effective when posted on this page.
        <br>
        <br>
        <h4>Contact us</h4>
        If you have any questions regarding this privacy policy, please contact us via any way mentioned on our
        <router-link :to="{name: 'about'}">About</router-link> page.
      </p>
    </b-jumbotron>
  </div>
</template>

<script>
import utils from '../utils'

export default {
  created: function () {
    utils.setTitle('Privacy')
  }
}
</script>
