// Global middleware to protect Studio routes - require authentication
export default defineNuxtRouteMiddleware(async (to) => {
  // Don't run on login page
  if (to.path === '/studio/login' || to.path.startsWith('/studio/login/')) {
    return
  }

  // Only protect Studio routes
  if (!to.path.startsWith('/_studio') && !to.path.startsWith('/__nuxt_studio')) {
    return
  }

  // Allow OAuth callbacks
  if (to.path.startsWith('/__nuxt_studio/auth/')) {
    return
  }

  // Even in dev, require auth (Studio config has dev: false)
  // Check if Studio session exists
  try {
    // Try to check if Studio session exists
    // Studio exposes user info at /__nuxt_studio/user
    const response = await $fetch('/__nuxt_studio/user', {
      credentials: 'include',
      retry: false,
      timeout: 5000
    }).catch(() => null)

    // If no user, redirect to login
    if (!response || !response.email) {
      return navigateTo('/studio/login')
    }
  } catch (error) {
    // Not authenticated, redirect to login
    return navigateTo('/studio/login')
  }
})
