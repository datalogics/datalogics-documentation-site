import { defineNuxtPlugin, useRuntimeConfig } from '#app';

declare global {
  interface Window {
    kapaWidget?: any;
    Kapa?: {
      open: (options?: { mode?: 'search' | 'ai'; query?: string; submit?: boolean }) => void;
      close: () => void;
      render: (options?: { onRender?: () => void }) => void;
      unmount: () => void;
    };
    openKapaWidget?: () => boolean;
    kapaWidgetReady?: boolean;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Track widget ready state
  if (typeof window !== 'undefined') {
    window.kapaWidgetReady = false;
  }

  // Create a global function to open the Kapa widget
  if (typeof window !== 'undefined') {
    window.openKapaWidget = () => {
      // Check if widget is ready
      if (!window.kapaWidgetReady) {
        // Try to initialize the widget
        if (window.Kapa && typeof window.Kapa.render === 'function') {
          window.Kapa.render({
            onRender: () => {
              window.kapaWidgetReady = true;

              // Now try to open it
              setTimeout(() => {
                if (window.Kapa && typeof window.Kapa.open === 'function') {
                  window.Kapa.open({
                    mode: 'ai',
                    query: '',
                    submit: false,
                  });
                }
              }, 200);
            },
          });
          return true;
        }

        return false;
      }

      // Widget is ready, try to open it
      if (window.Kapa && typeof window.Kapa.open === 'function') {
        try {
          window.Kapa.open({
            mode: 'ai',
            query: '',
            submit: false,
          });
          return true;
        } catch (error) {
          console.error('Error opening Kapa widget:', error);
        }
      }

      // Fallback: try legacy API
      if (window.kapaWidget && typeof window.kapaWidget.open === 'function') {
        try {
          window.kapaWidget.open();
          return true;
        } catch (error) {
          console.error('Error calling legacy API:', error);
        }
      }

      return false;
    };
  }

  // Initialize Kapa.ai Widget
  function initializeKapaWidget() {
    // Check if widget is already loaded
    if (document.getElementById('kapa-widget-script')) {
      return;
    }

    // Check if website ID is configured
    // In Netlify, set NUXT_PUBLIC_KAPA_WEBSITE_ID (not KAPA_WEBSITE_ID)
    const websiteId = config.public.kapaWebsiteId;
    if (!websiteId) {
      console.warn('Kapa website ID not configured. Set NUXT_PUBLIC_KAPA_WEBSITE_ID in your environment variables.');
      return;
    }

    // Create the script element
    const script = document.createElement('script');
    script.id = 'kapa-widget-script';
    script.async = true;
    script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';

    // Set data attributes for Kapa.ai configuration
    script.setAttribute('data-website-id', config.public.kapaWebsiteId as string);
    script.setAttribute('data-project-name', 'Datalogics');
    script.setAttribute('data-project-color', '#0B1320');
    script.setAttribute('data-project-logo', 'https://media.licdn.com/dms/image/v2/C560BAQE2nxd3OHItaA/company-logo_200_200/company-logo_200_200/0/1662478307821/datalogics_logo?e=2147483647&v=beta&t=HETYrp2nzlLgnA16t254XLEdyiCOvkZUtIGyW6WmxWc');

    // Hide the default button completely
    script.setAttribute('data-button-hide', 'true');

    // Don't render on load - we'll control it manually
    script.setAttribute('data-render-on-load', 'false');

    // Modal configuration - using only valid parameters from documentation
    script.setAttribute('data-modal-title', '🐕 Scout - Datalogics AI Assistant');
    script.setAttribute('data-modal-open-by-default', 'false');
    script.setAttribute('data-modal-open-on-command-k', 'false');
    script.setAttribute('data-modal-with-overlay', 'true');
    script.setAttribute('data-modal-z-index', '9999');
    script.setAttribute('data-modal-size', '800px');
    script.setAttribute('data-modal-border-radius', '16px');
    script.setAttribute('data-modal-y-offset', '5vh');
    script.setAttribute('data-modal-lock-scroll', 'true');
    script.setAttribute('data-modal-full-screen-on-mobile', 'true');

    // Modal styling - using only documented parameters
    script.setAttribute('data-modal-header-bg-color', '#F8F9FA');
    script.setAttribute('data-modal-header-border-bottom', '1px solid #CED4DA');
    script.setAttribute('data-modal-header-padding', '20px');
    script.setAttribute('data-modal-header-min-height', '48px');
    script.setAttribute('data-modal-title-color', '#212529');
    script.setAttribute('data-modal-title-font-size', '1.25rem');
    script.setAttribute('data-modal-title-font-weight', '600');
    script.setAttribute('data-modal-title-font-family', 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif');

    script.setAttribute('data-modal-body-bg-color', '#FFFFFF');
    script.setAttribute('data-modal-body-padding-top', '8px');
    script.setAttribute('data-modal-body-padding-right', '20px');
    script.setAttribute('data-modal-body-padding-bottom', '20px');
    script.setAttribute('data-modal-body-padding-left', '20px');

    script.setAttribute('data-modal-overlay-bg-color', 'rgba(0, 0, 0, 0.6)');
    script.setAttribute('data-modal-overlay-opacity', '1');

    script.setAttribute('data-modal-disclaimer-bg-color', '#F8F9FA');
    script.setAttribute('data-modal-disclaimer-text-color', 'gray');
    script.setAttribute('data-modal-disclaimer-font-size', '0.75rem');

    script.setAttribute('data-hyperlink-color', '#0B1320');

    // Search mode configuration
    script.setAttribute('data-search-mode-enabled', 'true');
    script.setAttribute('data-search-mode-default', 'false');

    // Example questions and disclaimer - disabled
    // script.setAttribute('data-modal-example-questions-title', 'Try asking Scout...');
    // script.setAttribute('data-modal-example-questions', 'How do I enable PDF/A compliance?,How to batch process PDFs with APDFL?,How to convert PDF to image formats?,How can I redact text in a PDF?');
    script.setAttribute('data-modal-disclaimer', '🐕 **Scout is your trusty AI companion** who helps track down answers to Datalogics questions by searching through our [documentation](https://dev.datalogics.com/), [website](https://www.datalogics.com/), [knowledge base](https://kb.datalogics.com) and [pinned github repo files](https://github.com/datalogics). Scout is here to help you find exactly what you\'re looking for.&#10;&#10;Scout ([built by kapa.ai](https://kapa.ai)) is deployed on our docs and website to guide you to the information you need.');

    // Input placeholder text
    script.setAttribute('data-modal-ask-ai-input-placeholder', 'Ask Scout about Datalogics PDF tools, APIs, or documentation...');
    script.setAttribute('data-modal-search-input-placeholder', 'Search Datalogics documentation and resources...');

    // Feedback info text
    script.setAttribute('data-answer-feedback-info-text', 'Your feedback helps us improve Scout\'s responses.');

    // Analytics
    script.setAttribute('data-user-analytics-fingerprint-enabled', 'true');
    script.setAttribute('data-user-satisfaction-feedback-enabled', 'true');

    // Add the script to the document
    document.head.appendChild(script);

    // Wait for the script to load and initialize
    script.onload = () => {
      // Wait for the widget to fully initialize
      setTimeout(() => {
        // Check if the widget is accessible globally
        if (typeof window !== 'undefined' && window.Kapa) {
          // Mark widget as ready
          window.kapaWidgetReady = true;

          // Pre-render the widget so it's ready to open
          if (typeof window.Kapa.render === 'function') {
            window.Kapa.render({
              onRender: () => {
                // Widget is now ready to use
              },
            });
          }
        } else if (typeof window !== 'undefined' && window.kapaWidget) {
          window.kapaWidgetReady = true;
        }
      }, 2000);
    };

    script.onerror = (error) => {
      console.error('Failed to load Kapa.ai script:', error);
    };
  }

  // Function to check URL and open Kapa if needed
  function checkAndOpenKapa() {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('askai') === 'true') {
        const checkKapa = () => {
          if (window.Kapa?.open) {
            window.Kapa.open({ mode: 'ai', query: '', submit: false });
          } else if (window.kapaWidget?.open) {
            window.kapaWidget.open();
          } else {
            setTimeout(checkKapa, 500);
          }
        };
        checkKapa();
      }
    }
  }

  // Only run on client-side
  if (typeof window !== 'undefined') {
    // Initialize Kapa.ai when the app is mounted
    nuxtApp.hook('app:mounted', () => {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeKapaWidget();
        // Check URL params after initialization
        checkAndOpenKapa();
      }, 100);
    });

    // Also watch for route changes
    nuxtApp.hook('page:finish', () => {
      checkAndOpenKapa();
    });
  }
});
