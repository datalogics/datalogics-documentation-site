<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/80" />
  <ConfigProvider :use-id="useIdFunction">
    <!-- Skip all layout for /studio/login page -->
    <template v-if="isLoginPage">
      <NuxtPage />
      <Toaster />
    </template>
    <template v-else>
      <LayoutAnnouncementBanner />
      <LayoutHeader />

      <div v-if="$route.path !== '/'" class="min-h-screen border-b w-full">
        <div
          class="flex-1 items-start w-full px-4 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 md:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
          :class="[config?.main?.padded && 'container mx-auto']"
        >
          <aside
            class="fixed top-[102px] z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:top-[60px] md:block md:w-[220px] lg:w-[240px]"
          >
            <LayoutAside :is-mobile="false" />
          </aside>
          <main class="min-w-0 w-full">
            <NuxtPage />
          </main>
        </div>
      </div>
      <div v-else class="w-full max-w-full overflow-x-hidden">
        <NuxtPage />
      </div>

      <Toaster />
      <LayoutFooter />

      <!-- Scout AI Assistant Button -->
      <ScoutButton />
    </template>
  </ConfigProvider>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useConfig();
const { themeClass, radius } = useThemes();

const useIdFunction = () => useId();

// Check if we're on the login page to skip layout
// Must match exactly to prevent layout from showing
const isLoginPage = computed(() => {
  const path = route.path
  return path === '/studio/login' || path.startsWith('/studio/login/')
});

useSeoMeta({
  description: config.value?.site?.description,
  ogDescription: config.value?.site?.description,
  ogImage: config.value?.site?.ogImage,
  twitterCard: "summary_large_image",
});

useServerHead({
  htmlAttrs: {
    class: themeClass.value,
    style: `--radius: ${radius.value}rem;`,
  },
});
</script>
