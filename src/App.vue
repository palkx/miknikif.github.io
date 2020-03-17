<template>
  <v-app>
    <v-app-bar app color="primary" dark> </v-app-bar>

    <v-content>
      <div id="nav">
        <router-link to="/">2048</router-link> |
        <router-link to="/todo">Todo</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  })
});
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--v-black-base);
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: var(--v-black-base);
    &.router-link-exact-active {
      color: var(--v-primary-base);
    }
  }
}

.no_highlighting {
  user-select: none;
}
</style>
