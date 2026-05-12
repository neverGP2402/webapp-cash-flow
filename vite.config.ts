import path from 'path'
import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/', // 🔥 Absolute path for server

  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: false, // Disable ESLint for now
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],

  build: {
    outDir: 'build',           // 🔥 build vào build folder
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
