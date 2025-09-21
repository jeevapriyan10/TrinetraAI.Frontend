import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy removed to use absolute API URLs in frontend fetch calls instead
    // proxy: {}
  }
})
