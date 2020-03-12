<template>
  <div class="board">
    <tile
      class="tile"
      v-for="(number, index) in numbers"
      v-bind:key="index"
      v-bind:number="number"
    ></tile>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Tile from "@/components/Tile.vue";

@Component({
  components: {
    Tile
  }
})
export default class Board extends Vue {
  private size = 4;
  private score = 0;
  private numbers: number[] = [];
  // private info:TileInfo;

  created() {
    for (let index = 0; index < this.size * this.size; index++) {
      this.numbers.push(Math.pow(2, Math.min(index + 1, 10)));
    }
    console.log(this.numbers);
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

<style scoped>
.board {
  margin: 0 auto;
  width: 75%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.tile {
  width: 25%;
}
</style>
