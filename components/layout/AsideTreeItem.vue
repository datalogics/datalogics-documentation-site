<template>
  <li
    class="underline-offset-4 transition-all [&:not(:first-child)]:pt-3"
    :class="[level > 0 && 'border-l border-primary pl-4']"
  >
    <UiCollapsible v-if="link.children" v-model:open="isOpen">
      <UiCollapsibleTrigger class="w-full text-left">
        <NuxtLink
          :to="link._path"
          class="flex w-full gap-1 hover:underline"
          :class="[
            level === 0
              ? 'text-white'
              : isActive
              ? 'font-medium text-primary'
              : 'text-foreground',
          ]"
        >
          <Icon
            v-if="link.icon"
            :name="link.icon"
            class="mr-1 self-center"
            size="15"
          />
          <span class="truncate text-nowrap">
            {{ link.navtitle || link.title }}
          </span>
          <Icon
            v-if="link.children"
            name="lucide:chevron-down"
            class="ml-auto self-center transition-all"
            :class="[!isOpen && '-rotate-90']"
          />
        </NuxtLink>
      </UiCollapsibleTrigger>
      <UiCollapsibleContent>
        <ul class="pl-4">
          <LayoutAsideTreeItem
            v-for="childLink in link.children"
            :key="childLink._path"
            :link="childLink"
            :level="level + 1"
            :open-states="openStates"
          />
        </ul>
      </UiCollapsibleContent>
    </UiCollapsible>
    <NuxtLink
      v-else
      :to="link._path"
      class="flex w-full gap-1 hover:underline"
      :class="[isActive ? 'font-medium text-primary' : 'text-foreground']"
    >
      <Icon
        v-if="link.icon"
        :name="link.icon"
        class="mr-1 self-center"
        size="15"
      />
      <span class="truncate text-nowrap">
        {{ link.title }}
      </span>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  link: NavItem;
  level: number;
  openStates: Ref<Record<string, boolean>>;
}>();

const { collapse } = useConfig().value.aside;

const collapsed = useCollapsedMap();
const isOpen = computed({
  get: () => props.openStates[props.link._path] || false,
  set: (value) => {
    props.openStates[props.link._path] = value;
  },
});
watch(isOpen, (v) => {
  collapsed.value.set(props.link._path, v);
});

const route = useRoute();
const isActive = computed(() => route.path.startsWith(props.link._path));
</script>

<style scoped>
/* Add smooth collapsing animation */
.UiCollapsibleContent {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  overflow: hidden;
}
</style>
