/* .vitepress/theme/index.ts */
import Mycomponent from "./components/Mycomponent.vue";
import DefaultTheme from "vitepress/theme";
import HomeUnderline from "./components/HomeUnderline.vue";
import "virtual:group-icons.css"; //代码组样式
import update from "./components/update.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component("Mycomponent", Mycomponent);
    app.component("HomeUnderline", HomeUnderline);
    app.component("update", update);
  },
};
