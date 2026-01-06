<template>
  <section
    class="mx-auto flex max-w-[980px] flex-col items-center gap-2 pb-4 pt-6 md:pt-8"
  >
    <NuxtLink
      v-if="announcement"
      :to="announcement.to"
      :target="announcement.target"
      class="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
    >
      <template v-if="announcement.icon">
        <Icon :name="announcement.icon" size="16" />
        <UiSeparator class="mx-2 h-4" orientation="vertical" />
      </template>
      <span class="sm:hidden">{{ announcement.title }}</span>
      <span class="hidden sm:inline">
        {{ announcement.title }}
      </span>
      <Icon name="lucide:arrow-right" class="ml-1 size-4" />
    </NuxtLink>

    <h1
      ref="titleRef"
      class="hero-title text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]"
      :style="{ '--gradient-position': `${gradientPosition}%` }"
    >
      <slot name="title" mdc-unwrap="p" />
    </h1>
    <p class="max-w-[750px] text-center text-lg text-secondary sm:text-xl">
      <slot name="description" mdc-unwrap="p" />
    </p>

    <section
      v-if="actions && actions.length > 0"
      class="flex w-full items-center justify-center space-x-4 py-4 md:pb-10"
    >
      <NuxtLink
        v-for="(action, i) in actions"
        :key="i"
        :to="action.to"
        :target="action.target"
      >
        <UiButton :variant="action.variant">
          <Icon v-if="action.leftIcon" :name="action.leftIcon" class="mr-1" />
          {{ action.name }}
          <Icon v-if="action.rightIcon" :name="action.rightIcon" class="ml-1" />
        </UiButton>
      </NuxtLink>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  announcement?: {
    to?: string;
    target?: string;
    icon?: string;
    title: string;
  };
  actions?: [
    {
      name: string;
      leftIcon?: string;
      rightIcon?: string;
      variant?:
        | "default"
        | "link"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost";
      to: string;
      target?: string;
    }
  ];
}>();

const titleRef = ref<HTMLElement | null>(null);
const gradientPosition = ref(50); // Start at center (50%)

const handleMouseMove = (e: MouseEvent) => {
  // Get viewport width
  const viewportWidth = window.innerWidth;
  // Calculate percentage based on mouse X position (0% = left, 100% = right)
  // Invert so gradient follows mouse direction correctly
  const percentage = (e.clientX / viewportWidth) * 100;
  gradientPosition.value = Math.max(0, Math.min(100, 100 - percentage));
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style scoped>
.hero-title {
  background: linear-gradient(
    135deg,
    hsl(var(--foreground)) 0%,
    hsl(var(--foreground)) 35%,
    #0c70f2 45%,
    #f2a20c 55%,
    #0c70f2 65%,
    hsl(var(--foreground)) 75%,
    hsl(var(--foreground)) 100%
  );
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-position: var(--gradient-position, 50%) 50%;
  position: relative;
  display: inline-block;
  transition: background-position 0.1s ease-out;
}

.hero-title :deep(*) {
  background: inherit;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Fallback for browsers that don't support background-clip */
@supports not (-webkit-background-clip: text) {
  .hero-title {
    background: none;
    -webkit-text-fill-color: hsl(var(--foreground));
    color: hsl(var(--foreground));
  }

  .hero-title :deep(*) {
    background: none;
    -webkit-text-fill-color: hsl(var(--foreground));
    color: hsl(var(--foreground));
  }
}
</style>
