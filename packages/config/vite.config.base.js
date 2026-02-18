import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * @kodnest/config/vite
 * Base Vite configuration shared by all KodNestCareers apps.
 *
 * Usage in app vite.config.js:
 *   import { baseConfig } from '@kodnest/config/vite'
 *   import { mergeConfig } from 'vite'
 *   export default mergeConfig(baseConfig, { ...appOverrides })
 */
export const baseConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    target:      'esnext',
    minify:      'esbuild',
    sourcemap:   false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})
