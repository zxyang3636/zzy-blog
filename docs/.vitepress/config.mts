import { defineConfig } from "vitepress";
import { nav } from "./configs";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true, //首次配置不会立即生效，需git提交后爬取时间戳
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin); //代码组图标
    },
    lineNumbers: true, // 代码快行数显示
    image: {
      // 开启图片懒加载
      lazyLoading: true,
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin(), //代码组图标
    ],
  },
  // 站点地图
  sitemap: {
    hostname: "https://www.zzyang.top",
  },
  cleanUrls: true, //开启纯净链接
  lang: "zh-CN", //语言，可选 en-US
  title: "zzy-blog",
  description: "zzy的记录文档、coding",
  //fav图标
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  ignoreDeadLinks: false, //关闭忽略死链，不配置即可，非常不建议设置为true
  //多语言
  locales: {
    root: {
      label: "简体中文",
      lang: "Zh_CN",
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
    },
  },
  themeConfig: {
    outline: {
      level: [1, 6], // 显示2-4级标题
      // level: 'deep', // 显示2-6级标题
      label: "当前页大纲", // 文字显示
    },
    //上次更新时间
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short", // 可选值full、long、medium、short
        timeStyle: "medium", // 可选值full、long、medium、short
      },
    },
    logo: "./logo.png", // 左上角logo
    //本地搜索
    search: {
      provider: "local",
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                },
              },
            },
          },
        },
      },
    },
    nav,
    sidebar: [
      {
        //分组标题
        text: "后端",
        collapsed: false,
        items: [
          { text: "Java", link: "/guide/server/javaThreadPool" },
          { text: "SpringCloud", link: "/guide/server/springCloud" },
          { text: "xxl-job", link: "/guide/server/xxljob" },
          { text: "消息推送", link: "/guide/server/xiaoxi" },
          // { text: "快速上手", link: "/getting-started" },
          // { text: "配置", link: "/configuration" },
          // { text: "页面", link: "/page" },
          // { text: "Frontmatter", link: "/frontmatter" },
        ],
      },
      {
        //分组标题
        text: "前端",
        collapsed: false,
        items: [
          { text: "Vue", link: "/guide/client/vue3" },
          // { text: "MySql", link: "/guide/server/mysqlMianshi" },
        ],
      },
      {
        //分组标题
        text: "面试指北",
        collapsed: false,
        items: [
          { text: "Java", link: "/guide/server/mianshi" },
          { text: "MySql", link: "/guide/server/mysqlMianshi" },
        ],
      },
      {
        //分组标题
        text: "其他",
        items: [
          { text: "网址导航", link: "/guide/server/daoHang" },
          { text: "Markdown示例页", link: "/markdown-examples" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/zxyang3636/zzy-blog" },
      { icon: "gitee", link: "https://gitee.com/zz_yang/" },
      // {
      //   icon: {
      //     svg: '<svg t="1703483542872" class="icon" viewBox="0 0 1309 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6274" width="200" height="200"><path d="M1147.26896 912.681417l34.90165 111.318583-127.165111-66.823891a604.787313 604.787313 0 0 1-139.082747 22.263717c-220.607239 0-394.296969-144.615936-394.296969-322.758409s173.526026-322.889372 394.296969-322.889372C1124.219465 333.661082 1309.630388 478.669907 1309.630388 656.550454c0 100.284947-69.344929 189.143369-162.361428 256.130963zM788.070086 511.869037a49.11114 49.11114 0 0 0-46.360916 44.494692 48.783732 48.783732 0 0 0 46.360916 44.494693 52.090549 52.090549 0 0 0 57.983885-44.494693 52.385216 52.385216 0 0 0-57.983885-44.494692z m254.985036 0a48.881954 48.881954 0 0 0-46.09899 44.494692 48.620028 48.620028 0 0 0 46.09899 44.494693 52.385216 52.385216 0 0 0 57.983886-44.494693 52.58166 52.58166 0 0 0-57.951145-44.494692z m-550.568615 150.018161a318.567592 318.567592 0 0 0 14.307712 93.212943c-14.307712 1.080445-28.746387 1.768001-43.283284 1.768001a827.293516 827.293516 0 0 1-162.394168-22.296458l-162.001279 77.955749 46.328175-133.811485C69.410411 600.858422 0 500.507993 0 378.38496 0 166.683208 208.689602 0 463.510935 0c227.908428 0 427.594322 133.18941 467.701752 312.379588a427.463358 427.463358 0 0 0-44.625655-2.619261c-220.24709 0-394.100524 157.74498-394.100525 352.126871zM312.90344 189.143369a64.270111 64.270111 0 0 0-69.803299 55.659291 64.532037 64.532037 0 0 0 69.803299 55.659292 53.694846 53.694846 0 0 0 57.852923-55.659292 53.465661 53.465661 0 0 0-57.852923-55.659291z m324.428188 0a64.040926 64.040926 0 0 0-69.574114 55.659291 64.302852 64.302852 0 0 0 69.574114 55.659292 53.694846 53.694846 0 0 0 57.951145-55.659292 53.465661 53.465661 0 0 0-57.951145-55.659291z" p-id="6275"></path></svg>',
      //   },
      //   // link: "https://weixin.qq.com/",
      //   link: "./guide/server/personalInfo",
      //   // You can include a custom label for accessibility too (optional but recommended):
      //   ariaLabel: "wechat",
      // },
    ],
    //页脚
    footer: {
      message: "Released under the MIT License.",
      // message: `<a href="https://beian.miit.gov.cn/" target="_blank">黑ICP备2025035182号</a>`,
      copyright: `<a href="https://beian.miit.gov.cn/" target="_blank">黑ICP备2025035182号-1</a> Copyright © 2024-${new Date().getFullYear()} 备案号：<a href="https://beian.mps.gov.cn/#/query/webSearch?code=23012702000012" target="_blank">黑公网安备23012702000012号</a>`,
      // 自动更新时间
      //copyright: `Copyright © 2019-${new Date().getFullYear()} present Evan You`,
    },
  },
});
