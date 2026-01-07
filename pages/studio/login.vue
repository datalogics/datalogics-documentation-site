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
  // NO Auth0 middleware - just direct GitHub OAuth
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
  
  // Direct redirect to Nuxt Studio's GitHub OAuth endpoint
  // Simple: One click → GitHub login → Studio access
  window.location.href = '/__nuxt_studio/auth/github'
}
</script>
