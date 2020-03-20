<template>
  <v-app>
    <v-app-bar app color="primary" light hide-on-scroll>
      <v-tabs v-model="activeTab" color="white">
        <v-tab
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.route"
          class="white--text"
        >
          {{ tab.name }}
        </v-tab>
        <v-spacer></v-spacer>
        <v-tab :to="last.route" class="white--text">
          {{ last.name }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-content>
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
    activeTab: "/",
    tabs: [
      { name: "2048", route: "/" },
      { name: "Todo", route: "/todo" },
      { name: "Posts", route: "/posts" }
    ],
    last: { name: "About", route: "/about" }
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

.no_highlighting {
  user-select: none;
}

.full {
  width: 100%;
  height: 100%;
}
</style>
