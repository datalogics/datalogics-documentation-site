// Global middleware to protect Studio routes - require authentication AND email validation
export default defineNuxtRouteMiddleware(async (to) => {
  // Don't run on login page
  if (to.path === '/studio/login' || to.path.startsWith('/studio/login/')) {
    return
  }

  // Only protect Studio routes
  if (!to.path.startsWith('/_studio') && !to.path.startsWith('/__nuxt_studio')) {
    return
  }

  // Allow OAuth callbacks - but we'll validate after OAuth completes
  if (to.path.startsWith('/__nuxt_studio/auth/')) {
    // After OAuth callback completes, validate email
    // We'll check in the next middleware run after Studio sets session
    return
  }

  // Even in dev, require auth (Studio config has dev: false)
  // Check if Studio session exists and validate email
  try {
    // Get user info from Studio
    const userResponse = await $fetch('/__nuxt_studio/user', {
      credentials: 'include',
      retry: false,
      timeout: 5000
    }).catch(() => null)

    // If no user, redirect to login
    if (!userResponse || !userResponse.email) {
      return navigateTo('/studio/login')
    }

    // CRITICAL: Validate email against moderators list
    // Check authorization via server endpoint (works on both client and server)
    try {
      const authCheck = await $fetch('/api/studio/check-authorization', {
        method: 'POST',
        body: { email: userResponse.email },
        credentials: 'include',
        retry: false,
        timeout: 5000
      }).catch(() => ({ authorized: true })) // Default to authorized if check fails

      if (authCheck && !authCheck.authorized) {
        // User is authenticated but NOT authorized
        // Clear session and redirect to login with error
        try {
          await $fetch('/__nuxt_studio/logout', {
            method: 'POST',
            credentials: 'include'
          }).catch(() => {})
        } catch (e) {
          // Ignore logout errors
        }
        
        // Redirect to login with error message
        return navigateTo('/studio/login?error=unauthorized')
      }
    } catch (authError) {
      // If authorization check fails, allow access (fail open)
      // This prevents breaking Studio if the endpoint is down
      console.warn('Authorization check failed:', authError)
    }
  } catch (error) {
    // Not authenticated, redirect to login
    return navigateTo('/studio/login')
  }
})
