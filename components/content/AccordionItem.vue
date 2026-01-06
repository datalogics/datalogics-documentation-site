<template>
  <UiAccordionItem :value="value ?? autoValue">
    <UiAccordionTrigger>
      <slot name="title" mdc-unwrap="p" />
      {{ title }}
    </UiAccordionTrigger>
    <UiAccordionContent>
      <slot name="content" mdc-unwrap="p" />
      {{ content }}
    </UiAccordionContent>
  </UiAccordionItem>
</template>

<script setup lang="ts">
defineProps<{
  value?: string;
  title?: string;
  content?: string;
}>();

const autoValue = useId();
</script>
