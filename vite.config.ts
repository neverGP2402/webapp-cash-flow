import path from 'path'
import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/', // 🔥 CỰC KỲ QUAN TRỌNG

  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],

  build: {
    outDir: 'src/view',        // 🔥 build thẳng vào folder server serve
    emptyOutDir: true,
    assetsDir: 'assets',       // mặc định nhưng ghi rõ cho chắc
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },

  server: { port: 3039, host: true },
  preview: { port: 3039, host: true },
})
