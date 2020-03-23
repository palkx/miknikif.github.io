<template>
  <v-responsive :aspect-ratio="1 / 1" class="container">
    <div class="board">
      <tile
        class="tile"
        v-for="(tile, index) in tiles"
        :ref="'tile-' + index"
        :key="index"
        :tile="tile"
        :color="tileColor"
        :font-scale="size"
        :reduced-animation="reducedAnimation"
        @finish-moving="finishMoving"
        :style="sizeStyle"
      ></tile>
    </div>
  </v-responsive>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Tile from "@/components/game/Tile.vue";
import TileInfo from "@/components/game/TileInfo.ts";

@Component({
  components: {
    Tile
  }
})
export default class Board extends Vue {
  @Prop({ default: "0x1eba74" }) tileColor!: string;
  @Prop({ default: false }) readonly reducedAnimation!: boolean;
  private size = 4;
  private tiles: TileInfo[] = [];
  private gaming = true;
  private animating = false;
  private auto = this.reducedAnimation;

  mounted() {
    this.moniterKey();
    const primary = this.$vuetify.theme.themes.light.primary;
    if (primary) {
      this.tileColor = "0x" + primary.toString().slice(-6);
    }
  }

  initGame(tiles: TileInfo[], size: number) {
    this.tiles = tiles;
    this.size = size;
  }

  destroyed() {
    this.unmoniterKey();
  }

  public createBoard(size: number = this.size) {
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

  get sizeStyle(): Record<string, string> {
    const percent = 90 / this.size;
    return { width: percent + "%", height: percent + "%" };
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

  manualInputKey(key: string) {
    if (this.auto) {
      return;
    }
    this.handleKey(key);
  }

  handleKey(key: string) {
    if (this.animating) {
      return;
    }
    this.animating = true;

    switch (key) {
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
        this.animating = false;
        break;
    }
  }

  moniterKey() {
    addEventListener("keyup", this.keyMonitor);
  }

  unmoniterKey() {
    removeEventListener("keyup", this.keyMonitor);
  }

  @Watch("reducedAnimation")
  onAutoChanged() {
    this.auto = this.reducedAnimation;
    if (this.auto) {
      this.unmoniterKey();
    } else {
      this.moniterKey();
    }
  }

  keyMonitor(event: Event) {
    if (!(event instanceof KeyboardEvent) || !this.gaming) return;
    this.handleKey(event.key);
  }

  public move(isRow = true, needReverse = false): boolean {
    let changed = false;
    for (let index = 0; index < this.size; index++) {
      let array = this.tiles.filter(tile => {
        if (isRow) {
          return tile.row === index;
        } else {
          return tile.column === index;
        }
      });
      if (needReverse) array = array.reverse();
      changed = this.merge(array) || changed;
    }
    return changed;
  }

  public moveAndCheck(isRow: boolean, needReverse: boolean) {
    this.animating = this.move(isRow, needReverse);
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
      const next = row[index + 1].number;
      if (number === 0) {
        if (next != 0) return true;
      } else {
        if (next === number || next === 0) return true;
      }
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

  public merge(array: TileInfo[]): boolean {
    let previousIndex = 0;
    let changed = false;
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
        changed = true;
        if (array[previousIndex].newNumber === 0) {
          array[previousIndex].newNumber = array[index].newNumber;
        } else {
          array[previousIndex].merged = true;
          array[previousIndex].newNumber += 1;
          this.$emit(
            "score-changed",
            Math.pow(2, array[previousIndex].newNumber)
          );
          previousIndex++;
        }
        array[index].newNumber = 0;
      } else {
        previousIndex++;
      }
    }
    return changed;
  }

  finishMoving() {
    const list = this.tiles.filter(tile => tile.moved);
    if (list.length != 0) {
      return;
    }
    this.resetAndPutNew();
  }

  resetAndPutNew() {
    this.refreshTile();

    // 0.9 ==> 2, 0.1 ===> 4
    const number = Math.round(Math.random() + 0.6);
    this.putNumber(number);
    this.animating = false;
    if (this.isGameOver()) {
      this.$emit("game-over");
      this.gaming = false;
    }
  }

  refreshTile() {
    this.tiles.forEach(tile => {
      tile.number = tile.newNumber;
      tile.moveTo = { row: tile.row, column: tile.column };
      const component = this.$refs["tile-" + tile.index];
      if (component && component[0] instanceof Tile) {
        component[0].resetTransform();
        if (tile.merged) {
          component[0].scaleAnimation();
          tile.merged = false;
        }
      }
    });
  }

  scaleTile(tile: TileInfo) {
    const component = this.$refs["tile-" + tile.index];
    if (component && component[0] instanceof Tile) {
      component[0].scaleAnimation();
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  min-width: 300px;
}
.board {
  width: 100%;
  height: 100%;
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
  width: 15%;
  height: 22.5%;
  height: 15%;
  align-items: center;
  justify-content: center;
  background: var(--v-white-base);
}

@media only screen and (max-width: 500px) {
  .container {
    width: 90%;
  }
}
</style>
