import fs from 'fs'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function publishCmsImages() {
  return {
    name: 'publish-cms-images',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist')
      fs.cpSync(path.resolve('src/assets/images'), path.join(dist, 'src/assets/images'), { recursive: true })
      const uploads = path.resolve('backend/uploads')
      if (fs.existsSync(uploads)) {
        fs.cpSync(uploads, path.join(dist, 'uploads'), { recursive: true })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), publishCmsImages()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/.tmp-*/**', '**/.tmp-*'],
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three'
            }
            if (id.includes('gsap') || id.includes('lenis')) {
              return 'vendor-animation'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
          }
        },
      },
    },
  },
})
