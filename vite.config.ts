import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/backend': {
        target: 'https://nestmate-backend-9f3d331450ee.herokuapp.com/', // Target server
        changeOrigin: true, // Change the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/backend/, ''), // Rewrite /api to remove it when forwarding to backend
      },
    },
  },
})
