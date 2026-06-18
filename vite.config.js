import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/AuraAI-2/' : '/',
  plugins: [
    react(),
    basicSsl()
  ],
  server: {
    port: 3000,
    open: true,
    host: true,
    https: true
  }
})
