import VueKeepAlive from './components/vue-keep-alive/index.js'

const install = (Vue) => {
  Vue.component(VueKeepAlive.name, VueKeepAlive)
}

// 导出单个
export {
  VueKeepAlive
}

export default { install }
