const JAVA_USERNAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/

export async function lookupJavaProfile(username) {
  if (!JAVA_USERNAME_PATTERN.test(username)) {
    return { exists: false }
  }

  const response = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`,
  )

  if (response.status === 204 || response.status === 404) {
    return { exists: false }
  }

  if (!response.ok) {
    throw new Error(`Minecraft profile service returned HTTP ${response.status}`)
  }

  const profile = await response.json()
  if (typeof profile.name !== 'string' || typeof profile.id !== 'string') {
    throw new Error('Minecraft profile service returned an invalid response')
  }

  return { exists: true, username: profile.name }
}
