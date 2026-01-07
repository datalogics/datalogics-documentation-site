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

// Get base URL for absolute OG image URL
const baseUrl = computed(() => {
  if (import.meta.server) {
    try {
      const requestURL = useRequestURL();
      return `${requestURL.protocol}//${requestURL.host}`;
    } catch {
      // Fallback to default production URL
      return 'https://dev.datalogics.com';
    }
  } else if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'https://dev.datalogics.com';
});

const ogImageUrl = computed(() => {
  if (!config.value?.site?.ogImage) return undefined;
  const imagePath = config.value.site.ogImage;
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseUrl.value}${imagePath}`;
});

// Set SEO meta tags - useSeoMeta handles most tags
useSeoMeta({
  title: config.value?.site?.name || 'Datalogics Documentation',
  ogTitle: config.value?.site?.name || 'Datalogics Documentation',
  description: config.value?.site?.description,
  ogDescription: config.value?.site?.description,
  ogImage: ogImageUrl.value || `${baseUrl.value}/logo.svg`,
  ogUrl: baseUrl.value,
  twitterCard: "summary_large_image",
  twitterTitle: config.value?.site?.name || 'Datalogics Documentation',
  twitterDescription: config.value?.site?.description,
  twitterImage: ogImageUrl.value || `${baseUrl.value}/logo.svg`,
});

// Use reactive head for additional OG image meta tags
const imageMeta = computed(() => {
  const image = ogImageUrl.value || `${baseUrl.value}/logo.svg`;
  return [
    {
      property: 'og:image',
      content: image,
    },
    {
      property: 'og:image:url',
      content: image,
    },
    {
      property: 'og:image:secure_url',
      content: image,
    },
    {
      property: 'og:image:type',
      content: image.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
    },
    {
      property: 'og:image:width',
      content: '1200',
    },
    {
      property: 'og:image:height',
      content: '630',
    },
  ];
});

useHead({
  meta: imageMeta,
});

useServerHead({
  htmlAttrs: {
    class: themeClass.value,
    style: `--radius: ${radius.value}rem;`,
  },
});
</script>
