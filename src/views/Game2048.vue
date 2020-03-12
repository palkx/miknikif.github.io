<template>
  <div class="game2048">
    <h1>A simple 2048.</h1>
    <h2>Score: <animated-int v-bind:value="score"></animated-int></h2>
    <board ref="board" @game-over="gameOver" @score-changed="showScore" />
    <transition name="fade">
      <div class="restart" v-if="!gaming">
        <h2>Game Over!</h2>
        <v-btn @click="restart">
          <span class="mr-2">Restart</span>
        </v-btn>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "@/components/Board.vue";
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
</style>
