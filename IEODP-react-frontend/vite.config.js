import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Ensure environment variables are available at runtime
    // This is especially important for dynamic API base URL configuration
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || '/api'),
  },
})
