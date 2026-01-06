<template>
  <UiScrollArea
    v-if="!isSmall"
    orientation="vertical"
    class="z-30 hidden h-[calc(100vh-6.5rem)] overflow-y-auto md:block lg:block"
    type="hover"
  >
    <p class="mb-2 text-base font-semibold">
      {{ title }}
    </p>
    <LayoutTocTree
      v-if="toc.links && toc.links.length > 0"
      :links="toc.links.filter((x: any) => x.id !== 'hide-toc')"
      :level="0"
      :class="[links && links.length > 0 && 'border-b pb-5']"
    />
    <div v-if="links && links.length > 0" :class="[toc.links && toc.links.length > 0 && 'pt-5', (!toc.links || toc.links.length === 0) && 'pt-0']">
      <NuxtLink
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        :target="link.target"
        class="flex w-full gap-1 underline-offset-4 hover:underline [&:not(:first-child)]:pt-3 text-popover-foreground"
      >
        <Icon
          v-if="link.icon"
          :name="link.icon"
          class="mr-1 self-center"
          size="16"
        />
        {{ link.title }}
        <Icon
          name="lucide:arrow-up-right"
          class="ml-auto self-center text-muted-foreground"
          size="13"
        />
      </NuxtLink>
    </div>
  </UiScrollArea>
  <UiCollapsible
    v-else
    v-model:open="isOpen"
    class="block w-full text-sm lg:hidden"
    :class="{ 'border-b': border }"
  >
    <UiCollapsibleTrigger class="flex w-full px-4 py-3 text-left font-medium">
      {{ title }}
      <Icon
        name="lucide:chevron-right"
        class="ml-auto self-center transition-all"
        :class="[isOpen && 'rotate-90']"
      />
    </UiCollapsibleTrigger>
    <UiCollapsibleContent>
      <LayoutTocTree
        v-if="toc.links && toc.links.length > 0"
        :links="toc.links"
        :level="0"
        class="mx-4 mb-3 border-l pl-4 text-sm"
      />
    </UiCollapsibleContent>
    </UiCollapsible>
</template>

<script setup lang="ts">
defineProps<{ isSmall: boolean }>();

const route = useRoute();
const toc = ref<{ links: any[] }>({ links: [] });

// Try to get TOC from page data first
const { data: page } = await useAsyncData(`toc-${route.path}`, () => {
  return queryCollection('content').path(route.path).first();
});

// Extract TOC from rendered DOM on client side (similar to TocTree approach)
onMounted(() => {
  updateToc();
});

watch(() => route.path, () => {
  nextTick(() => {
    updateToc();
  });
});

function updateToc() {
  // Check if TOC exists on page data first
  if (page.value?.toc && page.value.toc.links && page.value.toc.links.length > 0) {
    toc.value = page.value.toc;
    return;
  }
  
  // Wait a bit for content to render, then extract headings from DOM
  setTimeout(() => {
    const contentElement = document.querySelector('.docs-content');
    if (!contentElement) {
      toc.value = { links: [] };
      return;
    }
    
    const headingElements = contentElement.querySelectorAll('h2[id], h3[id], h4[id]');
    const headings: any[] = [];
    
    headingElements.forEach((el) => {
      const id = el.id;
      if (!id) return;
      
      const depth = parseInt(el.tagName.charAt(1));
      const text = el.textContent?.trim() || '';
      
      headings.push({
        id,
        text,
        depth,
        children: [],
      });
    });
    
    // If no headings with IDs found, try without ID requirement and generate IDs
    if (headings.length === 0) {
      const allHeadings = contentElement.querySelectorAll('h2, h3, h4');
      allHeadings.forEach((el) => {
        const text = el.textContent?.trim() || '';
        if (!text) return;
        
        // Generate ID from text if not present
        let id = el.id;
        if (!id) {
          id = text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || `heading-${headings.length}`;
          // Set the ID on the element for future reference
          el.id = id;
        }
        
        const depth = parseInt(el.tagName.charAt(1));
        
        headings.push({
          id,
          text,
          depth,
          children: [],
        });
      });
    }
    
    // Build hierarchy
    const result: any[] = [];
    const stack: any[] = [];
    
    headings.forEach((heading) => {
      // Pop stack until we find a parent
      while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
        stack.pop();
      }
      
      if (stack.length === 0) {
        result.push(heading);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) parent.children = [];
        parent.children.push(heading);
      }
      
      stack.push(heading);
    });
    
    toc.value = { links: result };
  }, 100);
}

const { title, links } = useConfig().value.toc;
const { border } = useConfig().value.header;
const isOpen = ref(false);
</script>
