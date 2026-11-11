import { lookupJavaProfile } from '../src/server/minecraft-profile.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const username = request.query?.username
  if (typeof username !== 'string' || !/^[A-Za-z0-9_]{3,16}$/.test(username)) {
    return response.status(400).json({ error: 'A valid Java username is required' })
  }

  try {
    const profile = await lookupJavaProfile(username)
    return response.status(200).json(profile)
  } catch (error) {
    console.error('Minecraft profile lookup failed:', error)
    return response.status(502).json({ error: 'Minecraft profile lookup is temporarily unavailable' })
  }
}
