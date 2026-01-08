<template>
  <main
    class="relative w-full py-6"
    :class="[
      config.toc.enable && 'lg:grid lg:grid-cols-[1fr_200px] lg:gap-10 lg:py-8',
    ]"
  >
    <div class="w-full min-w-0">
      <LayoutBreadcrumb
        v-if="page?.body && config.main.breadCrumb"
        class="mb-4"
      />

      <div v-if="config.main.showTitle && page?.title" class="mb-6 space-y-2">
        <ProseH1>
          {{ page.title }}
        </ProseH1>
        <p v-if="page?.description" class="text-lg text-secondary">
          {{ page.description }}
        </p>
      </div>

      <Alert
        v-if="!page?.body || page?.body?.children?.length === 0"
        title="Empty Page"
        icon="lucide:circle-x"
      >
        <template v-if="page?.file">
          Start writing in
          <ProseCodeInline>content/{{ page.file }}</ProseCodeInline> to see this
          page taking shape.
        </template>
        <template v-else>
          This page has no content. It may redirect to another page.
        </template>
      </Alert>

      <ContentRenderer
        v-else
        :key="page?.id || route.path"
        :value="page"
        class="docs-content"
      />
    </div>
    <div v-if="config.toc.enable" class="hidden w-[200px] text-sm lg:block">
      <div class="sticky top-[90px] h-[calc(100vh-3.5rem)]">
        <LayoutToc :is-small="false" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useConfig();

// Fetch page data
const { data: page } = await useAsyncData(
  `page-${route.path}`,
  () => queryCollection('content').path(route.path).first(),
  { watch: [() => route.path] }
);

// Handle SSR redirects for directory paths (no content file)
// Note: Netlify edge redirects handle most cases via ~/modules/navigation-redirects
// This is a fallback for development and edge cases
if (import.meta.server && !page.value) {
  // Fetch navigation to find redirect
  const navigation = await queryCollectionNavigation('content');
  
  if (navigation) {
    const redirectPath = findRedirectForPath(navigation, route.path);
    if (redirectPath) {
      await navigateTo(redirectPath, { redirectCode: 301, external: false });
    }
  }
}

// Helper to find redirect in navigation tree
function findRedirectForPath(navItems: any[], targetPath: string): string | null {
  const normalizedTarget = targetPath.replace(/\/+$/, '') || '/';
  
  for (const item of navItems) {
    const itemPath = (item.path || '').replace(/\/+$/, '') || '/';
    
    // Check if this item matches the target path
    if (itemPath === normalizedTarget) {
      // Check for redirect property
      const redirect = item.navigation?.redirect || item.redirect;
      if (redirect) {
        return redirect.startsWith('/') ? redirect : `${itemPath}/${redirect}`;
      }
      
      // If no redirect, try first child
      if (item.children?.length > 0 && item.children[0]?.path) {
        return item.children[0].path;
      }
    }
    
    // Recursively check children
    if (item.children?.length > 0) {
      const found = findRedirectForPath(item.children, targetPath);
      if (found) return found;
    }
  }
  
  return null;
}

// SEO Meta
useSeoMeta({
  title: page.value?.title 
    ? `${page.value.title} - ${config.value.site.name}`
    : config.value.site.name,
  ogTitle: page.value?.title || config.value.site.name,
  description: page.value?.description || config.value.site.description,
});
</script>
