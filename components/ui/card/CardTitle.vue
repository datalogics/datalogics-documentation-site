<template>
  <h3
    :class="
      cn(
        'text-2xl font-semibold leading-none tracking-tight text-foreground',
        props.class
      )
    "
  >
    <slot />
  </h3>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
