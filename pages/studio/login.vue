<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold">Datalogics Studio</h1>
        <p class="text-muted-foreground">Sign in with GitHub to edit documentation</p>
      </div>

      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Login</UiCardTitle>
          <UiCardDescription>
            Authenticate with your GitHub account to access Studio
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
            {{ error }}
          </div>
          <UiButton 
            @click="handleLogin" 
            :disabled="loading" 
            class="w-full"
            size="lg"
          >
            <Icon name="mdi:github" class="mr-2 h-5 w-5" />
            <span v-if="loading">Connecting...</span>
            <span v-else>Login with GitHub</span>
          </UiButton>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth0-protect' // Require Auth0 authentication
})

// Prevent indexing by search engines
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const loading = ref(false)
const error = ref('')
const route = useRoute()

// Get Auth0 user info (optional - for displaying user info)
const { user, isAuthenticated } = useAuth0()

// Check for error in URL query params
onMounted(() => {
  const errorParam = route.query.error
  if (errorParam === 'unauthorized') {
    error.value = 'Access denied: Your email is not authorized to use Studio. Please contact an administrator.'
  }
})

function handleLogin() {
  loading.value = true
  error.value = ''
  
  // Clear any existing error params
  const url = new URL(window.location.href)
  url.searchParams.delete('error')
  window.history.replaceState({}, '', url.toString())
  
  // Redirect to Nuxt Studio's GitHub OAuth endpoint
  // This will handle the OAuth flow automatically:
  // 1. Redirects to GitHub for authorization
  // 2. GitHub redirects back to /__nuxt_studio/auth/github
  // 3. Studio handles the OAuth callback and sets session
  // 4. Middleware validates email against STUDIO_GITHUB_MODERATORS
  // 5. If authorized, user is redirected to /_studio
  // 6. If not authorized, session is cleared and user redirected back here with error
  window.location.href = '/__nuxt_studio/auth/github'
}
</script>
