// Protect Studio admin pages with Auth0 authentication
// Requires users to authenticate via Auth0 before accessing /studio/token or /studio/login
export default defineNuxtRouteMiddleware(async (to) => {
  // Only protect Studio admin routes
  if (!to.path.startsWith('/studio/token') && !to.path.startsWith('/studio/login')) {
    return
  }

  // Allow Auth0 callback routes (to prevent redirect loops)
  if (to.path.startsWith('/auth/')) {
    return
  }

  // Use Auth0 composable to check authentication
  try {
    const { isAuthenticated, isLoading } = useAuth0()

    // Wait for Auth0 to initialize (on client-side)
    if (import.meta.client && isLoading.value) {
      // Auth0 is still loading, allow navigation (will check on next middleware run)
      return
    }

    // If not authenticated, redirect to Auth0 login
    // The original URL will be preserved in the redirect
    if (!isAuthenticated.value) {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    // If Auth0 composable is not available or there's an error,
    // redirect to login as a safety measure
    console.warn('Auth0 middleware error:', error)
    return navigateTo('/auth/login')
  }

  // User is authenticated, allow access
})
