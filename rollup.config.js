import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pluginVue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'
import  clear  from  'rollup-plugin-clear'

module.exports = {
  input: path.resolve(__dirname, './src/index.js'),
  output:[
    {
      file: path.resolve(__dirname, './dist/vue3-menus.js'),
      format:'umd',
      name:'Vue3Menus',
      globals: {
        vue:'Vue'
      }
    },
    {
      file: path.resolve(__dirname, './dist/vue3-menus.min.js'),
      format:'umd',
      name:'Vue3Menus',
      globals: {
        vue:'Vue'
      },
      plugins: [
        uglify(),
        terser()
      ]
    },
    {
      file: path.resolve(__dirname,'./dist/vue3-menus.es.js'),
      format:'es',
      globals: {
        vue:'Vue'
      }
    },
    {
      file: path.resolve(__dirname,'./dist/vue3-menus.es.min.js'),
      format:'es',
      globals: {
        vue:'Vue'
      },
      plugins: [
        uglify(),
        terser()
      ]
    }
  ],
  plugins:[
    resolve(),
    pluginVue(),
    commonjs(),
    postcss(),
    clear ({
      targets: ['./dist'],
      watch : true ,
    })
  ],
  external: [
    'vue'
  ]
}
