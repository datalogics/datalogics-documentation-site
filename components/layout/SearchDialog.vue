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
        class="h-svh sm:h-[350px]"
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

          <div v-else-if="searchResult?.length" class="p-1.5">
            <a
              v-for="(item, i) in searchResult"
              :id="i"
              :key="item.id"
              :href="item.id"
              class="flex select-none rounded-md p-2 hover:cursor-pointer hover:bg-muted"
              :class="[i === activeSelect && 'bg-muted']"
              @click="(e) => handleResultClick(item.id, e)"
            >
              <Icon
                v-if="getItemIcon(item.id)"
                :name="getItemIcon(item.id)"
                class="mr-2 size-4 shrink-0 self-center"
              />
              <div v-else class="mr-2 size-4 shrink-0" />

              <span
                v-for="(subtitle, j) in item.titles"
                :key="`${subtitle}${j}`"
                class="flex shrink-0 self-center"
              >
                {{ subtitle }}
                <Icon
                  name="lucide:chevron-right"
                  class="mx-0.5 self-center text-muted-foreground"
                />
              </span>
              <span class="shrink-0 self-center">
                {{ item.title }}
              </span>
              <span
                class="ml-2 self-center truncate text-xs text-muted-foreground"
                v-html="getHighlightedContent(item.content)"
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

const input = ref("");
const searchResult = ref();
const searchLoading = ref(false);
watch(input, async (v) => {
  activeSelect.value = 0;
  if (!v) return;

  searchLoading.value = true;
  // Nuxt Content v3: use queryCollectionSearchSections instead of searchContent()
  searchResult.value = await queryCollectionSearchSections('content', v);
  searchLoading.value = false;
});

function getHighlightedContent(text: string) {
  return text.replace(
    input.value,
    `<span class="font-semibold underline">${input.value}</span>`
  );
}

const { navKeyFromPath } = useContentHelpers();
// Nuxt Content v3: use queryCollectionNavigation instead of useContent()
const { data: navigation } = useAsyncData('navigation', () => {
  return queryCollectionNavigation('content');
});
function getItemIcon(path: string) {
  return navKeyFromPath(path, "icon", navigation.value);
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
