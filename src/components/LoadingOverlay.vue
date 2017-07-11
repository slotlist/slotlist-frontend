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

<style scoped>
.white-overlay {
  background-color: rgba(255, 255, 255, 0.75);
  z-index: 9999;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>
