/* configs/nav.ts */
import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.Config["nav"] = [
  { text: "首页", link: "/" },
  {
    text: "后端",
    items: [
      { text: "Java", link: "/xxxxxxxxxxxxx" },
      {
        // 分组标题1
        text: "其他",
        items: [{ text: "Websocket", link: "/guide/server/websocket" }],
      },
    ],
  },
  {
    text: "前端",
    items: [
      {
        // 分组标题1
        text: "UI框架",
        items: [{ text: "前言", link: "/preface" }],
      },
      {
        // 分组标题2
        text: "小程序",
        items: [
          { text: "快速上手", link: "/getting-started" },
          { text: "配置", link: "/configuration" },
          { text: "页面", link: "/page" },
          { text: "Frontmatter", link: "/frontmatter" },
        ],
      },
    ],
  },
  { text: "面试", link: "/guide/server/mianshi" },
  {
    text: "其他",
    items: [
      { text: "软件分享", link: "/preface" },
      { text: "网址导航", link: "/configuration" },
      { text: "常用工具", link: "/configuration" },
      { text: "VitePress部署", link: "/configuration" },
    ],
  },
];
