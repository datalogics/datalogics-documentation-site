// Client-side plugin to handle OAuth validation
// This ensures email validation happens immediately after OAuth callback
export default defineNuxtPlugin({
  name: 'studio-oauth-validation',
  setup() {
    // This runs client-side only
    if (import.meta.server) return

    // The middleware handles all validation server-side
    // This plugin is just a placeholder for any client-side checks if needed
    // The middleware in studio-auth.global.ts does the real work
  }
})
