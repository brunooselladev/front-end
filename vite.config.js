import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
  target: 'https://mappa.marbrus.com.ar',
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      console.log('Forwarding to:', proxyReq.host + proxyReq.path);
    });
  },
},
    },
  },
})