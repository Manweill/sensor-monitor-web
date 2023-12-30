import { mergeConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

const env = loadEnv('development', process.cwd(), '');

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig,
);
