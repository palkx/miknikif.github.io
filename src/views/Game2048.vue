<template>
  <v-container
    class="px-2 my-5 py-0"
    style="max-width: 600px;  min-width: 300px; "
  >
    <v-row no-gutters class="px-3 flex-nowrap align-center">
      <v-switch label="Auto Mode" v-model="auto"></v-switch>
      <v-spacer></v-spacer>
      <span class="headline">
        Score: <animated-int :value="score"></animated-int
      ></span>
      <v-spacer></v-spacer>
      <v-btn
        id="open-menu"
        icon
        color="primary"
        @click.stop="showOptions = true"
        class="headline"
        ><v-icon>mdi-cog</v-icon>
      </v-btn>
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

    <board
      ref="board"
      @game-over="gameOver"
      @score-changed="addScore"
      :tile-color="color"
      :reduced-animation="auto"
    />

    <transition name="fade" mode="out-in">
      <div class="arrow-controls" v-if="gaming" key="game-control">
        <v-btn rounded color="primary" class="ma-0" @click="move('w')">
          <v-icon>mdi-arrow-up-bold</v-icon>
        </v-btn>
        <br />
        <v-btn rounded color="primary" class="ma-2" @click="move('a')">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </v-btn>
        <v-btn rounded color="primary" class="ma-2" @click="move('d')">
          <v-icon>mdi-arrow-right-bold</v-icon>
        </v-btn>
        <br />
        <v-btn rounded color="primary" class="ma-0" @click="move('s')">
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

@Component({
  components: {
    Board,
    AnimatedInt
  }
})
export default class Game2048 extends Vue {
  private tiles: TileInfo[] = [];
  private auto = false;
  score = 0;
  gaming = true;
  color = "0x1eba74";
  size = 4;
  showOptions = false;
  showColorSetting = false;
  showSizeSetting = false;

  mounted() {
    addEventListener("beforeunload", this.saveData);
    addEventListener("keyup", this.keyMoniter);
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

  destroyed() {
    removeEventListener("keyup", this.keyMoniter);
  }

  keyMoniter(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === "Escape" && this.showOptions) {
      this.showOptions = false;
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
    this.restart();
  }

  changeColor(v) {
    this.color = "0x" + v.hex.slice(-6);
  }

  hexColor(): string {
    return "#" + this.color.slice(-6);
  }

  move(key: string) {
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
