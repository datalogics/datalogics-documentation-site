<template>
  <div class="flex items-center">
    <NuxtLink v-if="logo.light && logo.dark" to="/" class="flex items-center">
      <!-- Light mode logo (logo.svg) - visible when NOT dark mode -->
      <NuxtImg 
        v-if="!isDark"
        :src="logo.light" 
        class="h-10"
        alt="Datalogics Logo"
      />
      <!-- Dark mode logo (logo-dark.svg) - visible when dark mode -->
      <NuxtImg 
        v-if="isDark"
        :src="logo.dark" 
        class="h-10"
        alt="Datalogics Logo"
      />
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
const colorMode = useColorMode();
// Make it reactive to color mode changes
const isDark = computed(() => colorMode.value === 'dark');
</script>
