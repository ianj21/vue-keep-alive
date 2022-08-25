// 处理vue文件插件
import vue from 'rollup-plugin-vue'
// 用于在节点单元模块中使用第三方模块
import { nodeResolve } from '@rollup/plugin-node-resolve'
// 将 CommonJS 转换成 ES2015 模块的
import commonjs from "rollup-plugin-commonjs"
// 处理css文件插件
import postcss from 'rollup-plugin-postcss'
// css压缩
import cssnano from 'cssnano'
// 打包文件名称
import { name } from './package.json'

// 输出打包后的文件名称type 1.esm 2.umd
const file = type => `${name}-${type}.js`
// 输出打包后的目录
export { name, file }

export default {
  input: 'src/index.js',
  output: [
    {
      name,
      // file: file('es'),
      dir: 'dist/es',
      format: 'es'
    },
    {
      name,
      // file: file('esm'),
      dir: 'dist/esm',
      format: 'esm'
    },
    {
      name,
      // file: file('umd'),
      dir: 'dist/amd',
      format: 'amd',
      // 设定全局变量的名称
      globals: {
        'vue': 'Vue',
      },
      exports: 'named'
    }
  ],
  plugins: [
    vue(),
    nodeResolve(),
    commonjs(),
    // 可自行修改output文件名
    postcss({ output: 'bundle.css' }),
    cssnano(),
  ],
  // 指出应将哪些模块视为外部模块
  external: [
    'vue',
  ]
}
