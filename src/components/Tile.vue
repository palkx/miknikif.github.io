<template>
  <div>
    <v-card
      v-bind:id="'card-' + tile.index"
      v-bind:style="backColor"
      class="number-container rounded-card"
      :elevation="5"
      :shaped="true"
    >
      <h1 class="number no_highlighting">{{ showText() }}</h1>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TileInfo from "@/components/TileInfo.ts";
import TWEEN from "@tweenjs/tween.js";

@Component
export default class Tile extends Vue {
  @Prop({ required: true }) readonly tile!: TileInfo;
  @Prop({ required: true }) readonly color!: string;

  MAX = 12;
  duration = 300;
  moveATile = 111.11;
  private card!: HTMLElement;

  mounted() {
    this.saveCard();
    if (this.number > 0) {
      this.card.style.setProperty("display", `flex`);
    }
  }

  saveCard() {
    const element = document.getElementById("card-" + this.tile.index);
    if (element != null) {
      this.card = element;
    }
  }

  @Watch("tile.moveTo", { immediate: true })
  valueChanged(
    newValue: Record<string, number>,
    oldValue: Record<string, number>
  ) {
    if (this.card != undefined) {
      this.saveCard();
      this.tween(oldValue, newValue);
    }
  }

  @Watch("number", { immediate: true }) numberChanged(newValue: number) {
    if (this.card != undefined) {
      this.saveCard();
      if (newValue === 0) {
        this.card.style.setProperty("display", `none`);
      } else {
        this.card.style.setProperty("display", `flex`);
      }
    }
  }

  tween(startValue: Record<string, number>, endValue: Record<string, number>) {
    if (
      startValue.row === endValue.row &&
      startValue.column === endValue.column
    ) {
      return;
    }
    new TWEEN.Tween({ x: startValue.row, y: startValue.column })
      .to({ x: endValue.row, y: endValue.column }, this.duration)
      .onUpdate(value => {
        this.card.style.setProperty(
          "transform",
          `translate(${(value.y - this.tile.column) * this.moveATile}%, 
          ${(value.x - this.tile.row) * this.moveATile}%)`
        );
      })
      .onComplete(() => {
        this.$emit("finish-moving");
      })
      .start();
    this.animate();
  }

  animate() {
    if (TWEEN.update()) {
      requestAnimationFrame(this.animate);
    }
  }
  get number(): number {
    return this.tile.number;
  }

  showText() {
    if (this.number === 0) return "";
    return Math.pow(2, this.number);
  }

  get backColor(): Record<string, string> {
    const colorInt = parseInt(this.color);
    const r = this.realColor((colorInt & 0xff0000) >> 16);
    const g = this.realColor((colorInt & 0x00ff00) >> 8);
    const b = this.realColor((colorInt & 0x0000ff) >> 0);
    const combinedColor = "#" + r + g + b;
    return { backgroundColor: combinedColor };
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

<style>
.number-container {
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 15%;
}
</style>
