import { defineNuxtPlugin, useRuntimeConfig } from '#app'

declare global {
  interface Window {
    kapaWidget?: any
    Kapa?: {
      open: (options?: { mode?: 'search' | 'ai', query?: string, submit?: boolean }) => void
      close: () => void
      render: (options?: { onRender?: () => void }) => void
      unmount: () => void
    }
    openKapaWidget?: () => boolean
    kapaWidgetReady?: boolean
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  if (typeof window !== 'undefined') {
    window.kapaWidgetReady = false
  }
  
  if (typeof window !== 'undefined') {
    window.openKapaWidget = () => {
      if (!window.kapaWidgetReady) {
        if (window.Kapa && typeof window.Kapa.render === 'function') {
          window.Kapa.render({
            onRender: () => {
              window.kapaWidgetReady = true
              setTimeout(() => {
                if (window.Kapa && typeof window.Kapa.open === 'function') {
                  window.Kapa.open({ mode: 'ai', query: '', submit: false })
                }
              }, 200)
            }
          })
          return true
        }
        return false
      }
      
      if (window.Kapa && typeof window.Kapa.open === 'function') {
        try {
          window.Kapa.open({ mode: 'ai', query: '', submit: false })
          return true
        } catch (error) {
          console.error('Error opening Kapa widget:', error)
        }
      }
      
      if (window.kapaWidget && typeof window.kapaWidget.open === 'function') {
        try {
          window.kapaWidget.open()
          return true
        } catch (error) {
          console.error('Error calling legacy API:', error)
        }
      }
      
      return false
    }
  }
  
  function initializeKapaWidget() {
    if (document.getElementById('kapa-widget-script')) return

    const websiteId = config.public.kapaWebsiteId
    if (!websiteId) {
      console.warn('Kapa website ID not configured. Set NUXT_PUBLIC_KAPA_WEBSITE_ID in your environment variables.')
      return
    }

    const script = document.createElement('script')
    script.id = 'kapa-widget-script'
    script.async = true
    script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js'
    
    // ── Identity ────────────────────────────────────────────────────────────
    script.setAttribute('data-website-id', config.public.kapaWebsiteId as string)
    script.setAttribute('data-project-name', 'Scout')
    script.setAttribute('data-project-color', '#0C70F2')
    // Use the locally-hosted Datalogics icon. window.location.origin works across all environments.
    script.setAttribute('data-project-logo', `${window.location.origin}/logo-icon.png`)

    // ── Layout: persistent sidebar ──────────────────────────────────────────
    script.setAttribute('data-view-mode', 'sidebar')
    script.setAttribute('data-modal-open-by-default', 'false')
    script.setAttribute('data-launcher-button-hidden', 'true')
    script.setAttribute('data-modal-full-screen-on-mobile', 'true')

    // ── MCP install menu ────────────────────────────────────────────────────
    script.setAttribute('data-mcp-server-url', 'https://datalogics.mcp.kapa.ai')

    // ── Color scheme: always dark ───────────────────────────────────────────
    // IMPORTANT: palette tokens require -dark suffix when data-color-scheme="dark"
    script.setAttribute('data-color-scheme', 'dark')
    script.setAttribute('data-surface-color-dark', '#030C1A')
    script.setAttribute('data-surface-elevated-color-dark', '#0A1E3D')
    script.setAttribute('data-surface-hover-color-dark', '#0D2550')
    script.setAttribute('data-text-color-dark', '#FFFFFF')
    script.setAttribute('data-text-muted-color-dark', '#C8DDF4')
    script.setAttribute('data-border-color-dark', '#1E3A5F')
    script.setAttribute('data-anchor-color-dark', '#0C70F2')

    // ── Typography ──────────────────────────────────────────────────────────
    script.setAttribute('data-font-family', 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif')

    // ── Modal header ────────────────────────────────────────────────────────
    script.setAttribute('data-modal-header-background-color', '#0A1E3D')
    script.setAttribute('data-modal-header-color', '#E8EDF5')

    // ── Modal title ─────────────────────────────────────────────────────────
    script.setAttribute('data-modal-title', 'Scout AI Assistant')
    script.setAttribute('data-modal-title-text', 'Scout AI Assistant')
    script.setAttribute('data-modal-open-on-command-k', 'true')
    script.setAttribute('data-modal-z-index', '9999')

    // ── Search ──────────────────────────────────────────────────────────────
    script.setAttribute('data-search-mode-enabled', 'true')
    script.setAttribute('data-search-mode-default', 'false')

    // ── Disclaimer ──────────────────────────────────────────────────────────
    script.setAttribute('data-disclaimer-background-color', '#0A1E3D')
    script.setAttribute('data-disclaimer-color', '#C8DAF0')
    script.setAttribute('data-disclaimer-font-size', '0.8rem')

    // ── MCP button (matches Ask AI / Search button style) ───────────────────
    script.setAttribute('data-mcp-button-hidden', 'false')
    script.setAttribute('data-mcp-button-text', 'MCP')
    script.setAttribute('data-mcp-button-background-color', 'transparent')
    script.setAttribute('data-mcp-button-color', '#E8EDF5')
    script.setAttribute('data-mcp-button-border', '1px solid #2A4A73')
    script.setAttribute('data-mcp-button-border-radius', '6px')
    script.setAttribute('data-mcp-button-font-size', '0.875rem')
    script.setAttribute('data-mcp-button-font-weight', '500')
    script.setAttribute('data-mcp-button-padding-x', '12px')
    script.setAttribute('data-mcp-button-padding-y', '6px')
    script.setAttribute('data-mcp-button-hover-background-color', '#0D2550')
    script.setAttribute('data-mcp-button-hover-border-color', '#0C70F2')

    // ── MCP dropdown ────────────────────────────────────────────────────────
    script.setAttribute('data-mcp-dropdown-background-color', '#0A1E3D')
    script.setAttribute('data-mcp-dropdown-color', '#FFFFFF')
    script.setAttribute('data-mcp-dropdown-border', '1px solid #2A4A73')
    script.setAttribute('data-mcp-dropdown-border-radius', '8px')
    script.setAttribute('data-mcp-dropdown-box-shadow', '0 8px 24px rgba(0,0,0,0.5)')

    // ── Switch tabs (Ask AI / Search) ───────────────────────────────────────
    script.setAttribute('data-switch-label-color', '#E8EDF5')

    // ── Disclaimer text ─────────────────────────────────────────────────────
    script.setAttribute('data-modal-disclaimer', '🐕 **Scout is your trusty AI companion** who helps track down answers to Datalogics questions by searching through our [documentation](https://dev.datalogics.com/), [website](https://www.datalogics.com/), [knowledge base](https://kb.datalogics.com) and [pinned github repo files](https://github.com/datalogics). Scout is here to help you find exactly what you\'re looking for.\n\nScout ([built by kapa.ai](https://kapa.ai)) is deployed on our website to guide you to the information you need.\n\nNeed a human? Use our [Contact Us form](https://www.datalogics.com/datalogics-contact-us) or [customer portal](https://portal.datalogics.com/s/login/), join our [Discord server](https://discord.gg/jNSHcSdRre), [talk to a developer](https://calendly.com/seu-datalogics), or email [Support@datalogics.com](mailto:Support@datalogics.com).')

    // ── Input placeholders ──────────────────────────────────────────────────
    script.setAttribute('data-ask-ai-input-placeholder', 'Ask Scout about Datalogics PDF tools, APIs, or documentation...')
    script.setAttribute('data-search-input-placeholder', 'Search Datalogics documentation and resources...')

    // ── Feedback & analytics ────────────────────────────────────────────────
    script.setAttribute('data-answer-feedback-info-text', 'Your feedback helps us improve Scout\'s responses.')
    script.setAttribute('data-user-analytics-fingerprint-enabled', 'true')
    script.setAttribute('data-user-satisfaction-feedback-enabled', 'true')
    
    document.head.appendChild(script)
    
    script.onload = () => {
      const markReady = () => {
        if (typeof window !== 'undefined' && (window.Kapa || window.kapaWidget)) {
          window.kapaWidgetReady = true
        } else {
          setTimeout(markReady, 500)
        }
      }
      markReady()
    }
    
    script.onerror = (error) => {
      console.error('Failed to load Kapa.ai script:', error)
    }
  }

  const checkAndOpenKapa = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('askai') === 'true') {
        const tryOpen = () => {
          if (window.Kapa?.open) {
            window.Kapa.open({ mode: "ai", query: "", submit: false })
          } else {
            setTimeout(tryOpen, 500)
          }
        }
        tryOpen()
      }
    }
  }

  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      setTimeout(() => {
        initializeKapaWidget()
        checkAndOpenKapa()
      }, 100)
    })

    nuxtApp.hook('page:finish', () => {
      checkAndOpenKapa()
    })
  }
})
