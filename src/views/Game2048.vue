<template>
  <v-container
    class="px-2 my-5 py-0"
    style="max-width: 600px;  min-width: 300px; "
  >
    <v-row no-gutters class="px-3 flex-nowrap align-center">
      <v-row no-gutters class="col-4 flex-nowrap align-center">
        <v-switch class="float-left" label="Auto" v-model="auto"></v-switch>
        <v-btn
          id="open-auto"
          icon
          color="primary"
          @click.stop="showAutoSettings = true"
          ><v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </v-row>
      <v-dialog v-model="showAutoSettings" max-width="300px" hide-overlay>
        <v-card>
          <v-list>
            <v-subheader>Strategy</v-subheader>
            <v-list-item
              v-for="item in algorithms()"
              :key="item"
              link
              @click="changeStrategy(item)"
            >
              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
      <span class="headline col-4">
        Score: <animated-int :value="score"></animated-int
      ></span>
      <div class="col-4">
        <v-btn
          class="menu-right float-right"
          id="open-auto"
          icon
          color="primary"
          @click.stop="showOptions = true"
          ><v-icon>mdi-cog</v-icon>
        </v-btn>
      </div>
    </v-row>
    <v-dialog v-model="showOptions" max-width="300px" hide-overlay>
      <v-card>
        <v-btn
          rounded
          outlined
          color="primary"
          dark
          class="ma-2 settings-button"
          @click="showColorSetting = !showColorSetting"
        >
          Change Color
        </v-btn>
        <v-expand-transition>
          <v-color-picker
            class="color-picker"
            v-if="showColorSetting"
            :value="hexColor()"
            flat
            @update:color="changeColor"
            :hide-mode-switch="true"
            :hide-canvas="true"
            :hide-inputs="true"
          ></v-color-picker>
        </v-expand-transition>
        <v-btn
          rounded
          outlined
          color="primary"
          dark
          class="ma-2 settings-button"
          @click="showSizeSetting = !showSizeSetting"
        >
          Change Size
        </v-btn>
        <transition name="scroll">
          <v-list v-if="showSizeSetting">
            <v-list-item
              v-for="n in [3, 4, 5, 6]"
              :key="n"
              link
              @click="changeSize(n)"
            >
              <v-list-item-title v-text="n + ' x ' + n"></v-list-item-title>
            </v-list-item>
          </v-list>
        </transition>
        <v-btn
          rounded
          outlined
          color="primary"
          dark
          class="ma-2 settings-button"
          @click="restart()"
        >
          Restart
        </v-btn>
      </v-card>
    </v-dialog>

    <v-row no-gutters class="px-3 flex-nowrap align-center">
      <span class="col-6 title">
        Strategy: <span class="subtitle-1"> {{ strategy }}</span></span
      >
      <span class="col-6 title float-right" v-if="!auto && gaming">
        Hint: <v-icon>{{ next }}</v-icon></span
      >
    </v-row>
    <board
      ref="board"
      @game-over="gameOver"
      @score-changed="addScore"
      @next-hint="showNextHint"
      :tile-color="color"
      :reduced-animation="auto"
    />

    <transition name="fade" mode="out-in">
      <div class="arrow-controls" v-if="gaming" key="game-control">
        <v-btn rounded color="primary" class="ma-0" @click="manualMove('w')">
          <v-icon>mdi-arrow-up-bold</v-icon>
        </v-btn>
        <br />
        <v-btn rounded color="primary" class="ma-2" @click="manualMove('a')">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </v-btn>
        <v-btn rounded color="primary" class="ma-2" @click="manualMove('d')">
          <v-icon>mdi-arrow-right-bold</v-icon>
        </v-btn>
        <br />
        <v-btn rounded color="primary" class="ma-0" @click="manualMove('s')">
          <v-icon>mdi-arrow-down-bold</v-icon>
        </v-btn>
      </div>
      <div class="restart" v-else key="restart">
        <h2>Game Over!</h2>
        <v-btn @click="restart" rounded color="primary" dark class="ma-2">
          Restart
        </v-btn>
      </div>
    </transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "@/components/game/Board.vue";
import TileInfo from "@/components/game/TileInfo.ts";
import AnimatedInt from "@/components/AnimatedInt.vue";
import Auto2048, { Algorithm } from "@/components/game/Auto2048.ts";

