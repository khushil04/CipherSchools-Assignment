import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // ✅ ensures assets load correctly after deployment
  build: {
    outDir: 'dist', // ✅ matches your Vercel "Output Directory"
  },
  server: {
    port: 5173, // (optional) dev server port
  },
})
