import VueKeepAlive from './vue-keep-alive'

VueKeepAlive.install = (Vue) => {
  Vue.component(VueKeepAlive.name, VueKeepAlive)
}

export default VueKeepAlive
