<template>
  <div class="white-overlay">
    <spinner :size='size || "big"' :message='message || "Loading..."'></spinner>
  </div>
</template>

<script>
export default {
  props: [
    'message',
    'size'
  ]
}
</script>
