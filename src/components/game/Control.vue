<template>
  <div class="arrow-controls" key="game-control">
    <v-btn rounded color="primary" class="ma-0" @click="onKey('w')">
      <v-icon>mdi-arrow-up-bold</v-icon>
    </v-btn>
    <br />
    <v-btn rounded color="primary" class="ma-2" @click="onKey('a')">
      <v-icon>mdi-arrow-left-bold</v-icon>
    </v-btn>
    <v-btn rounded color="primary" class="ma-2" @click="onKey('d')">
      <v-icon>mdi-arrow-right-bold</v-icon>
    </v-btn>
    <br />
    <v-btn rounded color="primary" class="ma-0" @click="onKey('s')">
      <v-icon>mdi-arrow-down-bold</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Control extends Vue {
  onKey(key: string) {
    this.$emit("onKey", key);
  }
}
</script>
<style lang="scss" scoped>
@media only screen and (min-width: 600px) {
  .arrow-controls {
    display: none;
  }
}
</style>
