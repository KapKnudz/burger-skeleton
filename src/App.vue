<template>
  <div id="app">
    <router-view/>
    <div class="footer">
      <p>Skurknästet Inc </p>
    </div>
  </div>
</template>

<script>
import Ordering from "./views/Ordering.vue"

export default {
  name: 'app',
  components: {
    Ordering
  }
}
</script>

<style>
body, html, h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
}
button {
  cursor: pointer;
}
#app {
  font-family: 'Montserrat', sans-serif;
  color: rgb(250, 250, 250);
  min-height: 120vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #d9d9d9;

}
.footer {
  min-height: 75px;
  text-align: center;
  background-color: #737373;
}
</style>
