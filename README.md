# vue-keep-alive

### Instructions

vue 缓存组件，解决 vue 内置组件 keep-alive 缓存多级嵌套路由无效的问题

### Installing

```
npm i @vue-helper/vue-keep-alive
```

### Example

全局注册

```js
import VueKeepAlive from "@vue-helper/vue-keep-alive";

Vue.use(VueKeepAlive);
```

局部注册

```vue
<template>
  <div class="app-container">
    <vue-keep-alive :include="keepAliveNames" :max="10" :isBack="isBack" :onRemove="onRemove">
      <router-view :key="$route.path" />
    </vue-keep-alive>
  </div>
</template>

<script>
import { VueKeepAlive } from "@vue-helper/vue-keep-alive";

export default {
  name: "AppMain",
  components: {
    VueKeepAlive,
  },
  computed: {
    keepAliveNames() {
      return [];
    },
  },
  methods: {
    isBack(to, from) {
      if (!to.path || !from.path) return false
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      return toDepth < fromDepth && from.path.startsWith(to.path)
    },
    onRemove(key, storage) {
      // if (true) {
      //   storage.removeItem(key)
      // }
    }
  }
};
</script>
```

路由配置示例

```js

  path: '/plugin',
  component: () => import("@/layout/index.vue"),
  alwaysShow: true,
  name: 'Plugin',
  meta: {
    title: '组件',
    icon: 'plugin',
  },
  children: [
    {
      path: '/menu1',
      component: () => import('@/views/plugin/menu1/index.vue'),
      redirect: "/list",
      name: 'Menu1',
      meta: {
        title: '二级菜单',
      },
      children: [
        {
          path: '/list',
          component: () => import('@/views/plugin/menu1/list/index.vue'),
          name: 'List',
          meta: {
            title: '三级菜单',
            keepAlive: true,
          }
        },
        {
          path: '/list/detail',
          component: () => import('@/views/plugin/menu1/detail/index.vue'),
          name: 'ListDetail',
          meta: {
            hidden: true,
            title: 'detail',
          }
        },
      ]
    },
  ]
```



layout/index.vue

```vue
<template>
  <div class="layout">
    <el-container>
      <el-aside width="220px">
        
      </el-aside>
      <el-container style="height: 100vh;">
        <el-header style="height: 50px;">
          
        </el-header>
        <el-main>
          <AppMain></AppMain>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppMain from './components/AppMain.vue'

export default {
  components: {
    AppMain
  }
}
</script>
```



views/plugin/menu1/list/index.vue

```vue
<template>
  <router-view />
</template>
```







## API

### Attributes

| 参数       | 说明                                                       | 类型                      | 默认值 |
| ---------- | ---------------------------------------------------------- | ------------------------- | ------ |
| `include`  | 字符串或正则表达式。只有名称匹配的组件会被缓存             | `[String, RegExp, Array]` | -      |
| `exclude`  | 字符串或正则表达式。任何名称匹配的组件都不会被缓存，非必传 | `[String, RegExp, Array]` | -      |
| `max`      | 数字。最多可以缓存多少组件实例，非必传                     | `[String, Number]`        | -      |
| `isBack`   | 是否返回，是将渲染缓存组件，非必传                         | `Function(to, from)`      |        |
| `onRemove` | 外部控制删除缓存，非必传                                   | `Function(key, storage)`  |        |

