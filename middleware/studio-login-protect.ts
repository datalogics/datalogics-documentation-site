// Protect the login page with a time-based rotating token
// Users must access /studio/login?token=CURRENT_TOKEN to see the login page
// Token rotates every hour based on STUDIO_LOGIN_SECRET
export default defineNuxtRouteMiddleware(async (to) => {
  // Only protect the login page
  if (!to.path.startsWith('/studio/login')) {
    return
  }

  // Get the base secret from environment (server-side only)
  const baseSecret = import.meta.server 
    ? (process.env.STUDIO_LOGIN_SECRET || process.env.STUDIO_LOGIN_TOKEN || '')
    : ''

  // If no secret is configured, allow access (backwards compatible)
  if (!baseSecret) {
    // In production, you should set STUDIO_LOGIN_SECRET
    if (import.meta.server && process.env.NODE_ENV === 'production') {
      console.warn('STUDIO_LOGIN_SECRET is not set - login page is publicly accessible')
    }
    return
  }

  // Get token from query parameter
  const providedToken = to.query.token as string | undefined

  if (!providedToken) {
    // No token provided, return 404
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found'
    })
  }

  // Validate token server-side (time-based token)
  if (import.meta.server) {
    const { createHash } = await import('node:crypto')
    
    // Check current time window (hourly rotation)
    const timeWindow = Math.floor(Date.now() / (1000 * 60 * 60))
    
    // Check current token
    const currentTokenData = `${baseSecret}-${timeWindow}`
    const currentToken = createHash('sha256')
      .update(currentTokenData)
      .digest('hex')
      .substring(0, 16)
    
    // Also check previous time window (in case token just rotated)
    const prevTimeWindow = timeWindow - 1
    const prevTokenData = `${baseSecret}-${prevTimeWindow}`
    const prevToken = createHash('sha256')
      .update(prevTokenData)
      .digest('hex')
      .substring(0, 16)
    
    // Validate token matches current or previous window
    if (providedToken !== currentToken && providedToken !== prevToken) {
      // Token is invalid, return 404
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found'
      })
    }
  } else {
    // Client-side: validate via API
    try {
      const isValid = await $fetch('/api/studio/validate-token', {
        method: 'POST',
        body: { token: providedToken },
        credentials: 'include',
        retry: false
      }).catch(() => ({ valid: false }))
      
      if (!isValid || !isValid.valid) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Page Not Found'
        })
      }
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found'
      })
    }
  }

  // Token is valid, allow access
})
