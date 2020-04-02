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

  mounted() {
    const theme = localStorage.themeDark;
    if (theme === "true") {
      this.$vuetify.theme.dark = true;
    }
  },
  data: () => ({
    activeTab: "/",
    tabs: [
      { name: "2048", route: "/" },
      { name: "Todo", route: "/todo" },
      { name: "Posts", route: "/posts" },
      { name: "Snake", route: "/snake" }
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
  background-color: var(--v-white-base);
}

.no_highlighting {
  user-select: none;
}

.full {
  width: 100%;
  height: 100%;
}

.top-left {
  position: absolute;
  top: 0;
  left: 16px;
}
</style>
