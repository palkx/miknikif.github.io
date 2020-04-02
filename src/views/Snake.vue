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
      <transition name="fade">
        <div class="centered" v-if="!gaming">
          <div>
            <h2 class="primary--text">Game Over!</h2>
            <br />
            <v-btn rounded color="primary" @click="start()">Restart</v-btn>
          </div>
        </div>
      </transition>
    </div>
  </v-responsive>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

enum Type {
  Empty,
  Head,
  Crushed,
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
        this.color = "var(--v-primary-lighten1)";
        break;
      case Type.Head:
        this.color = "var(--v-primary-base)";
        break;
      case Type.Crushed:
        this.color = "var(--v-error-base)";
        break;
      case Type.Empty:
      default:
        this.color = "var(--v-black-darken4)";
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
  private next: [number, number] = [0, 0];
  private direction: [number, number] = [0, 1];
  private intervalId: number | undefined;
  private interval = 1000;
  private fruitCount = 0;

  mounted() {
    if (this.size < 5) {
      this.size = 5;
      this.boardSize = this.size * this.size;
      this.board.length = this.boardSize;
    }
    this.moniterKey();
    this.start();
  }

  init() {
    this.stopInterval();
    this.board.length = 0;
    this.snake.length = 0;
    this.fruitCount = 0;
    this.direction = [0, 1];
  }

  start() {
    this.init();
    this.gaming = true;
    for (let index = 0; index < this.boardSize; index++) {
      this.board.push(new Tile(Type.Empty));
    }
    const rowIndex = Math.floor(this.size / 2);
    this.snake.push(rowIndex * this.size + 2);
    this.snake.push(rowIndex * this.size + 1);
    this.snake.push(rowIndex * this.size + 0);
    this.decideNext();
    this.insertFruitAndRefresh();
    this.intervalId = setInterval(() => {
      if (this.gaming) {
        this.decideNext();
        this.moveNext();
      }
    }, this.interval);
  }

  insertFruitAndRefresh() {
    if (!this.gaming) {
      return;
    }
    while (this.fruitCount < 2) {
      const index = Math.floor(Math.random() * this.boardSize);
      const tile = this.board[index];
      if (tile.type === Type.Empty) {
        tile.setType(Type.Fruit);
        this.fruitCount++;
      }
    }
    this.snake.forEach(index => this.board[index].setType(Type.Body));
    this.board[this.snake[0]].setType(Type.Head);
  }

  decideNext() {
    const head = this.snake[0];
    this.next[0] = Math.floor(head / this.size) + this.direction[0];
    this.next[1] = (head % this.size) + this.direction[1];
  }

  moveNext() {
    const nextTile = this.nextTile();
    if (nextTile) {
      const end = this.snake.pop();
      if (end) {
        this.board[end].setType(Type.Empty);
        switch (nextTile.type) {
          case Type.Empty:
            this.snake.unshift(this.next[0] * this.size + this.next[1]);
            break;
          case Type.Fruit:
            this.snake.unshift(this.next[0] * this.size + this.next[1]);
            this.snake.push(end);
            this.fruitCount--;
            break;
          case Type.Body:
            this.gameOver();
            break;
          default:
            break;
        }
        this.insertFruitAndRefresh();
      }
    } else {
      this.gameOver();
    }
  }

  withinRange(next: [number, number] = this.next): boolean {
    return (
      next[0] >= 0 && next[0] < this.size && next[1] >= 0 && next[1] < this.size
    );
  }

  nextTile(): Tile | undefined {
    if (this.withinRange()) {
      return this.board[this.next[0] * this.size + this.next[1]];
    }
    return undefined;
  }

  gameOver() {
    this.board[this.snake[0]].setType(Type.Crushed);
    this.gaming = false;
  }

  beforeDestroy() {
    this.stopInterval();
    this.unmoniterKey();
  }

  stopInterval() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    this.intervalId = undefined;
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
        this.handleInput([0, -1]);
        break;
      case "ArrowUp":
      case "w":
        this.handleInput([-1, 0]);
        break;
      case "ArrowRight":
      case "d":
        this.handleInput([0, 1]);
        break;
      case "ArrowDown":
      case "s":
        this.handleInput([1, 0]);
        break;
      default:
        break;
    }
  }

  handleInput(input: [number, number]) {
    const head = this.snake[0];
    const next =
      (Math.floor(head / this.size) + input[0]) * this.size +
      (head % this.size) +
      input[1];
    if (next === this.snake[1]) {
      return;
    }
    this.direction = input;
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
  border: 5px solid var(--v-black-darken4);
  border-radius: 3%;
  background: var(--v-black-darken4);
}

.tile {
  border-radius: 50%;
  background: var(--v-white-base);
}

.centered {
  width: 100%;
  height: 100%;
  top: 0;
  backdrop-filter: blur(5px);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media only screen and (max-width: 500px) {
  .container {
    width: 90%;
  }
}
</style>
