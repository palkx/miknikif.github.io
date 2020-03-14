<template>
  <div class="home">
    <h1>Hello</h1>
    <p>Nothing here.</p>
    <br />
    <v-btn
      rounded
      color="primary"
      dark
      class="ma-2"
      href="https://github.com/nestorm001/nestorm001.github.io"
      target="_blank"
      >github repo</v-btn
    >
    <v-btn
      outlined
      rounded
      class="ma-2"
      color="primary"
      href="https://github.com/nestorm001/"
      target="_blank"
      >my github</v-btn
    >
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld
  }
};
</script>
