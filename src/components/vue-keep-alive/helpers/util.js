const _toString = Object.prototype.toString

export function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function push (arr, item) {
  const index = arr.indexOf(item)
  if (index > -1) {
    arr.splice(index, 1)
    return arr.push(item)
  } else {
    return arr.push(item)
  }
}

export function isRouterBack (to, from) {
  if (!to.path || !from.path) return false
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  return toDepth < fromDepth && from.path.startsWith(to.path)
}
