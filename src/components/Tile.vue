<template>
  <div class="tile" v-bind:style="backColor">
    <h1 class="number">{{ showText() }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tile extends Vue {
  @Prop({ required: true }) readonly number!: number;
  @Prop({ required: true }) readonly color!: Record<string, number>;

  MAX = 12;

  get backColor(): Record<string, string> {
    const r = this.realColor(this.color.r);
    const g = this.realColor(this.color.g);
    const b = this.realColor(this.color.b);
    const combinedColor = "#" + r + g + b;
    return { backgroundColor: combinedColor };
  }

  showText() {
    if (this.number === 0) return "";
    return Math.pow(2, this.number);
  }

  private realColor(color: number): string {
    color = Math.max(Math.min(255, color), 0);
    let newColor = Math.round(
      ((color - 255) / this.MAX) * this.number + 0xff
    ).toString(16);
    if (newColor.length < 2) {
      newColor = "0" + newColor;
    }
    return newColor;
  }
}
</script>
