import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/backend': {
        target: 'https://nestmate-backend-production.up.railway.app', // Target server
        changeOrigin: true, // Change the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/backend/, ''), // Rewrite /api to remove it when forwarding to backend
      },
    },
  },
})
