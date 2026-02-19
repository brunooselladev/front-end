import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://mappa.marbrus.com.ar',
        changeOrigin: true,
      },
    },
  },
});