<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-2xl space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold">Studio Login Token</h1>
        <p class="text-muted-foreground">Current valid token for accessing Studio login</p>
      </div>

      <UiCard v-if="tokenData">
        <UiCardHeader>
          <UiCardTitle>Current Token</UiCardTitle>
          <UiCardDescription>
            This token is valid for the next {{ tokenData.minutesUntilExpiry }} minutes
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div class="space-y-2">
            <UiLabel>Token</UiLabel>
            <div class="flex items-center gap-2">
              <code class="flex-1 px-4 py-3 bg-muted rounded-md text-lg font-mono text-center">
                {{ tokenData.token }}
              </code>
              <UiButton @click="copyToken" variant="outline" size="sm">
                <Icon name="mdi:content-copy" class="mr-2 h-4 w-4" />
                Copy
              </UiButton>
            </div>
          </div>

          <div class="space-y-2">
            <UiLabel>Login URL</UiLabel>
            <div class="flex items-center gap-2">
              <code class="flex-1 px-4 py-3 bg-muted rounded-md text-sm font-mono break-all">
                {{ fullLoginUrl }}
              </code>
              <UiButton @click="copyUrl" variant="outline" size="sm">
                <Icon name="mdi:content-copy" class="mr-2 h-4 w-4" />
                Copy
              </UiButton>
            </div>
          </div>

          <div class="rounded-md bg-muted p-4 space-y-2">
            <p class="text-sm font-medium">Token Information</p>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li>• Expires at: {{ new Date(tokenData.expiresAt).toLocaleString() }}</li>
              <li>• Next token: {{ tokenData.nextToken }}</li>
              <li>• Token rotates every hour</li>
            </ul>
          </div>

          <UiButton @click="refreshToken" class="w-full" :disabled="loading">
            <Icon name="mdi:refresh" class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
            Refresh Token
          </UiButton>
        </UiCardContent>
      </UiCard>

      <div v-else-if="loading" class="text-center">
        <p class="text-muted-foreground">Loading token...</p>
      </div>

      <div v-else-if="error" class="rounded-md bg-destructive/10 p-4">
        <p class="text-sm text-destructive">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth0-protect' // Require Auth0 authentication
})

// Prevent indexing
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const tokenData = ref<any>(null)
const loading = ref(false)
const error = ref('')
const route = useRoute()

// Get Auth0 user info
const { user, isAuthenticated } = useAuth0()

const fullLoginUrl = computed(() => {
  if (!tokenData.value) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}${tokenData.value.loginUrl}`
})

async function fetchToken() {
  loading.value = true
  error.value = ''
  
  try {
    const data = await $fetch('/api/studio/get-token', {
      credentials: 'include',
      timeout: 5000
    })
    tokenData.value = data
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Failed to fetch token'
  } finally {
    loading.value = false
  }
}

async function copyToken() {
  if (tokenData.value?.token) {
    await navigator.clipboard.writeText(tokenData.value.token)
    // You could add a toast notification here
  }
}

async function copyUrl() {
  if (fullLoginUrl.value) {
    await navigator.clipboard.writeText(fullLoginUrl.value)
    // You could add a toast notification here
  }
}

async function refreshToken() {
  await fetchToken()
}

// Auto-refresh token every 5 minutes
onMounted(() => {
  fetchToken()
  
  const interval = setInterval(() => {
    fetchToken()
  }, 5 * 60 * 1000) // 5 minutes

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
