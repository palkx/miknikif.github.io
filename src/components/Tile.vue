<template>
  <div class="tile">
    <h1 class="number">{{ showText() }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tile extends Vue {
  @Prop({ required: true }) readonly number!: number;

  showText() {
    if (this.number === 0) return "";
    return Math.pow(2, this.number);
  }
}
</script>
