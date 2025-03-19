import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";

dotenv.config({
  path: [
    ".env.development",
    ".env.development.local",
    ".env.production",
    ".env.production.local",
    ".env.local",
    ".env"
  ]
})


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true,
        rewrite: (path) => {
          const rewritePath = path.replace(/^\/api/, '')
          console.log(`已重定向到 ${rewritePath}`)
          return rewritePath
        }
      }
    }
  },
  plugins: [
    react(),
  ],
  define: {
    __API_URL__: JSON.stringify(process.env.API_URL)
  },
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
