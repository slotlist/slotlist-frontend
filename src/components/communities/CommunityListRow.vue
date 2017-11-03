<template>
  <tr>
    <td>[{{ community.tag }}]</td>
    <td>{{ community.name }}</td>
    <td v-html="optionalCommunityWebsite"></td>
    <td class="text-center">
      <router-link tag="button" class="btn btn-primary btn-sm" :to="{name: 'communityDetails', params: {communitySlug: community.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
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
    optionalCommunityWebsite() {
      return _.isString(this.community.website) && !_.isEmpty(this.community.website) ?
        `<a href="${this.community.website}">${this.community.website}</a>` :
        `<span class="text-muted font-italic">${this.$t('misc.notProvided')}</span>`
    }
  }
}
</script>
