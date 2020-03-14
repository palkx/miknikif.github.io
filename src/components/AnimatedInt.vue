<template>
  <span>{{ tweeningValue }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TWEEN from "@tweenjs/tween.js";

@Component
export default class AnimatedInt extends Vue {
  @Prop({ required: true }) value!: number;
  @Prop({ default: 300 }) duration!: number;

  private tweenGroup = new TWEEN.Group();
  tweeningValue = 0;

  @Watch("value", { immediate: true })
  valueChanged(newValue: number, oldValue: number) {
    this.tween(oldValue, newValue);
  }

  mounted() {
    this.tween(0, this.value);
  }

  tween(startValue: number, endValue: number) {
    new TWEEN.Tween({ tweeningValue: startValue }, this.tweenGroup)
      .to({ tweeningValue: endValue }, this.duration)
      .onUpdate(value => {
        this.tweeningValue = Math.floor(value.tweeningValue);
      })
      .start();
    this.animate();
  }

  animate() {
    if (this.tweenGroup.update()) {
      requestAnimationFrame(this.animate);
    }
  }
}
</script>
