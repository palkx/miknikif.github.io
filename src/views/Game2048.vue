<template>
  <div class="game2048">
    <h1>A simple 2048.</h1>
    <board />
  </div>
</template>

<script>
import Board from "@/components/Board.vue";

export default {
  name: "Game2048",
  components: {
    Board
  }
};
</script>
