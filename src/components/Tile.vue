<template>
  <div class="tile" v-bind:style="backColor">
    <h1 class="number no_highlighting">{{ showText() }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tile extends Vue {
  @Prop({ required: true }) readonly number!: number;
  @Prop({ required: true }) readonly color!: string;

  MAX = 12;

  get backColor(): Record<string, string> {
    const colorInt = parseInt(this.color);
    const r = this.realColor((colorInt & 0xff0000) >> 16);
    const g = this.realColor((colorInt & 0x00ff00) >> 8);
    const b = this.realColor((colorInt & 0x0000ff) >> 0);
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
