<template>
  <div>
    <v-card
      v-bind:id="'card-' + tile.index"
      v-bind:style="backColor"
      class="number-container rounded-card"
      :elevation="5"
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
  moveATile = 111.11;
  private card!: HTMLElement;
  private tweenTranslate = new TWEEN.Group();
  private tweenScale = new TWEEN.Group();

  mounted() {
    const element = document.getElementById("card-" + this.tile.index);
    if (element != null) {
      this.card = element;
    }
    if (this.number > 0) {
      this.card.style.setProperty("display", `flex`);
    }
  }

  @Watch("tile.moveTo", { immediate: true })
  valueChanged(
    newValue: Record<string, number>,
    oldValue: Record<string, number>
  ) {
    if (this.card != undefined) {
      this.tween(oldValue, newValue);
    }
  }

  @Watch("number", { immediate: true }) numberChanged() {
    if (this.card != undefined) {
      if (this.number === 0) {
        this.card.style.setProperty("display", `none`);
      } else {
        this.card.style.setProperty("display", `flex`);
      }
    }
  }

  tween(startValue: Record<string, number>, endValue: Record<string, number>) {
    if (
      this.tile.row === this.tile.moveTo.row &&
      this.tile.column === this.tile.moveTo.column
    ) {
      return;
    }
    new TWEEN.Tween(
      { x: startValue.row, y: startValue.column },
      this.tweenTranslate
    )
      .to({ x: endValue.row, y: endValue.column }, 200)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(value => {
        this.card.style.setProperty(
          "transform",
          `translate(${(value.y - this.tile.column) * this.moveATile}%,
          ${(value.x - this.tile.row) * this.moveATile}%)`
        );
      })
      .onComplete(() => {
        this.tile.moved = false;
        this.card.style.setProperty("transform", `translate(0)`);
        this.$emit("finish-moving");
      })
      .start();
    this.translateAnimate();
  }

  translateAnimate() {
    if (this.tweenTranslate.update()) {
      requestAnimationFrame(this.translateAnimate);
    }
  }

  get number(): number {
    return this.tile.number;
  }

  public scaleAnimation() {
    new TWEEN.Tween({ scale: 0.8 }, this.tweenScale)
      .to({ scale: 1.0 }, 300)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(value => {
        this.card.style.setProperty("transform", `scale(${value.scale})`);
      })
      .start();
    this.scaleAnimate();
  }

  scaleAnimate() {
    if (this.tweenScale.update()) {
      requestAnimationFrame(this.scaleAnimate);
    }
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
      Math.max(0, ((color - 255) / this.MAX) * this.number + 0xff)
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
