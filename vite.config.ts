import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import tsConfigPaths from 'vite-tsconfig-paths';
import url from '@rollup/plugin-url';

export default {
  plugins: [
    svgr({
      svgrOptions: {
        icon: true
      },
      include: '**/*.svg'
    }),
    url({
      include: '**/*.svg',
      limit: 8192,
      emitFiles: true,
      fileName: 'assets/[name]-[hash][extname]'
    }),
    react({
      babel: {
        plugins: [jotaiDebugLabel, jotaiReactRefresh]
      }
    }),
    tsConfigPaths(),
    wasm(),
    topLevelAwait()
  ],
  worker: {
    format: 'es',
    plugins: () => [wasm(), topLevelAwait()]
  },
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js')
  }
};
