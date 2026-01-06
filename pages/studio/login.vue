<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold">Datalogics Studio</h1>
        <p class="text-muted-foreground">Sign in to edit documentation</p>
      </div>

      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Login</UiCardTitle>
          <UiCardDescription>
            Enter your credentials to access Studio
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <UiLabel for="email">Email</UiLabel>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="your@email.com"
                required
                autocomplete="email"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div class="space-y-2">
              <UiLabel for="password">Password</UiLabel>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {{ error }}
            </div>
            <UiButton type="submit" :disabled="loading" class="w-full">
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign in</span>
            </UiButton>
          </form>
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

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/studio/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      },
      credentials: 'include', // Ensure cookies are sent/received
      timeout: 10000, // 10 second timeout
    })

    if (response?.ok) {
      // Session is set, verify it before redirecting
      try {
        // Wait a moment for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Verify session was set
        const checkResponse = await $fetch('/api/studio/check', {
          credentials: 'include',
          timeout: 5000,
        })
        
        if (checkResponse?.authenticated) {
          // Session confirmed, redirect to root - Studio will detect the session and activate
          await navigateTo('/')
        } else {
          error.value = 'Session was not set correctly. Please try again.'
        }
      } catch (checkErr) {
        console.error('Session check error:', checkErr)
        // Still try to redirect - Studio might detect it
        await navigateTo('/')
      }
    } else {
      error.value = 'Login failed. Please check your credentials.'
    }
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.data?.message || err.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}

// Check if already authenticated on mount
onMounted(async () => {
  try {
    const { authenticated } = await $fetch('/api/studio/check')
    if (authenticated) {
      // Already logged in, redirect to Studio
      await navigateTo('/_studio')
    }
  } catch (err) {
    // Not authenticated, show login form
  }
})
</script>
