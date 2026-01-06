<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :target="target"
    class="group relative flex items-start gap-6 border-b border-border/50 px-6 py-5 transition-colors first:border-t hover:bg-accent/5"
  >
    <!-- Icon -->
    <div
      v-if="icon"
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary"
    >
      <Icon :name="icon" size="20" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 space-y-1.5">
      <h3
        v-if="title || $slots.title"
        class="text-lg font-semibold text-foreground transition-colors group-hover:text-primary"
      >
        <template v-if="$slots.title">
          <slot name="title" mdc-unwrap="p" />
        </template>
        <template v-else>
          {{ title }}
        </template>
      </h3>

      <p
        v-if="
          description ||
          $slots.description ||
          content ||
          $slots.content ||
          $slots.default
        "
        class="text-base leading-relaxed text-secondary"
      >
        <template v-if="$slots.description">
          <slot name="description" mdc-unwrap="p" />
        </template>
        <template v-else-if="$slots.content">
          <slot name="content" mdc-unwrap="p" />
        </template>
        <template v-else-if="$slots.default">
          <slot mdc-unwrap="p" />
        </template>
        <template v-else>
          {{ description || content }}
        </template>
      </p>

      <div
        v-if="footer || $slots.footer"
        class="mt-1.5 text-sm text-muted-foreground"
      >
        <template v-if="$slots.footer">
          <slot name="footer" mdc-unwrap="p" />
        </template>
        <template v-else>
          {{ footer }}
        </template>
      </div>
    </div>

    <!-- Arrow indicator -->
    <Icon
      name="lucide:chevron-right"
      class="mt-1 h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
    />
  </NuxtLink>

  <div
    v-else
    class="flex items-start gap-6 border-b border-border/50 px-6 py-5 first:border-t"
  >
    <!-- Icon -->
    <div
      v-if="icon"
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground"
    >
      <Icon :name="icon" size="20" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 space-y-1.5">
      <h3
        v-if="title || $slots.title"
        class="text-lg font-semibold text-foreground"
      >
        <template v-if="$slots.title">
          <slot name="title" mdc-unwrap="p" />
        </template>
        <template v-else>
          {{ title }}
        </template>
      </h3>

      <p
        v-if="
          description ||
          $slots.description ||
          content ||
          $slots.content ||
          $slots.default
        "
        class="text-base leading-relaxed text-secondary"
      >
        <template v-if="$slots.description">
          <slot name="description" mdc-unwrap="p" />
        </template>
        <template v-else-if="$slots.content">
          <slot name="content" mdc-unwrap="p" />
        </template>
        <template v-else-if="$slots.default">
          <slot mdc-unwrap="p" />
        </template>
        <template v-else>
          {{ description || content }}
        </template>
      </p>

      <div
        v-if="footer || $slots.footer"
        class="mt-1.5 text-sm text-muted-foreground"
      >
        <template v-if="$slots.footer">
          <slot name="footer" mdc-unwrap="p" />
        </template>
        <template v-else>
          {{ footer }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  footer?: string;
  content?: string;
  to?: string;
  target?: string;
  icon?: string;
}>();
</script>
