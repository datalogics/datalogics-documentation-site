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

      <div v-if="config.main.showTitle" class="mb-6 space-y-2">
        <ProseH1>
          {{ page?.title }}
        </ProseH1>
        <p class="text-lg text-secondary">
          {{ page?.description }}
        </p>
      </div>

      <Alert
        v-if="!page?.body || page?.body?.children?.length === 0"
        title="Empty Page"
        icon="lucide:circle-x"
      >
        Start writing in
        <ProseCodeInline>content/{{ page?.file }}</ProseCodeInline> to see this
        page taking shape.
      </Alert>

      <ContentRenderer
        v-else
        :key="page?.id"
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

// Nuxt Content v3: use queryCollection instead of useContent()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first();
});

// Note: .navigation.yml files are not directly queryable as content,
// their properties are merged into the navigation structure

// Check for navigation redirect if page is empty or doesn't exist
const { data: navigation } = await useAsyncData('navigation-redirect', () => {
  return queryCollectionNavigation('content');
});

// Helper function to normalize paths for comparison
function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

// Helper function to find navigation item by path
function findNavItemByPath(items: any[], path: string): any | null {
  if (!items || !Array.isArray(items)) return null;
  const normalizedPath = normalizePath(path);
  for (const item of items) {
    const itemPath = normalizePath(item.path || '');
    if (itemPath === normalizedPath) {
      return item;
    }
    if (item.children && Array.isArray(item.children)) {
      const found = findNavItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

// Check if page is empty
const isEmpty = !page.value || !page.value.body || page.value.body?.children?.length === 0;

if (isEmpty) {
  // Try to find redirect in navigation
  let finalRedirectPath = null;
  
  // First, try to find navigation item at current path
  const navItem = navigation.value ? findNavItemByPath(navigation.value, route.path) : null;
  if (navItem) {
    // Try different possible locations for redirect property
    finalRedirectPath = navItem.navigation?.redirect || navItem.redirect || null;
  }
  
  // If not found, check parent paths (for directory-level redirects)
  // This handles cases where .navigation.yml is at a directory level
  if (!finalRedirectPath && navigation.value) {
    const pathParts = route.path.split('/').filter(p => p);
    // Try checking parent directories (starting from current path, going up)
    for (let i = pathParts.length; i > 0; i--) {
      const parentPath = '/' + pathParts.slice(0, i).join('/');
      const parentNavItem = findNavItemByPath(navigation.value, parentPath);
      if (parentNavItem) {
        // Check all possible locations for redirect
        finalRedirectPath = parentNavItem.navigation?.redirect || parentNavItem.redirect || null;
        if (finalRedirectPath) break;
      }
    }
  }
  
  // Also try querying .navigation.yml file directly if it exists
  if (!finalRedirectPath) {
    try {
      // Try to find .navigation.yml file that might exist at this path
      const navYmlPath = route.path.replace(/\/$/, '') + '/.navigation.yml';
      const navYmlPage = await queryCollection('content').path(navYmlPath).first();
      if (navYmlPage) {
        finalRedirectPath = (navYmlPage as any)?.navigation?.redirect || null;
      }
    } catch (e) {
      // Ignore errors if .navigation.yml doesn't exist
    }
  }
  
  // Also check if the page itself has navigation.redirect
  if (!finalRedirectPath && page.value) {
    finalRedirectPath = (page.value as any)?.navigation?.redirect || null;
  }
  
  // Perform redirect if found
  if (finalRedirectPath) {
    await navigateTo(finalRedirectPath, { redirectCode: 301, external: false });
  }
}


useSeoMeta({
  title: `${page.value?.title ?? "404"} - ${config.value.site.name}`,
  ogTitle: page.value?.title,
  description: page.value?.description,
});
</script>
