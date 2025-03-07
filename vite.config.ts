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
  plugins: [
    react(),
  ],
  define: {
    __API_URL__: JSON.stringify(process.env.API_URL)
  }
})
