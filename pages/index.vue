<template>
  <div
    class="w-full px-4 pt-6 pb-8 md:px-8 md:pt-8 md:pb-12"
    :class="[config.main.padded && 'container mx-auto']"
  >
    <div class="max-w-4xl mx-auto">
      <ContentRenderer :key="page?.id" :value="page" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useConfig();

// Nuxt Content v3: use queryCollection instead of useContent()
const { data: page } = await useAsyncData("index", () => {
  return queryCollection("content").path("/").first();
});

useSeoMeta({
  title: `${page.value?.title ?? "404"}`,
  ogTitle: page.value?.title,
  description: page.value?.description,
});
</script>
