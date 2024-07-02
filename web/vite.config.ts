import react from '@vitejs/plugin-react'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'
import tsConfigPaths from 'vite-tsconfig-paths'

import { dependencies, devDependencies, name, version } from './package.json'

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: new Date().toString(),
}

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        icon: true,
      },
      include: '**/*.svg',
    }),
    react({
      babel: {
        plugins: [jotaiDebugLabel, jotaiReactRefresh],
      },
    }),
    tsConfigPaths(),
    wasm(),
    topLevelAwait(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/variables.scss";
        `,
      },
    },
  },
  worker: {
    format: 'es',
    plugins: () => [wasm(), topLevelAwait()],
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: './index.html',
    },
    emptyOutDir: true,
  },
  envDir: '..',
  resolve: {
    alias: {
      '@chui': path.resolve(__dirname, '../shared/chui/src/index'),
      '@chui-types': path.resolve(__dirname, '../shared/chui/src/types'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@mobile': path.resolve(__dirname, '../mobile/src'),
      '@web': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // Don't optimize these packages as they contain web workers and WASM files.
    // https://github.com/vitejs/vite/issues/11672#issuecomment-1415820673
    exclude: ['@journeyapps/wa-sqlite', '@powersync/web'],
    include: [
      '@powersync/web > event-iterator',
      '@powersync/web > js-logger',
      '@powersync/web > lodash/throttle',
      '@powersync/web > can-ndjson-stream',
      '@powersync/web > bson',
      '@powersync/web > buffer',
      '@powersync/web > rsocket-core',
      '@powersync/web > rsocket-websocket-client',
      '@powersync/web > cross-fetch',
      'js-logger',
      'can-ndjson-stream',
      'lodash/throttle',
      'event-iterator',
      'uuid',
      'lodash',
      'can-ndjson-stream',
    ],
  },
  define: {
    __APP_INFO__: JSON.stringify(__APP_INFO__),
  },
})
