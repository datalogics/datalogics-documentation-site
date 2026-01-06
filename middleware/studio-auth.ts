export default defineNuxtRouteMiddleware(async (to) => {
  // Only run this middleware for Studio routes
  if (!to.path.startsWith('/_studio') && !to.path.startsWith('/__nuxt_studio')) {
    return
  }

  // Skip middleware for login page
  if (to.path === '/studio/login') {
    return
  }

  // Check authentication - call our check endpoint
  try {
    const { authenticated } = await $fetch('/api/studio/check')
    if (!authenticated) {
      return navigateTo('/studio/login')
    }
  } catch (error) {
    // If check fails, redirect to login
    return navigateTo('/studio/login')
  }
})
