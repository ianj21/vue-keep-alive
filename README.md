# vue-keep-alive

#### Instructions
vue缓存组件，解决vue官方组件keep-alive缓存多级嵌套路由无效的问题



## Installing

```
npm i @vue-helper/vue-keep-alive
```



## Example

全局注册

```vue
import VueKeepAlive from '@vue-helper/vue-keep-alive';

Vue.use(VueKeepAlive);
```

局部注册

```
import { VueKeepAlive } from '@vue-helper/vue-keep-alive';

export default {
	components: { 
		VueKeepAlive
    },
}
```

```
<template>
	<div class="app-container">
		<vue-keep-alive :include="keepAliveNames" :max="10">
          <router-view :key="key" />
        </vue-keep-alive>
	</div>
</template>


<script>
export default {
  computed: {
    keepAliveNames() {
      return [];
    },
    key() {
      return this.$route.path
    },
  },

}
</script>
```



## API

### Attributes

| 参数      | 说明                                               | 类型                      | 默认值 |
| --------- | -------------------------------------------------- | ------------------------- | ------ |
| `include` | 字符串或正则表达式。只有名称匹配的组件会被缓存     | `[String, RegExp, Array]` | -      |
| `exclude` | 字符串或正则表达式。任何名称匹配的组件都不会被缓存 | `[String, RegExp, Array]` | -      |
| `max`     | 数字。最多可以缓存多少组件实例                     | `[String, Number]`        | -      |

