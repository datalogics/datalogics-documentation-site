<template>
  <footer class="w-full py-6 text-foreground md:px-8 md:py-0">
    <div
      class="container mx-auto flex flex-col items-center justify-between gap-2 md:h-24 md:flex-row"
      :class="{'px-4': !config.main.padded}"
    >
      <span class="text-sm">
        {{ footer.credits }}
      </span>
      <span class="flex-1" />
      <NuxtLink
        v-for="(link, i) in footer.links"
        :key="i"
        :to="link?.to"
        :target="link?.target"
      >
        <UiButton
          variant="ghost"
          :size="link?.icon && !link?.title ? 'icon' : 'default'"
          class="flex gap-2"
        >
          <Icon v-if="link?.icon" :name="link.icon" size="20" />
          <span v-if="link?.title">{{ link.title }}</span>
        </UiButton>
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useConfig();
const { footer } = config.value;
</script>
