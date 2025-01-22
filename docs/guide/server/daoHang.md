---
layout: doc
layoutClass: m-nav-layout
sidebar: false
prev: false
next: false
outline: [2, 3, 4]
---

<style src="/.vitepress/theme/style/dao-hang.css"></style>
<script setup>
import { NAV_DATA } from '/.vitepress/theme/utils/data'
</script>

# 我的导航

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>
