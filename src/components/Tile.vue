<template>
  <div class="tile">
    <h1>{{ number }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Tile extends Vue {
  @Prop({ required: true }) readonly number!: number;
  // @Prop({ required: true }) readonly index: number;
}

export class TileInfo {
  constructor(
    public number: number,
    public row: number,
    public column: number,
    public moved: boolean = false,
    public merged: boolean = false
  ) {}
}
</script>
