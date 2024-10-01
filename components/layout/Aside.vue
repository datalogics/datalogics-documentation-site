<template>
  <UiScrollArea
    orientation="vertical"
    class="relative h-full overflow-hidden py-6 pr-6 text-sm"
    type="hover"
  >
    <LayoutHeaderNavMobile v-if="isMobile" class="mb-5 border-b pb-2" />
    <LayoutSearchButton v-if="config.search.inAside" />
    <ul v-if="config.aside.useLevel" class="mb-1">
      <li
        v-for="(category, categoryIndex) in categorizedLinks"
        :key="categoryIndex"
      >
        <h3 class="my-3 font-bold text-primary-foreground">
          {{ category.name }}
        </h3>
        <ul>
          <li v-for="link in category.links" :key="link.id">
            <UiCollapsible v-model:open="openStates[link._path]">
              <UiCollapsibleTrigger class="w-full text-left">
                <NuxtLink
                  :to="link._path"
                  class="mb-1 flex w-full gap-2 rounded-md px-3 py-2 transition-all hover:bg-muted"
                  :class="[
                    path.startsWith(link._path) &&
                      'bg-muted font-semibold text-primary hover:bg-muted',
                  ]"
                >
                  <Icon
                    v-if="link.icon"
                    :name="link.icon"
                    class="self-center"
                    size="16"
                  />
                  {{ link.title }}
                </NuxtLink>
              </UiCollapsibleTrigger>
              <UiCollapsibleContent v-if="link.children">
                <ul class="pl-4">
                  <LayoutAsideTreeItem
                    v-for="childLink in link.children"
                    :key="childLink._path"
                    :link="childLink"
                    :level="1"
                  />
                </ul>
              </UiCollapsibleContent>
            </UiCollapsible>
          </li>
        </ul>
      </li>
    </ul>
    <LayoutAsideTree
      v-else
      :links="tree"
      :level="0"
      class="px-3"
      :class="[config.aside.useLevel ? 'pt-4' : 'pt-1']"
    />
  </UiScrollArea>
</template>

<script setup lang="ts">
defineProps<{ isMobile: boolean }>();

const { navDirFromPath } = useContentHelpers();
const { navigation } = useContent();
const config = useConfig();

const tree = computed(() => {
  const route = useRoute();
  const path = route.path.split("/");
  if (config.value.aside.useLevel) {
    const leveledPath = path.splice(0, 2).join("/");

    const dir = navDirFromPath(leveledPath, navigation.value);
    return dir ?? [];
  }

  return navigation.value;
});

const path = computed(() => useRoute().path);

const categorizedLinks = computed(() => {
  const categories = {};
  navigation.value.forEach((link) => {
    const category = link.category || "Uncategorized";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(link);
  });

  return Object.keys(categories).map((category) => ({
    name: category,
    links: categories[category],
  }));
});

// Reactive object to store the open state of each link
const openStates = ref({});
</script>

<style scoped>
/* Add smooth collapsing animation */
.UiCollapsibleContent {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  overflow: hidden;
}
</style>
