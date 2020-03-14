<template>
  <div class="container">
    <div class="board">
      <tile
        class="tile"
        v-for="(tile, index) in tiles"
        v-bind:ref="'tile-' + index"
        v-bind:key="index"
        v-bind:tile="tile"
        v-bind:color="color"
        @finish-moving="finishMoving"
      ></tile>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tile from "@/components/game/Tile.vue";
import TileInfo from "@/components/game/TileInfo.ts";
import _ from "lodash";

@Component({
  components: {
    Tile
  }
})
export default class Board extends Vue {
  private size = 4;
  private score = 0;
  private tiles: TileInfo[] = [];
  private color = "0x1eba74";
  private gaming = true;

  mounted() {
    this.createBoard(this.size);
    addEventListener("keyup", _.throttle(this.keyMoniter, 300));
    const primary = this.$vuetify.theme.themes.light.primary;
    if (primary) {
      this.color = "0x" + primary.toString().slice(-6);
    }
  }

  destroyed() {
    removeEventListener("keyup", this.keyMoniter);
  }

  public createBoard(size: number = this.size) {
    this.scoreChanged(0);
    this.size = size;
    this.tiles.length = 0;
    for (let index = 0; index < this.size * this.size; index++) {
      const tileInfo = new TileInfo(
        index,
        0,
        Math.floor(index / size),
        index % size
      );
      this.tiles.push(tileInfo);
    }
    this.putNumber();
    this.putNumber();
    // this.putALotNumbers();
    this.gaming = true;
  }

  private putNumber(number = 1) {
    const max = this.size * this.size;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const index = Math.floor(Math.random() * max);
      const tile = this.tiles[index];
      if (tile.number === 0) {
        tile.number = number;
        tile.newNumber = number;
        this.scaleTile(tile);
        break;
      }
    }
  }

  private putALotNumbers() {
    for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) {
      this.putNumber(number);
    }
  }

  public keyMoniter(event: Event) {
    if (!(event instanceof KeyboardEvent) || !this.gaming) return;
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

  public move(isRow = true, moveToStart = false) {
    for (let index = 0; index < this.size; index++) {
      let array = this.tiles.filter(tile => {
        if (isRow) {
          return tile.row === index;
        } else {
          return tile.column === index;
        }
      });
      if (moveToStart) array = array.reverse();
      this.merge(array);
    }
  }

  public moveAndCheck(isRow: boolean, moveToStart: boolean) {
    this.move(isRow, moveToStart);
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

  public merge(array: TileInfo[]) {
    let previousIndex = 0;
    for (let index = 1; index < array.length; index++) {
      if (array[index].newNumber === 0) continue;
      while (
        array[previousIndex].newNumber != 0 &&
        array[previousIndex].newNumber != array[index].newNumber &&
        previousIndex < index - 1
      ) {
        previousIndex++;
      }

      if (
        array[previousIndex].newNumber === 0 ||
        array[previousIndex].newNumber === array[index].newNumber
      ) {
        array[index].moveTo = {
          row: array[previousIndex].row,
          column: array[previousIndex].column
        };
        array[index].moved = true;
        if (array[previousIndex].newNumber === 0) {
          array[previousIndex].newNumber = array[index].newNumber;
        } else {
          array[previousIndex].merged = true;
          array[previousIndex].newNumber += 1;
          this.scoreChanged(
            this.score + Math.pow(2, array[previousIndex].newNumber)
          );
          previousIndex++;
        }
        array[index].newNumber = 0;
      } else {
        previousIndex++;
      }
    }
  }

  finishMoving() {
    const list = this.tiles.filter(tile => tile.moved);
    if (list.length != 0) {
      return;
    }
    this.resetAndPutNew();
  }

  resetAndPutNew() {
    this.tiles.forEach(tile => {
      tile.number = tile.newNumber;
      tile.moveTo = { row: tile.row, column: tile.column };
      if (tile.merged) {
        this.scaleTile(tile);
        tile.merged = false;
      }
    });
    setTimeout(() => {
      this.putNumber();
      if (this.isGameOver()) {
        this.$emit("game-over");
        this.gaming = false;
      }
    }, 100);
  }

  scaleTile(tile: TileInfo) {
    const component = this.$refs["tile-" + tile.index];
    if (component && component[0] instanceof Tile) {
      component[0].scaleAnimation();
    }
  }
}
</script>

<style>
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
  justify-content: space-around;
  align-content: space-around;
  flex-wrap: wrap;
  border: 5px solid var(--v-accent-base);
  border-radius: 3%;
  background: var(--v-accent-base);
}

.tile {
  border-radius: 15%;
  display: flex;
  width: 22.5%;
  height: 22.5%;
  align-items: center;
  justify-content: center;
  background: var(--v-white-base);
}

@media only screen and (max-width: 500px) {
  .container {
    width: 90%;
    padding-top: 90%;
    min-width: 200px;
    min-height: 200px;
  }
}

@media only screen and (min-width: 800px) {
  .container {
    width: 400px;
    height: 400px;
    padding-top: 0;
  }
}
</style>
