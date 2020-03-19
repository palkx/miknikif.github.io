<template>
  <v-row class="flex-nowrap align-center justify-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <p class="title ps-2 ma-0">{{ showMessage }}</p>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Loading extends Vue {
  @Prop({ default: "Loading" }) message!: string;
  private showMessage: string = this.message.valueOf();
  private intervalId: number | undefined;
  private count = 0;
  private MAX = 5;

  mounted() {
    this.intervalId = setInterval(() => {
      this.showMessage += ".";
      this.count++;
      if (this.count > this.MAX) {
        this.count = 0;
        this.showMessage = this.message;
      }
    }, 500);
  }

  beforeDestroy() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }
}
</script>
