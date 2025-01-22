import DefaultTheme from "vitepress/theme";
import "./style/index.css";
import HomeUnderline from "./components/HomeUnderline.vue";
import "virtual:group-icons.css"; //代码组样式
import update from "./components/update.vue";
import mediumZoom from "medium-zoom";
import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import MyLayout from "./components/MyLayout.vue";
import xgplayer from "./components/xgplayer.vue";
import { h } from "vue";
import { useData } from "vitepress";
import MNavLinks from "./components/MNavLinks.vue";

export default {
  extends: DefaultTheme,
  // ...DefaultTheme, //或者这样写也可
  Layout: () => {
    const props: Record<string, any> = {};
    // 获取 frontmatter
    const { frontmatter } = useData();

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(MyLayout, props);
  },
  enhanceApp({ app }) {
    // 注册全局组件
    app.component("HomeUnderline", HomeUnderline);
    app.component("update", update);
    app.component("xgplayer", xgplayer);
    app.component("MNavLinks", MNavLinks);
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      // mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
      mediumZoom(".main img", { margin: 100, background: "" });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
};
