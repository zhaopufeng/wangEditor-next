import path from 'path';
import { terser } from 'rollup-plugin-terser';
import createRollupConfig from '../../config/create-rollup-config';

const distDir = path.resolve(__dirname, './dist');

export default [
  createRollupConfig(distDir, { format: 'umd', plugins: [terser()] }),
  createRollupConfig(distDir, { name: 'index.module', format: 'es', suffix: 'mjs' }),
];
