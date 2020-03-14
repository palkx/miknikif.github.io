<template>
  <div class="game2048">
    <h2>Score: <animated-int v-bind:value="score"></animated-int></h2>
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
    <board
      ref="board"
      @game-over="gameOver"
      @score-changed="showScore"
      v-bind:tile-color="color"
      v-bind:size="size"
    />
    <transition name="fade">
      <div class="arrow-controls" v-if="gaming">
        <v-btn rounded color="primary" dark class="ma-2" @click="move('w')">
          ⇧
        </v-btn>
        <br />
        <v-btn rounded color="primary" dark class="ma-2" @click="move('a')">
          ⇦
        </v-btn>
        <v-btn rounded color="primary" dark class="ma-2" @click="move('s')">
          ⇩
        </v-btn>
        <v-btn rounded color="primary" dark class="ma-2" @click="move('d')">
          ⇨
        </v-btn>
      </div>
    </transition>

    <transition name="fade">
      <div class="restart" v-if="!gaming">
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

  private restart() {
    if (this.$refs.board instanceof Board) {
      this.$refs.board.createBoard();
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
    this.size = v;
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
