import { eventHandler, getCookie } from 'h3'

export default eventHandler(async (event) => {
  // Check for Studio session cookie
  // Studio stores the session in a cookie after setStudioUserSession
  // Try common cookie names that Nuxt Studio might use
  const studioCookiePatterns = [
    'studio_session',
    'nuxt_studio_session',
    '__studio_session',
    'studio-session',
    'nuxt_studio',
    '__nuxt_studio_session',
  ]
  
  let authenticated = false
  for (const pattern of studioCookiePatterns) {
    const cookie = getCookie(event, pattern)
    if (cookie && cookie.trim().length > 0) {
      authenticated = true
      break
    }
  }
  
  return { 
    authenticated,
    user: authenticated ? { authenticated: true } : null 
  }
})
