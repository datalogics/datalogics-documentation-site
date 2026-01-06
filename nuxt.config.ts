import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  // Nuxt 4 with Nuxt 3 compatibility mode
  future: {
    compatibilityVersion: 3,
  },

  runtimeConfig: {
    public: {
      kapaWebsiteId: '', // Set via KAPA_WEBSITE_ID environment variable
    },
  },

  plugins: [
    {
      src: '~/plugins/vue-matomo.client.js',
      ssr: false,
    },
    {
      src: '~/plugins/kapa.client.ts',
      ssr: false,
    },
  ],

  devtools: { enabled: true },
  modules: [
    'nuxt-gtag',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    'nuxt-component-meta', // Required for nuxt-studio to access component metadata
    'nuxt-studio',
  ],

  gtag: {
    id: 'G-Y2P2CZ9B8N',
    initCommands: [
      // Setup up consent mode
      ['consent', 'default', {
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        ad_storage: 'denied',
        analytics_storage: 'denied',
        wait_for_update: 500,
      }],
    ],
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: join(currentDir, './components/ui'),
  },
  components: [
    // Content components (no prefix) - for use in markdown files
    {
      path: './components/content',
      pathPrefix: false,
      global: false,
    },
    // UI components (Ui prefix) - shadcn-vue components
    {
      path: './components/ui',
      prefix: 'Ui',
      global: false,
    },
    // Layout components (Layout prefix)
    {
      path: './components/layout',
      prefix: 'Layout',
      global: false,
    },
    // Root components (no prefix, but ignore subdirectories)
    {
      path: './components',
      ignore: ['**/*.ts', '**/ui/**', '**/content/**', '**/layout/**'],
      global: false,
    },
  ],
  colorMode: {
    classSuffix: '',
  },
  css: [
    join(currentDir, './assets/css/tailwind.css'),
    join(currentDir, './assets/css/themes.css'),
  ],
  vite: {
    plugins: [
      tailwindcss({
        config: './tailwind.config.ts',
      }),
    ],
  },
  content: {
    // Nuxt Content v3 configuration
    // Navigation and search are configured via content.config.ts in Nuxt Content v3
  },
  componentMeta: {
    // Exclude problematic paths that cause Windows path resolution issues
    exclude: [
      /node_modules/,
      /\.nuxt/,
      /\.output/,
      /dist/,
      /\.component-meta/,
    ],
    // Only scan components from our local directories
    // Components in /components/content are automatically available in Nuxt Studio
    componentDirs: [
      {
        path: './components/content',
      },
      {
        path: './components/ui',
      },
    ],
  },
  // Make shadcn-vue components available globally for Nuxt Studio
  hooks: {
    'components:extend': (components) => {
      // Make ConfigProvider and Toaster available globally
      const globals = components.filter(c =>
        ['ConfigProvider', 'Toaster'].includes(c.pascalName),
      );
      globals.forEach(c => c.global = true);
    },
  },
  studio: {
    // Customize the admin route (default: '/_studio')
    // route: '/admin',

    // Repository configuration (required for production publishing)
    repository: {
      provider: 'github',
      owner: 'datalogics',
      repo: 'datalogics-documentation-site',
      branch: 'main',
      // rootDir: '', // Optional: if content is in a subdirectory
      // private: true, // Optional: allow private repo access (default: true)
    },

    // Internationalization (optional)
    // i18n: {
    //   defaultLocale: 'en', // 'en', 'fr', 'de', 'es', etc.
    // },

    // Set to false to test production setup locally
    // dev: true, // Default: true in development, false in production
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
  compatibilityDate: '2026-01-05', // Updated for Nuxt 4

  // Build optimizations to reduce memory usage
  build: {
    transpile: ['vue-toastification'],
  },

  // Disable source maps in production to save memory
  sourcemap: {
    server: false,
    client: false,
  },

  // Nitro configuration for Netlify
  nitro: {
    preset: 'netlify',
    // Pre-render all routes except Studio (which needs SSR)
    prerender: {
      crawlLinks: true,
      ignore: [
        '/_studio',
        '/_studio/**',
        '/__nuxt_studio',
        '/__nuxt_studio/**',
        '/api/studio/**',
      ],
    },
    // Ensure serverless function is generated for Studio routes
    experimental: {
      wasm: true,
    },
  },
});
