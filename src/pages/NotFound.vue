<template>
  <center>
    <div class="text-h1 text-weight-bolder text-404">404</div>
    <h1>Not Found!</h1>
    <p>
      <a href="/">Go to Round?</a>
    </p>
  </center>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style scoped>
center {
  margin: 15vw;
}

h1 {
  color: var(--border);
  font-size: 2em;
}

.text-404 {
  background: #0f2027; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2c5364,
    #203a43,
    #0f2027
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
