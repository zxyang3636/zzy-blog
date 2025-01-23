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
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import { NProgress } from "nprogress-v2/dist/index.js"; // 进度条组件
import "nprogress-v2/dist/index.css"; // 进度条样式
import { inBrowser } from "vitepress";
import confetti from "./components/confetti.vue";

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
  enhanceApp({ app, router }) {
    // 注册全局组件
    app.component("HomeUnderline", HomeUnderline);
    app.component("update", update);
    app.component("xgplayer", xgplayer);
    app.component("MNavLinks", MNavLinks);
    app.component("confetti", confetti);

    if (inBrowser) {
      NProgress.configure({ showSpinner: false });
      router.onBeforeRouteChange = () => {
        NProgress.start(); // 开始进度条
      };
      router.onAfterRouteChanged = () => {
        // busuanzi.fetch();
        NProgress.done(); // 停止进度条
      };
    }
  },
  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData();
    const route = useRoute();

    // giscus配置
    giscusTalk(
      {
        repo: "zxyang3636/zzy-blog", //仓库
        repoId: "R_kgDONtLu7Q", //仓库ID
        category: "Announcements", // 讨论分类
        categoryId: "DIC_kwDONtLu7c4CmQpx", //讨论分类ID
        mapping: "pathname",
        inputPosition: "bottom",
        lang: "zh-CN",
      },
      {
        frontmatter,
        route,
      },
      //默认值为true，表示已启用，此参数可以忽略；
      //如果为false，则表示未启用
      //您可以使用“comment:true”序言在页面上单独启用它
      true
    );
    // const route = useRoute();
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
