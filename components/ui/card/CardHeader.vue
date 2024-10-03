<template>
  <div
    :class="
      cn('flex flex-col gap-y-1.5 p-6 text-primary-foreground', props.class)
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
