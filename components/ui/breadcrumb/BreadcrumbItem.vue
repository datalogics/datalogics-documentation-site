<template>
  <li
    :class="
      cn(' text-muted-foreground inline-flex items-center gap-1.5', props.class)
    "
  >
    <slot />
  </li>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
