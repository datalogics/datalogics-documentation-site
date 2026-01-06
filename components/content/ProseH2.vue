<template>
  <h2
    :id="id"
    class="scroll-m-20 mb-6 mt-12 font-semibold tracking-tight text-foreground transition-colors first:mt-0"
    :class="[
      $route.path === '/' && id === 'adobe-pdf-library-18'
        ? 'text-3xl'
        : 'text-3xl',
    ]"
  >
    <NuxtLink v-if="id && generate" :href="`#${id}`">
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>

<script setup lang="ts">
const route = useRoute();
const props = defineProps<{ id?: string }>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(() => props.id && headings?.anchorLinks?.h2);
</script>
