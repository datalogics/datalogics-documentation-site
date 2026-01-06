<template>
  <ul class="py-2.5" :class="[level > 0 && 'border-l']">
    <template v-for="link in links" :key="link.id">
      <LayoutAsideTreeItem
        :link="link"
        :level="level"
      />
    </template>
  </ul>
</template>

<script setup lang="ts">
// Nuxt Content v3: NavItem is now ContentNavigationItem
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{
  links: ContentNavigationItem[];
  level: number;
}>();
</script>
