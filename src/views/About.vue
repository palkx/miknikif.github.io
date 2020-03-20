<template>
  <div class="my-5">
    <h1>Hello</h1>
    <h2>Nothing here.</h2>
    <h2 v-ripple="{ center: true }" @click="click">I'm still learning.</h2>
    <br />
    <v-btn
      rounded
      color="primary"
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
    <v-switch class="top-left" label="Dark Mode" v-model="value"></v-switch>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {
  private clickCount = 0;

  click() {
    this.clickCount++;
    if (this.clickCount >= 10) {
      alert("The answer is 42!!!");
      this.clickCount = 0;
    }
  }

  get value(): boolean {
    return this.$vuetify.theme.dark;
  }

  set value(v) {
    this.$vuetify.theme.dark = v;
    localStorage.themeDark = v;
  }
}
</script>

<style lang="scss">
.top-left {
  position: absolute;
  top: 0;
  left: 16px;
}
</style>
