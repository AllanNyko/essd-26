import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icons/app-icon.svg', 'icons/app-icon-maskable.svg'],
      manifest: {
        name: 'ESSD',
        short_name: 'ESSD',
        description: 'Plataforma de estudos ESSD',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/app-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/icons/app-icon-maskable.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
