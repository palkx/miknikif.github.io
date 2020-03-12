<template>
  <div class="tile">
    <h1 class="number">{{ number }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tile extends Vue {
  @Prop({ required: true }) readonly number!: number;
  // @Prop({ required: true }) readonly index: number;
}
</script>
