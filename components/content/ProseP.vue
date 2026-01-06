<template>
  <p class="mb-6 text-base leading-7 [&:not(:first-child)]:mt-6" :class="[$route.path === '/' ? 'text-secondary' : 'text-muted-foreground']">
    <slot />
  </p>
</template>
