<template>
  <slot />
</template>

<script setup lang="ts">
// ConfigProvider wrapper for shadcn-vue/radix-vue components
// Provides ID generation context for components that need unique IDs
const props = defineProps<{
  useId?: () => string;
}>();

// Use the provided useId function or fallback to Vue's useId
const idGenerator = props.useId || useId;

// Provide the ID generator to child components
provide('configProvider', {
  useId: idGenerator,
});
</script>
