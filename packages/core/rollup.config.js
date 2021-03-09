import path from 'path';
import createRollupConfig from '../../config/crate-rollup-config';

const distDir = path.resolve(__dirname, './dist');

export default [
  createRollupConfig(distDir, { format: 'umd' }),
  createRollupConfig(distDir, { name: 'index.module', format: 'es', suffix: 'mjs' }),
];
