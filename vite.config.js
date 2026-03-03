import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function tedxRewritePlugin() {
  return {
    name: 'tedx-rewrite-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // If the user navigates to /tedx or /tedx/, serve the tedx index.html specifically
        if (req.url === '/tedx' || req.url === '/tedx/') {
          const indexPath = path.resolve(process.cwd(), 'public/tedx/index.html')
          try {
            const html = fs.readFileSync(indexPath, 'utf-8')
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
            return
          } catch (e) {
            console.error('Could not find /public/tedx/index.html - make sure Nuxt is built!')
          }
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tedxRewritePlugin()],
})
