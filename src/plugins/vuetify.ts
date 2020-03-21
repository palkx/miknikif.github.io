import Vue from "vue";
import Vuetify, { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1eba74",
        accent: "#ffab91",
        black: "#333333",
        white: "#f7f7f7"
      },
      dark: {
        primary: "#008948",
        accent: "#c97b63",
        black: "#f7f7f7",
        white: "#333333"
      }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    iconfont: "mdi"
  }
});
