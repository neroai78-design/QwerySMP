import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { lookupJavaProfile } from './src/server/minecraft-profile.js'

const minecraftProfileApi = {
  name: 'minecraft-profile-api',
  configureServer(server) {
    server.middlewares.use('/api/minecraft-profile', async (request, response) => {
      if (request.method !== 'GET') {
        response.statusCode = 405
        response.setHeader('Allow', 'GET')
        response.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }

      const requestUrl = new URL(request.url, 'http://localhost')
      const username = requestUrl.searchParams.get('username')
      if (!username || !/^[A-Za-z0-9_]{3,16}$/.test(username)) {
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ error: 'A valid Java username is required' }))
        return
      }

      try {
        const profile = await lookupJavaProfile(username)
        response.setHeader('Content-Type', 'application/json')
        response.setHeader('Cache-Control', 'no-store')
        response.end(JSON.stringify(profile))
      } catch (error) {
        console.error('Minecraft profile lookup failed:', error)
        response.statusCode = 502
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ error: 'Minecraft profile lookup is temporarily unavailable' }))
      }
    })
  },
}

export default defineConfig({
  plugins: [react(), minecraftProfileApi],
})
