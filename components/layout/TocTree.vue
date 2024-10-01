<template>
  <ul :class="[level !== 0 && 'pl-4']">
    <li v-for="link in links" :key="link.id" class="pt-2">
      <NuxtLink
        :to="`#${link.id}`"
        class="text-primary transition-all hover:text-foreground"
        :class="[activeHeadings.includes(link.id) && 'text-primary-foreground']"
      >
        {{ link.text }}
      </NuxtLink>
      <TocTree v-if="link.children" :links="link.children" :level="level + 1" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TocLink } from "@nuxt/content";

defineProps<{
  links: TocLink[];
  level: number;
}>();

const { activeHeadings, updateHeadings } = useScrollspy();

onMounted(() =>
  updateHeadings([
    ...document.querySelectorAll(".docs-content h1"),
    ...document.querySelectorAll(".docs-content h2"),
    ...document.querySelectorAll(".docs-content h3"),
    ...document.querySelectorAll(".docs-content h4"),
  ])
);
</script>
