
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
     VitePWA({ 
      registerType: 'autoUpdate', 
      devOptions: { 
        enabled: true, 
        type: 'module', 
      }, 
      includeAssets: ['favicon.jpeg', 'images/icon-192.png', 
'images/icon-512.png'], 
      manifest: { 
        name: 'LaporPak', 
        short_name: 'LaporPak', 
        start_url: '.', 
        display: 'standalone', 
        background_color: '#ffffff', 
        theme_color: '#ffffff', 
        icons: [ 
          { 
            src: 'images/logo.png"', 
            sizes: '192x192', 
            type: 'image/png' 
          }, 
          { 
            src: 'images/logo.png"', 
            sizes: '512x512', 
            type: 'image/png' 
            } 
          ] 
        } 
      }) 
  ],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})