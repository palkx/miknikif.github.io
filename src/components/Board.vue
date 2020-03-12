<template>
  <div class="container">
    <div class="board">
      <tile
        class="tile"
        v-for="(tile, index) in tiles"
        v-bind:key="index"
        v-bind:number="tile.number"
      ></tile>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "@/components/Tile.vue";
import TileInfo from "@/components/TileInfo.ts";

@Component({
  components: {
    Tile
  }
})
export default class Board extends Vue {
  private size = 4;
  private score = 0;
  private tiles: TileInfo[] = [];

  created() {
    this.createBoard(this.size);
  }

  public createBoard(size: number) {
    this.size = size;
    for (let index = 0; index < this.size * this.size; index++) {
      const tileInfo = new TileInfo(0, index / size, index % size);
      this.tiles.push(tileInfo);
    }
    this.putNumber();
    console.log(this.tiles);
  }

  private putNumber() {
    const max = this.size * this.size;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const index = Math.floor(Math.random() * max);
      if (this.tiles[index].number == 0) {
        this.tiles[index].number = 1;
        break;
      }
    }
  }

  public merge(array: number[]): number[] {
    // console.log("start");
    // console.log(array);
    let previousIndex = 0;
    for (let index = 1; index < array.length; index++) {
      if (array[index] === 0) continue;
      while (
        array[previousIndex] != 0 &&
        array[previousIndex] != array[index] &&
        previousIndex < index - 1
      ) {
        previousIndex++;
      }

      // console.log(
      // "previous " + array[previousIndex] + " index " + previousIndex
      // );
      if (array[previousIndex] === 0) {
        array[previousIndex] = array[index];
        array[index] = 0;
      } else if (array[previousIndex] === array[index]) {
        array[previousIndex] += 1;
        array[index] = 0;
        previousIndex++;
      } else {
        previousIndex++;
      }
      // console.log(array);
    }
    // console.log("end");
    return array;
  }
}
</script>

<style>
.board .tile {
  border: 2px solid black;
}

.container {
  margin: 20px auto;
  width: 60%;
  padding-top: 60%;
  position: relative;
}

.board {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.tile {
  display: flex;
  box-sizing: border-box;
  width: 25%;
  align-items: center;
  justify-content: center;
  background: lightblue;
}

@media only screen and (max-width: 500px) {
  .container {
    width: 90%;
    padding-top: 90%;
    min-width: 200px;
    min-height: 200px;
  }
}

@media only screen and (min-width: 1000px) {
  .container {
    width: 500px;
    height: 500px;
    padding-top: 0;
  }
}
</style>
