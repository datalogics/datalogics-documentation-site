<template>
  <div v-show="isVisible" class="scout-button-container">
    <button
      class="scout-button"
      :class="{
        'scout-button-floating': floating,
        'scout-button-loading': loading,
      }"
      data-tooltip
      @click="openScout"
    >
      <Icon v-if="isIconLoaded" name="noto:dog" class="scout-icon" />
      <span v-if="showText" class="scout-text">{{ buttonText }}</span>

      <!-- Custom tooltip -->
      <div class="scout-tooltip">
        {{ buttonTitle }}
      </div>
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

defineProps({
  floating: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: "Ask Scout",
  },
  buttonTitle: {
    type: String,
    default: "I'll sniff out the answers you need!",
  },
  showText: {
    type: Boolean,
    default: true,
  },
});

const loading = ref(false);
const isVisible = ref(false);
const isIconLoaded = ref(false);

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// Function to ensure icon is loaded
async function checkIconLoading() {
  // Small delay to ensure Nuxt Icon component is initialized
  await new Promise((resolve) => setTimeout(resolve, 100));
  isIconLoaded.value = true;
}

// Function to check URL parameter
function checkAsKaiParam() {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("askai") === "true";
  }
  return false;
}

// Function to open the Kapa.ai widget
async function openScout() {
  loading.value = true;

  // Wait for widget to be ready
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Check if the global function is available
    if (typeof window !== "undefined" && window.openKapaWidget) {
      const success = window.openKapaWidget();
      if (success) {
        break;
      }
    }

    // Check if widget is ready directly
    if (
      typeof window !== "undefined" &&
      window.kapaWidgetReady &&
      window.Kapa &&
      typeof window.Kapa.open === "function"
    ) {
      try {
        window.Kapa.open({
          mode: "ai",
          query: "",
          submit: false,
        });
        break;
      } catch (error) {
        console.error("Error opening widget:", error);
      }
    }

    attempts++;

    if (attempts < maxAttempts) {
      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Reset loading state
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

// Expose the open function for external use
// Watch for route changes
watch(
  () => window?.location?.search,
  () => {
    if (checkAsKaiParam()) {
      openScout();
    }
  }
);

// Initialize on mount
onMounted(async () => {
  // Ensure we're in browser environment
  if (!isBrowser) return;

  // Wait for icon to load
  await checkIconLoading();

  // Show the button
  isVisible.value = true;

  // Check if we need to open Scout
  if (checkAsKaiParam()) {
    openScout();
  }
});

defineExpose({
  open: openScout,
});
</script>

<style scoped>
.scout-button-container {
  position: relative;
}

.scout-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0c70f2;
  border: 2px solid transparent;
  border-radius: 50px;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(242, 162, 12, 0.2);
  text-decoration: none;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  z-index: 9999;
  position: relative;
  background-clip: padding-box;
}

.scout-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50px;
  padding: 2px;
  background: linear-gradient(135deg, #0c70f2, #f2a20c);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.scout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(242, 162, 12, 0.3);
}

.scout-button:hover::before {
  background: linear-gradient(
    45deg,
    rgba(242, 162, 12, 0.8),
    rgba(12, 112, 242, 0.8),
    rgba(242, 162, 12, 0.8)
  );
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

.scout-button:active {
  transform: translateY(0);
}

.scout-button-floating {
  position: fixed;
  bottom: 24px;
  right: 24px;
  border-radius: 50px;
  padding: 16px 24px;
  box-shadow: 0 8px 32px rgba(242, 162, 12, 0.3);
}

.scout-button-floating:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 40px rgba(242, 162, 12, 0.4);
}

.scout-button-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.scout-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.scout-text {
  white-space: nowrap;
  font-weight: 600;
}

/* Custom tooltip styles */
.scout-tooltip {
  position: absolute !important;
  bottom: 65% !important;
  right: calc(100% - 5px) !important;
  transform: translateY(50%) translateX(8px) !important;
  background: rgba(12, 112, 242, 0.95);
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10000;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(242, 162, 12, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 200px;
  min-width: 160px;
  text-align: center;
  line-height: 1.5;
  overflow: visible;
  word-wrap: break-word;
}

.scout-tooltip::after {
  content: "";
  position: absolute;
  top: 77%;
  right: -6px;
  transform: translateY(-52%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid rgba(12, 112, 242, 0.95);
  z-index: 10001;
}

.scout-button:hover .scout-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(50%) translateX(0);
}

/* Floating button tooltip positioning */
.scout-button-floating .scout-tooltip {
  bottom: 50%;
  right: calc(100% - 24px);
  transform: translateY(50%) translateX(8px);
}

.scout-button-floating:hover .scout-tooltip {
  transform: translateY(50%) translateX(0);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .scout-button-floating {
    bottom: 16px;
    right: 16px;
    padding: 12px 20px;
  }

  .scout-text {
    display: none;
  }

  /* Hide tooltip on mobile to avoid touch issues */
  .scout-tooltip {
    display: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .scout-button {
    background: #0b1320;
  }
}
</style>
