<template>
  <v-responsive :aspect-ratio="1 / 1" class="container">
    <div class="board">
      <div
        class="tile"
        v-for="(tile, index) in board"
        :ref="'tile-' + index"
        :key="index"
        :style="showTile(tile)"
      ></div>
    </div>
  </v-responsive>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

enum Type {
  Empty,
  Body,
  Fruit
}

class Tile {
  color!: string;
  constructor(public type: Type) {
    this.setType(type);
  }

  setType(type: Type) {
    this.type = type;
    switch (type) {
      case Type.Fruit:
        this.color = "var(--v-accent-base)";
        break;
      case Type.Body:
        this.color = "var(--v-white-base)";
        break;
      case Type.Empty:
      default:
        this.color = "var(--v-black-base)";
    }
  }
}

@Component
export default class Snake extends Vue {
  @Prop({ default: 10 }) private size!: number;
  private boardSize = this.size * this.size;
  private board: Tile[] = [];
  private length = 3;
  private gaming = true;
  private snake: Type[] = [];

  mounted() {
    if (this.size < 5) {
      this.size = 5;
      this.boardSize = this.size * this.size;
      this.board.length = this.boardSize;
    }
    this.moniterKey();
    this.start();
  }

  start() {
    this.board.length = 0;
    for (let index = 0; index < this.boardSize; index++) {
      this.board.push(new Tile(Type.Empty));
    }
    const rowIndex = Math.floor(this.size / 2) * this.size;
    this.snake.push(rowIndex + 2);
    this.snake.push(rowIndex + 1);
    this.snake.push(rowIndex + 0);
    this.snake.forEach(index => this.board[index].setType(Type.Body));
    console.log(this.board);
  }

  isEdge() {
    // TODO
  }

  destroyed() {
    this.unmoniterKey();
  }

  moniterKey() {
    addEventListener("keyup", this.keyMonitor);
  }

  unmoniterKey() {
    removeEventListener("keyup", this.keyMonitor);
  }

  keyMonitor(event: Event) {
    if (!(event instanceof KeyboardEvent) || !this.gaming) return;
    this.handleKey(event.key);
  }

  handleKey(key: string) {
    switch (key) {
      case "ArrowLeft":
      case "a":
        // this.left();
        break;
      case "ArrowUp":
      case "w":
        // this.up();
        break;
      case "ArrowRight":
      case "d":
        // this.right();
        break;
      case "ArrowDown":
      case "s":
        // this.down();
        break;
      default:
        break;
    }
  }

  showTile(tile: Tile): Record<string, string> {
    const percent = 95 / this.size;
    return {
      width: percent + "%",
      height: percent + "%",
      backgroundColor: tile.color
    };
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
  width: 80%;
  min-width: 300px;
  max-width: 500px;
}

.board {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-content: space-around;
  flex-wrap: wrap;
  border: 5px solid var(--v-black-base);
  border-radius: 3%;
  background: var(--v-black-base);
}

.tile {
  border-radius: 50%;
  display: flex;
  background: var(--v-white-base);
}

@media only screen and (max-width: 500px) {
  .container {
    width: 90%;
  }
}
</style>
