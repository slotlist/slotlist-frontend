<template>
  <tr>
    <td>{{ user.nickname }}</td>
    <td>
      <router-link v-if="user.community" :to="{name: 'communityDetails', params: {communitySlug: user.community.slug}}">[{{user.community.tag}}] {{ user.community.name }}</router-link>
      <div v-else class="text-muted font-italic">{{ $t('account.notAssociated') }}</div>
    </td>
    <td class="text-center">
      <b-btn variant="primary" size="sm" :to="{name: 'userDetails', params: {userUid: user.uid}}">
        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
      </b-btn>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'user'
  ]
}
</script>
