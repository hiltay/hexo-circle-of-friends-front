import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),

    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver({ importStyle: "sass" })
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify:"terser",
    rollupOptions: {
      output: {
        format: "iife",
        entryFileNames:'fcircle.min.js',
        assetFileNames:'assets/[name][extname]',
        chunkFileNames:'[name].js'
      },
    },
    terserOptions: {
      compress: {
        // 打包自动删除console
        drop_console: true,
        drop_debugger: true,
      },
      keep_classnames: true,
      toplevel: true,
      ie8: true,
    },
  }
})
