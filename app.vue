<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/80" />
  <ConfigProvider :use-id="useIdFunction">
    <LayoutAnnouncementBanner />
    <LayoutHeader />

    <div v-if="$route.path !== '/'" class="min-h-screen border-b">
      <div
        class="flex-1 items-start px-4 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 md:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
        :class="[config.main.padded && 'container']"
      >
        <aside
          class="fixed top-[102px] z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:top-[60px] md:block"
        >
          <LayoutAside :is-mobile="false" />
        </aside>
        <NuxtPage />
      </div>
    </div>
    <NuxtPage v-else />

    <Toaster />
    <LayoutFooter />

    <!-- Scout AI Assistant Button -->
    <ScoutButton />
  </ConfigProvider>
</template>

<script setup lang="ts">
const config = useConfig();
const { themeClass, radius } = useThemes();

const useIdFunction = () => useId();

useSeoMeta({
  description: config.value.site.description,
  ogDescription: config.value.site.description,
  ogImage: config.value.site.ogImage,
  twitterCard: "summary_large_image",
});

useServerHead({
  htmlAttrs: {
    class: themeClass.value,
    style: `--radius: ${radius.value}rem;`,
  },
});
</script>
