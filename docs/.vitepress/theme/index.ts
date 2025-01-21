/* .vitepress/theme/index.ts */
import Mycomponent from "./components/Mycomponent.vue";
import DefaultTheme from "vitepress/theme";
import HomeUnderline from "./components/HomeUnderline.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component("Mycomponent", Mycomponent);
    app.component("HomeUnderline", HomeUnderline);
  },
};