@Component({
  components: {
    Board,
    AnimatedInt
  }
})
export default class Game2048 extends Vue {
  private tiles: TileInfo[] = [];
  private auto = false;
  private intervalId: number | undefined;
  private auto2048!: Auto2048;
  private score = 0;
  private gaming = true;
  private color = "0x1eba74";
  private size = 4;
  private showOptions = false;
  private showColorSetting = false;
  private showSizeSetting = false;
  private showAutoSettings = false;
  private strategy = "GREEDY_3_PREDICT";
  private next = "";

  mounted() {
    addEventListener("beforeunload", this.saveData);
    addEventListener("keyup", this.keyMonitor);
    const board = this.$refs.board;
    if (board instanceof Board) {
      if (this.hasSaveData()) {
        this.size = parseInt(localStorage.size);
        this.score = parseInt(localStorage.score);
        this.$emit("score-changed", this.score);
        for (const json of JSON.parse(localStorage.tiles)) {
          const tile = new TileInfo(0, 0, 0, 0);
          Object.assign(tile, json);
          this.tiles.push(tile);
        }
        board.initGame(this.tiles, this.size);
      } else {
        board.createBoard(this.size);
      }

      this.auto2048 = new Auto2048(
        this.tiles,
        this.size,
        Algorithm.GREEDY_3_PREDICT
      );
      this.intervalId = setInterval(() => {
        if (this.auto && this.gaming) {
          const next = this.auto2048.next();
          this.autoMove(next);
        }
      }, 100);
      this.showNextHint();
    }
  }

  beforeDestroy() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    removeEventListener("keyup", this.keyMonitor);
  }

  algorithms() {
    const array: string[] = [];
    for (const key in Algorithm) {
      if (isNaN(Number(key))) {
        array.push(key);
      }
    }
    return array;
  }

  changeStrategy(algorithm: string) {
    this.strategy = algorithm;
    this.showAutoSettings = false;
    this.auto2048.setAlgorithm(Algorithm[algorithm]);
  }

  showNextHint() {
    const next = this.auto2048.next();
    switch (next) {
      case "w":
        this.next = "mdi-arrow-up-bold";
        break;
      case "a":
        this.next = "mdi-arrow-left-bold";
        break;
      case "s":
        this.next = "mdi-arrow-down-bold";
        break;
      case "d":
      default:
        this.next = "mdi-arrow-right-bold";
        break;
    }
  }

  saveData() {
    localStorage.score = this.score;
    localStorage.size = this.size;
    localStorage.tiles = JSON.stringify(this.tiles);
  }

  removeSaveData() {
    localStorage.removeItem("tiles");
    localStorage.removeItem("score");
    localStorage.removeItem("size");
  }

  keyMonitor(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.code === "Escape") {
      this.showOptions = false;
      this.showAutoSettings = false;
    }
    if (!this.gaming && event.code === "Space") {
      this.restart();
    }
  }

  hasSaveData(): boolean {
    return localStorage.tiles && localStorage.size && localStorage.score;
  }

  private restart() {
    this.showOptions = false;
    if (this.$refs.board instanceof Board) {
      this.$refs.board.createBoard(this.size);
    }
    this.gaming = true;
    this.score = 0;
  }

  private gameOver() {
    this.removeSaveData();
    this.gaming = false;
  }

  private addScore(score: number) {
    this.score += score;
  }

  changeSize(v) {
    if (this.size === v) {
      return;
    }
    this.size = v;
    this.auto2048.changeSize(v);
    this.restart();
  }

  changeColor(v) {
    this.color = "0x" + v.hex.slice(-6);
  }

  hexColor(): string {
    return "#" + this.color.slice(-6);
  }

  manualMove(key: string) {
    if (this.$refs.board instanceof Board) {
      this.$refs.board.manualInputKey(key);
    }
  }

  autoMove(key: string) {
    if (this.$refs.board instanceof Board) {
      this.$refs.board.handleKey(key);
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.v-list {
  padding: 0;
  overflow: hidden;
}

.scroll-enter-active,
.scroll-leave-active {
  transition: height 0.5s;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scroll-enter,
.scroll-leave-to {
  height: 0;
}

.scroll-enter-to,
.scroll-leave {
  /* a hardcoded height to make the transition looks right */
  height: 220px;
}

@media only screen and (min-width: 600px) {
  .arrow-controls {
    display: none;
  }
}

.settings-button {
  width: 80%;
  margin: 0 10%;
}

.color-picker {
  border: none;
  margin: 0 auto;
}
</style>
