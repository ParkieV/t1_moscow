import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {VitePWA} from 'vite-plugin-pwa'
import Pages from "vite-plugin-pages";

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost',
      '/api_ml': 'http://localhost',
    }
  },
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ritm icon loader',
        short_name: 'Icon loader',
        description: 'Ritm icon loader',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '144x144',
            type: 'image/png',
          },
        ],
      },
    }),
    Pages({
      dirs: 'src/pages',
      importMode() {
        return 'sync'
      },
    }),
  ],
})
