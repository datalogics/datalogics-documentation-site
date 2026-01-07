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
  layout: false
})

// Prevent indexing by search engines
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const loading = ref(false)
const error = ref('')

function handleLogin() {
  loading.value = true
  error.value = ''
  
  // Redirect to Nuxt Studio's GitHub OAuth endpoint
  // This will handle the OAuth flow automatically:
  // 1. Redirects to GitHub for authorization
  // 2. GitHub redirects back to /__nuxt_studio/auth/github
  // 3. Studio handles the OAuth callback and sets session
  // 4. User is redirected to /_studio
  window.location.href = '/__nuxt_studio/auth/github'
}
</script>
