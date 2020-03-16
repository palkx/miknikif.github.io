<template>
  <div class="game2048">
    <p class="d-flex justify-center align-center">
      <v-btn
        icon
        color="primary"
        @click="showOptions = !showOptions"
        class="headline"
        >⚙
      </v-btn>
      <span class="headline">
        Score: <animated-int v-bind:value="score"></animated-int
      ></span>
    </p>
    <transition name="fade">
      <div v-if="showOptions">
        <v-menu transition="scroll-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn rounded outlined color="primary" dark class="ma-2" v-on="on">
              Change Color
            </v-btn>
          </template>
          <v-color-picker
            value="#1eba74"
            @update:color="changeColor"
            :hide-mode-switch="true"
            :hide-canvas="true"
            :hide-inputs="true"
          ></v-color-picker>
        </v-menu>
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn rounded outlined color="primary" dark class="ma-2" v-on="on">
              Change Size
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="n in [3, 4, 5, 6]"
              :key="n"
              link
              @click="changeSize(n)"
            >
              <v-list-item-title v-text="n + ' x ' + n"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <br />
        <v-btn
          rounded
          outlined
          color="primary"
          dark
          class="ma-2"
          @click="restart()"
        >
          Restart
        </v-btn>
      </div>
    </transition>
    <board
      ref="board"
      @game-over="gameOver"
      @score-changed="showScore"
      v-bind:tile-color="color"
      v-bind:size="size"
    />

    <transition name="fade" mode="out-in">
      <div class="arrow-controls" v-if="gaming" key="game-control">
        <v-btn rounded color="primary" dark class="ma-2" @click="move('w')">
          ⇧
        </v-btn>
        <br />
        <v-btn rounded color="primary" dark class="ma-2" @click="move('a')">
          ⇦
        </v-btn>
        <v-btn rounded color="primary" dark class="ma-2" @click="move('d')">
          ⇨
        </v-btn>
        <br />
        <v-btn rounded color="primary" dark class="ma-2" @click="move('s')">
          ⇩
        </v-btn>
      </div>
      <div class="restart" v-else key="restart">
        <h2>Game Over!</h2>
        <v-btn @click="restart" rounded color="primary" dark class="ma-2">
          Restart
        </v-btn>
      </div>
    </transition>
  </div>
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
  score = 0;
  gaming = true;
  color = "0x1eba74";
  size = 4;
  showOptions = false;

  mounted() {
    const board = this.$refs.board;
    if (board instanceof Board) {
      if (this.hasSaveData()) {
        this.size = parseInt(localStorage.size);
        this.score = parseInt(localStorage.score);
        this.$emit("score-changed", this.score);
        const tiles: TileInfo[] = [];
        for (const json of JSON.parse(localStorage.tiles)) {
          const tile = new TileInfo(0, 0, 0, 0);
          Object.assign(tile, json);
          tiles.push(tile);
        }
        board.initGame(tiles, this.score, this.size);
      } else {
        board.createBoard(this.size);
      }
    }
  }

  hasSaveData(): boolean {
    return localStorage.tiles && localStorage.size && localStorage.score;
  }

  private restart() {
    if (this.$refs.board instanceof Board) {
      this.$refs.board.createBoard(this.size);
    }
    this.gaming = true;
  }

  private gameOver() {
    this.gaming = false;
  }

  private showScore(newScore: number) {
    this.score = newScore;
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

  move(key: string) {
    if (this.$refs.board instanceof Board) {
      this.$refs.board.handleKey(key);
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media only screen and (min-width: 600px) {
  .arrow-controls {
    display: none;
  }
}
</style>
