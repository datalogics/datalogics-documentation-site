<template>
  <UiDialog v-model:open="open" @update:open="handleDialogUpdate">
    <UiDialogContent 
      class="p-0"
      @pointer-down-outside="(event) => {
        // Allow closing even when clicking on autocomplete results
        handleClose();
      }"
      @escape-key-down="handleClose"
    >
      <VisuallyHidden as-child>
        <UiDialogTitle />
      </VisuallyHidden>
      <VisuallyHidden as-child>
        <UiDialogDescription aria-describedby="undefined" />
      </VisuallyHidden>
      <UiCommand 
        v-model:search-term="input" 
        class="h-svh sm:h-[500px]"
      >
        <UiCommandInput
          :loading="searchLoading"
          :placeholder="placeholderDetailed"
          @keydown.enter="handleEnter"
          @keydown.down="handleNavigate(1)"
          @keydown.up="handleNavigate(-1)"
          @keydown.escape="handleClose"
        />
        <UiCommandList class="text-sm" @escape-key-down="handleClose">
          <template v-if="!input?.length">
            <template v-for="item in navigation" :key="item.path">
              <UiCommandGroup
                v-if="item.children"
                :heading="item.title"
                class="p-1.5"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.id"
                  :to="child.path"
                  @click="handleClose"
                >
                  <UiCommandItem :value="child.path">
                    <Icon
                      v-if="child.icon"
                      :name="child.icon"
                      class="mr-2 size-4"
                    />
                    <div v-else class="mr-2 size-4" />
                    <span>{{ child.title }}</span>
                  </UiCommandItem>
                </NuxtLink>
              </UiCommandGroup>
              <UiCommandSeparator v-if="item.children" />
            </template>
            <UiCommandGroup heading="Theme" class="p-1.5">
              <UiCommandItem
                value="light"
                @click="colorMode.preference = 'light'"
              >
                <Icon name="mdi:weather-sunny" class="mr-2 size-4" />
                <span>Light</span>
              </UiCommandItem>
              <UiCommandItem
                value="dark"
                @click="colorMode.preference = 'dark'"
              >
                <Icon name="mdi:weather-night" class="mr-2 size-4" />
                <span>Dark</span>
              </UiCommandItem>
              <UiCommandItem
                value="system"
                @click="colorMode.preference = 'auto'"
              >
                <Icon name="lucide:monitor" class="mr-2 size-4" />
                <span>System</span>
              </UiCommandItem>
            </UiCommandGroup>
          </template>

          <div v-else-if="searchResult?.length" class="p-1.5 space-y-1">
            <a
              v-for="(item, i) in searchResult"
              :id="i"
              :key="item.id"
              :href="item.id"
              class="block select-none rounded-lg border border-transparent p-3 hover:cursor-pointer hover:bg-muted hover:border-border transition-colors"
              :class="[i === activeSelect && 'bg-muted border-border']"
              @click="(e) => handleResultClick(item.id, e)"
            >
              <!-- Row 1: Navigation breadcrumb with highlighting -->
              <div class="flex items-center gap-1 text-xs text-muted-foreground mb-1.5 flex-wrap">
                <Icon
                  v-if="getItemIcon(item.id)"
                  :name="getItemIcon(item.id)"
                  class="size-3.5 shrink-0"
                />
                <template v-for="(crumb, j) in getNavBreadcrumb(item.id)" :key="`nav-${crumb}${j}`">
                  <span class="truncate max-w-[140px]" v-html="highlightMatches(crumb)" />
                  <Icon
                    name="lucide:chevron-right"
                    class="size-3 shrink-0 text-muted-foreground/50"
                  />
                </template>
              </div>
              
              <!-- Row 2: Section title with highlighting -->
              <div 
                class="font-medium text-foreground leading-tight mb-1"
                v-html="highlightMatches(item.title)"
              />
              
              <!-- Row 3: Content preview with highlighting -->
              <div
                v-if="item.content"
                class="text-xs text-muted-foreground line-clamp-2 leading-relaxed"
                v-html="highlightMatches(item.content)"
              />
            </a>
          </div>

          <div v-else class="pt-4 text-center text-muted-foreground">
            No results found.
          </div>
        </UiCommandList>
      </UiCommand>
    </UiDialogContent>
  </UiDialog>
</template>

<script setup lang="ts">
import { VisuallyHidden } from "radix-vue";
import { nextTick } from "vue";
import MiniSearch from "minisearch";

const open = defineModel<boolean>("open");
const colorMode = useColorMode();
const { placeholderDetailed } = useConfig().value.search;

const activeSelect = ref(0);

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault();
  },
});
watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1]) open.value = true;
});

// Close dialog when route changes (e.g., when clicking search results)
// Watch fullPath to catch hash changes too
const route = useRoute();
watch(() => route.fullPath, () => {
  if (open.value) {
    open.value = false;
    input.value = "";
    activeSelect.value = 0;
    searchResult.value = null;
  }
});

// Nuxt Content v3: Load all searchable sections once, then filter with MiniSearch
const { data: searchSections } = useAsyncData('search-sections', () => 
  queryCollectionSearchSections('content')
);

