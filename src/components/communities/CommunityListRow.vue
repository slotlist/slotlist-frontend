<template>
  <tr>
    <td>[{{ community.tag }}]</td>
    <td>{{ community.name }}</td>
    <td v-html="optionalWebsite"></td>
    <td class="text-center">
      <router-link tag="button" class="btn btn-primary btn-sm" :to="{name: 'communityDetails', params: {communitySlug: community.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> Details
      </router-link>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'community'
  ],
  computed: {
    optionalWebsite() {
      return _.isString(this.community.website) && !_.isEmpty(this.community.website) ?
        `<a href="${this.community.website}">${this.community.website}</a>` :
        `<span class="text-muted font-italic">not provided</span>`
    }
  }
}
</script>
