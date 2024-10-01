<template>
  <div class="flex items-center">
    <NuxtLink v-if="logo.light && logo.dark" to="/" class="flex items-center">
      <NuxtImg :src="logo.light" class="h-10 dark:hidden" />
      <NuxtImg :src="logo.dark" class="hidden h-10 dark:block" />
    </NuxtLink>
    <span
      v-if="showTitle && title"
      class="self-center rounded-md bg-dl-orange px-4 font-bold text-white"
    >
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts">
const { logo, title, showTitle } = useConfig().value.header;
</script>
