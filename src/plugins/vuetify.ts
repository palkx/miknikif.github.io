import Vue from "vue";
import Vuetify, { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1eba74",
        accent: colors.orange.lighten2,
        black: "#000000",
        white: "#ffffff",
      }
    },
    options: {
      customProperties: true,
    }
  }
});
