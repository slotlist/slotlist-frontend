<template>
  <tr>
    <td>[{{ community.tag }}]</td>
    <td>{{ community.name }}</td>
    <td v-html="optionalCommunityWebsite"></td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'communityDetails', params: {communitySlug: community.slug}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
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
