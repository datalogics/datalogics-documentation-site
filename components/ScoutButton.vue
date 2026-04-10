<template>
  <div class="scout-button-container">
    <button 
      @click="openScout"
      class="scout-button"
      :class="{ 'scout-button-floating': floating, 'scout-button-loading': loading }"
      data-tooltip
    >
      <Icon 
        name="noto:dog" 
        class="scout-icon" 
      />
      <span v-if="showText" class="scout-label">
        <span class="scout-text">{{ buttonText }}</span>
        <span class="scout-sub">Our AI Assistant</span>
      </span>
      
      <div class="scout-tooltip">
        {{ buttonTitle }}
      </div>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  floating: {
    type: Boolean,
    default: true
  },
  buttonText: {
    type: String,
    default: 'Ask Scout'
  },
  buttonTitle: {
    type: String,
    default: "I'll sniff out the answers you need!"
  },
  showText: {
    type: Boolean,
    default: true
  }
})

const loading = ref(false)

const openScout = async () => {
  loading.value = true
  
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    if (typeof window !== 'undefined' && window.openKapaWidget) {
      const success = window.openKapaWidget()
      if (success) break
    }
    
    if (typeof window !== 'undefined' && window.kapaWidgetReady && window.Kapa && typeof window.Kapa.open === 'function') {
      try {
        window.Kapa.open({ mode: 'ai', query: '', submit: false })
        break
      } catch (error) {
        console.error('Error opening widget:', error)
      }
    }
    
    attempts++
    if (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  setTimeout(() => { loading.value = false }, 1000)
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('askai') === 'true') {
    openScout()
  }
})

defineExpose({ open: openScout })
</script>

<style scoped>
.scout-button-container {
  position: relative;
}

.scout-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(5, 16, 38, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(12, 112, 242, 0.4);
  border-radius: 100px;
  color: #F1F5F9;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.015em;
  padding: 9px 18px 9px 11px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  z-index: 9999;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
}

.scout-button:hover {
  border-color: rgba(12, 112, 242, 0.8);
  background: rgba(12, 112, 242, 0.12);
  box-shadow:
    0 0 0 3px rgba(12, 112, 242, 0.1),
    0 4px 20px rgba(12, 112, 242, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.35);
  transform: translateY(-1px);
  color: #FFFFFF;
}

.scout-button:active {
  transform: translateY(0);
  box-shadow: 0 0 0 2px rgba(12, 112, 242, 0.15);
}

.scout-button-loading {
  animation: scout-pulse-glow 1.6s ease-in-out infinite;
}

.scout-button-floating {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 11px 22px 11px 14px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(12, 112, 242, 0.25);
}

.scout-button-floating:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 3px rgba(12, 112, 242, 0.12),
    0 8px 32px rgba(12, 112, 242, 0.22),
    0 4px 16px rgba(0, 0, 0, 0.45);
}

.scout-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
  transition: transform 0.2s ease;
}

.scout-button:hover .scout-icon {
  transform: scale(1.1) rotate(-4deg);
}

.scout-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
}

.scout-text {
  white-space: nowrap;
  font-weight: 500;
  line-height: 1.2;
}

.scout-sub {
  white-space: nowrap;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.03em;
  color: rgba(200, 221, 244, 0.65);
  line-height: 1.2;
  transition: color 0.2s ease;
}

.scout-button:hover .scout-sub {
  color: rgba(200, 221, 244, 0.9);
}

.scout-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: rgba(10, 30, 61, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(12, 112, 242, 0.22);
  color: #C8DDF4;
  padding: 9px 13px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
  z-index: 10000;
}

.scout-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 22px;
  border: 6px solid transparent;
  border-top-color: rgba(10, 30, 61, 0.96);
}

.scout-button:hover .scout-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@keyframes scout-pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(12, 112, 242, 0.35); }
  50%       { box-shadow: 0 0 16px 4px rgba(12, 112, 242, 0.15); }
}

@media (max-width: 768px) {
  .scout-button-floating {
    bottom: 16px;
    right: 16px;
    padding: 10px 16px 10px 12px;
  }

  .scout-text {
    display: none;
  }

  .scout-tooltip {
    display: none;
  }
}
</style>
