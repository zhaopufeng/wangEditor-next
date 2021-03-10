import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default function createRollupConfig(distDir, options) {
  const { name = 'index', format, suffix = 'js', plugins = [] } = options

  return {
    input: path.resolve(__dirname, './src/index.ts'),
    output: {
      file: path.resolve(distDir, `${name}.${suffix}`),
      format,
      name,
      sourcemap: true,
    },
    plugins: [
      json({
        compact: true,
        indent: '  ',
        preferConst: true,
      }),
      typescript({
        clean: true,
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        useTsconfigDeclarationDir: true,
      }),
      resolve(),
      commonjs(),
      cleanup({
        comments: 'none',
        extensions: ['.ts'],
      }),
      ...plugins
    ],
  };
}