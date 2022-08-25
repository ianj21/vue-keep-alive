/* @flow */
import { getFirstComponentChild, isRegExp, remove, push, isRouterBack } from './helpers/index'

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

const cacheConfig = {
  cache: {},
  keys: [],
  vnodeToCache: null,
  keyToCache: '',
  _vnode: null,
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const entry = cache[key]
    if (entry) {
      const name = entry.name
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const pathState = {
  fromRoute: {},
  toRoute: {},
}

export default {
  name: 'vue-keep-alive',
  abstract: true,

  props: {
    include: [Array, String, RegExp],
    exclude: [Array, String, RegExp],
    max: [String, Number]
  },

  created () {
    pathState.fromRoute = { ...pathState.toRoute }
    pathState.toRoute = this.$route
  },

  destroyed () {
  },

  mounted () {
    cacheConfig._vnode = this._vnode
    this.cacheVNode()
    this.$watch('include', val => {
      pruneCache(cacheConfig, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(cacheConfig, name => !matches(val, name))
    })
  },

  updated () {
    this.cacheVNode()
  },

  methods: {
    cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = cacheConfig
      if (vnodeToCache) {
        const { tag, componentInstance, componentOptions } = vnodeToCache
        cache[keyToCache] = {
          name: getComponentName(componentOptions) || this.$route.name,
          tag,
          componentInstance,
        }
        // keys.push(keyToCache)
        push(keys, keyToCache)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
        cacheConfig.vnodeToCache = null
      }
    }
  },

  render () {
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    const componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name = getComponentName(componentOptions) || this.$route.name
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }


      const { cache, keys } = cacheConfig
      const key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      const isBack = isRouterBack(pathState.toRoute, pathState.fromRoute)
      const isCache = (include || exclude) ? isBack : true
      if (cache[key] && isCache) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        push(keys, key)
      } else {
        cache[key] = vnode
        push(keys, key)
        cacheConfig.vnodeToCache = vnode
        cacheConfig.keyToCache = key
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
