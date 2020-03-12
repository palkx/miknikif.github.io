<template>
  <div class="game2048">
    <h1>A simple 2048.</h1>
    <board ref="board" @game-over="gameOver" />
    <div v-if="!gaming">
      <h2>Game Over!</h2>
      <v-btn @click="restart">
        <span class="mr-2">Restart</span>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "@/components/Board.vue";

@Component({
  components: {
    Board
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
}
</script>
