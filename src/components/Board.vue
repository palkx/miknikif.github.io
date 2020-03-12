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
import { Component, Vue } from "vue-property-decorator";
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
    addEventListener("keyup", this.keyMoniter);
  }

  destroyed() {
    removeEventListener("keyup", this.keyMoniter);
  }

  public createBoard(size: number = this.size) {
    this.scoreChanged(0);
    this.size = size;
    this.tiles.length = 0;
    for (let index = 0; index < this.size * this.size; index++) {
      const tileInfo = new TileInfo(0, Math.floor(index / size), index % size);
      this.tiles.push(tileInfo);
    }
    this.putNumber();
    // this.putALotNumbers();
  }

  private putNumber(number = 1) {
    const max = this.size * this.size;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const index = Math.floor(Math.random() * max);
      if (this.tiles[index].number == 0) {
        this.tiles[index].number = number;
        break;
      }
    }
  }

  private putALotNumbers() {
    for (const number of [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]) {
      this.putNumber(number);
    }
  }

  public keyMoniter(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;
    switch (event.key) {
      case "ArrowLeft":
      case "a":
        this.left();
        break;
      case "ArrowUp":
      case "w":
        this.up();
        break;
      case "ArrowRight":
      case "d":
        this.right();
        break;
      case "ArrowDown":
      case "s":
        this.down();
        break;
      default:
        break;
    }
  }

  public move(isRow = true, moveToStart = false): boolean {
    let changed = false;
    // console.log("move begin");

    for (let index = 0; index < this.size; index++) {
      let array = this.tiles.filter(tile => {
        if (isRow) {
          return tile.row === index;
        } else {
          return tile.column === index;
        }
      });
      if (moveToStart) array = array.reverse();

      // console.log(array.map(tile => tile.number));
      changed = this.merge(array) || changed;
    }
    // console.log("move end is changed " + changed);
    return changed;
  }

  public moveAndCheck(isRow: boolean, moveToStart: boolean) {
    if (this.move(isRow, moveToStart)) {
      this.putNumber();
      if (this.isGameOver()) {
        this.$emit("game-over");
      }
    }
  }

  public isGameOver(): boolean {
    const zeros = this.tiles.filter(tile => tile.number === 0);
    if (zeros.length > 0) {
      return false;
    }

    for (let index = 0; index < this.size; index++) {
      if (this.canMove(this.tiles.filter(tile => tile.row === index))) {
        return false;
      }
      if (this.canMove(this.tiles.filter(tile => tile.column === index))) {
        return false;
      }
    }
    return true;
  }

  private canMove(row: TileInfo[]): boolean {
    for (let index = 0; index < row.length - 1; index++) {
      const number = row[index].number;
      if (number === row[index + 1].number) return true;
    }
    return false;
  }

  public up() {
    this.moveAndCheck(false, false);
  }

  public down() {
    this.moveAndCheck(false, true);
  }

  public left() {
    this.moveAndCheck(true, false);
  }

  public right() {
    this.moveAndCheck(true, true);
  }

  private scoreChanged(newScore: number) {
    this.score = newScore;
    this.$emit("score-changed", this.score);
  }

  public merge(array: TileInfo[]): boolean {
    let previousIndex = 0;
    let changed = false;
    for (let index = 1; index < array.length; index++) {
      if (array[index].number === 0) continue;
      while (
        array[previousIndex].number != 0 &&
        array[previousIndex].number != array[index].number &&
        previousIndex < index - 1
      ) {
        previousIndex++;
      }

      if (array[previousIndex].number === 0) {
        array[previousIndex].number = array[index].number;
        array[index].number = 0;
        changed = true;
      } else if (array[previousIndex].number === array[index].number) {
        array[previousIndex].number += 1;
        this.scoreChanged(
          this.score + Math.pow(2, array[previousIndex].number)
        );
        array[index].number = 0;
        changed = true;
        previousIndex++;
      } else {
        previousIndex++;
      }
    }
    return changed;
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
  align-content: stretch;
  flex-wrap: wrap;
}

.tile {
  display: flex;
  box-sizing: border-box;
  width: 25%;
  height: 25%;
  align-items: center;
  justify-content: center;
  background: lightblue;
  flex-wrap: wrap;
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
