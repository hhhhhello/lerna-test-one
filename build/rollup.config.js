import path from 'node:path'

import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import strip from '@rollup/plugin-strip'
import terser from '@rollup/plugin-terser'
import { readFileSync } from 'fs'
import copy from 'rollup-plugin-copy'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'
import { fileURLToPath } from 'url'

const package_ = JSON.parse(readFileSync('./package.json'))
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const defaultExtensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.css',
  '.less',
]

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: path.dirname(package_.main),
      format: 'cjs',
      name: package_.name,
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    {
      dir: path.dirname(package_.module),
      format: 'esm',
      name: package_.name,
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: [
    nodeResolve({ extensions: defaultExtensions }),
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, '../src') }],
      customResolver: nodeResolve({
        extensions: defaultExtensions,
      }),
    }),
    commonjs(),
    image(),
    postcss({
      modules: {
        generateScopedName: 'cm-[path][local]',
      },
      autoModules: false,
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: defaultExtensions,
    }),
    copy({
      targets: [
        {
          src: path.resolve(__dirname, '../src/styles'),
          dest: path.resolve(__dirname, '../lib'),
        },
        {
          src: path.resolve(__dirname, '../src/styles'),
          dest: path.resolve(__dirname, '../es'),
        },
      ],
    }),
    externals(),
    strip(),
    terser(),
  ],
}