// Initialize MiniSearch instance
const miniSearch = computed(() => {
  if (!searchSections.value) return null;
  
  const ms = new MiniSearch({
    idField: '_msId', // Use our custom id field
    fields: ['title', 'content', 'titles'],
    storeFields: ['title', 'content', 'titles', 'id', 'level', '_msId'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 2, titles: 1.5 },
    },
  });
  
  // Add all sections to the search index
  ms.addAll(searchSections.value.map((section: any, index: number) => ({
    ...section,
    // MiniSearch requires a unique id field - use index since section.id is a path
    _msId: index,
  })));
  
  return ms;
});

const input = ref("");
const searchResult = ref<any[] | null>(null);
const searchLoading = ref(false);

watch(input, (v) => {
  activeSelect.value = 0;
  if (!v || !miniSearch.value) {
    searchResult.value = null;
    return;
  }

  searchLoading.value = true;
  
  // Perform client-side search with MiniSearch
  const results = miniSearch.value.search(v, { 
    prefix: true, 
    fuzzy: 0.2,
  });
  
  // Map results back to the original section data
  searchResult.value = results.slice(0, 20).map((result: any) => {
    const section = searchSections.value?.[result._msId];
    return section || result;
  });
  
  searchLoading.value = false;
});

// Highlight search terms in text - used for breadcrumb, title, and content
function highlightMatches(text: string) {
  if (!text || !input.value) return text;
  // Escape special regex chars and split search into words for multi-word highlighting
  const searchTerms = input.value.trim().split(/\s+/).filter(t => t.length > 0);
  if (searchTerms.length === 0) return text;
  
  // Create regex that matches any of the search terms
  const escapedTerms = searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  
  return text.replace(regex, '<mark class="bg-primary/20 text-primary rounded px-0.5">$1</mark>');
}

const { navKeyFromPath } = useContentHelpers();
// Nuxt Content v3: use queryCollectionNavigation instead of useContent()
const { data: navigation } = useAsyncData('navigation', () => {
  return queryCollectionNavigation('content');
});
function getItemIcon(path: string) {
  return navKeyFromPath(path, "icon", navigation.value);
}

// Build navigation breadcrumb from path using the navigation tree
function getNavBreadcrumb(path: string): string[] {
  if (!navigation.value || !path) return [];
  
  // Remove hash/anchor from path
  const cleanPath = path.split('#')[0];
  
  const breadcrumb: string[] = [];
  
  function findInNav(items: any[], targetPath: string): boolean {
    for (const item of items) {
      // Check if this item's path matches or is a parent of the target
      if (item.path && (cleanPath === item.path || cleanPath.startsWith(item.path + '/'))) {
        breadcrumb.push(item.title);
        
        if (item.children && item.children.length > 0) {
          // Continue searching in children
          findInNav(item.children, targetPath);
        }
        return true;
      }
    }
    return false;
  }
  
  findInNav(navigation.value, cleanPath);
  
  // Remove the last item (the page itself) - we'll show that separately as the title
  if (breadcrumb.length > 1) {
    breadcrumb.pop();
  }
  
  return breadcrumb;
}

watch(activeSelect, (value) => {
  document
    .querySelector(`[id="${value}"]`)
    ?.scrollIntoView({ block: "nearest" });
});

function handleEnter() {
  if (searchResult.value?.[activeSelect.value]?.id) {
    const path = searchResult.value[activeSelect.value].id;
    // Close dialog first
    open.value = false;
    input.value = "";
    activeSelect.value = 0;
    searchResult.value = null;
    
    // Navigate after dialog closes
    nextTick(() => {
      setTimeout(() => {
        navigateTo(path);
      }, 100);
    });
  }
}

function handleNavigate(delta: -1 | 1) {
  if (
    activeSelect.value + delta >= 0 &&
    activeSelect.value + delta < searchResult.value.length
  ) {
    activeSelect.value += delta;
  }
}

function handleClose() {
  open.value = false;
  // Clear input after a short delay to allow dialog to close smoothly
  nextTick(() => {
    setTimeout(() => {
      input.value = "";
      activeSelect.value = 0;
    }, 150);
  });
}

function handleDialogUpdate(newValue: boolean) {
  if (!newValue) {
    // Clear input when dialog closes
    nextTick(() => {
      input.value = "";
      activeSelect.value = 0;
      searchResult.value = null;
    });
  }
}

function handleResultClick(path: string, event?: MouseEvent) {
  // Prevent any default behavior and stop propagation
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  
  // Close dialog IMMEDIATELY and synchronously - don't wait
  // This must happen before navigation to prevent the dialog from staying open
  open.value = false;
  input.value = "";
  activeSelect.value = 0;
  searchResult.value = null;
  
  // Force a synchronous DOM update by accessing the dialog element
  nextTick(() => {
    // Navigate after ensuring dialog state is cleared
    // For anchor links, navigateTo will scroll but might not trigger route change
    // So we ensure dialog is already closed
    navigateTo(path, { replace: false }).then(() => {
      // Double-check dialog is closed after navigation completes
      if (open.value) {
        open.value = false;
      }
    });
  });
}
</script>
