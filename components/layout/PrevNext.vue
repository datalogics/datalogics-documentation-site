<template>
  <div class="mt-10 border-t pt-8 lg:flex lg:flex-row">
    <LayoutPrevNextButton :prev-next="prev" side="left" />
    <span class="flex-1" />
    <LayoutPrevNextButton :prev-next="next" side="right" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

// Nuxt Content v3: use queryCollectionItemSurroundings instead of useContent()
const { data: surroundings } = await useAsyncData(`surroundings-${route.path}`, () => {
  return queryCollectionItemSurroundings('content', route.path, {
    fields: ['title', 'description', 'path']
  });
});

const prev = computed(() => surroundings.value?.prev);
const next = computed(() => surroundings.value?.next);
</script>
