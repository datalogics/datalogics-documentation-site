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
    auth0: {
      // Support both Netlify Auth0 extension variables and manual NUXT_ prefixed variables
      domain: process.env.NUXT_AUTH0_DOMAIN || process.env.AUTH0_DOMAIN,
      clientId: process.env.NUXT_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.NUXT_AUTH0_CLIENT_SECRET || process.env.AUTH0_CLIENT_SECRET,
      sessionSecret: process.env.NUXT_AUTH0_SESSION_SECRET || process.env.AUTH0_SESSION_SECRET,
      appBaseUrl: process.env.NUXT_AUTH0_APP_BASE_URL || process.env.URL || process.env.DEPLOY_URL || 'http://localhost:3000',
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
    '@auth0/auth0-nuxt', // Auth0 authentication
    '~/modules/navigation-redirects', // Auto-generate redirects from .navigation.yml files
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

    // Set to false to require authentication even in development
    dev: false, // Require auth in dev too (for testing production auth flow)
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

  // Explicitly configure route rules for API routes to ensure SSR
  routeRules: {
    '/api/**': { 
      ssr: true,
      cors: true,
      headers: { 'Cache-Control': 's-maxage=0' }
    },
    '/auth/**': {
      ssr: true, // Auth0 routes need SSR
      index: false, // Prevent index.html generation
    },
    '/_studio/**': {
      ssr: true,
    },
    '/__nuxt_studio/**': {
      ssr: true,
    },
    '/studio/login': {
      ssr: true,
      index: false, // Prevent index.html generation
    },
    '/studio/login/**': {
      ssr: true,
      index: false,
    },
    // Directory-level redirects are auto-generated from .navigation.yml files
    // by the ~/modules/navigation-redirects module at build time
  },

  // Nitro configuration for Netlify
  nitro: {
    preset: 'netlify',
    // Pre-render all routes except Studio and API (which need SSR)
    prerender: {
      crawlLinks: true,
      routes: ['/'], // Start with root, crawler will find the rest via links
      ignore: [
        '/_studio',
        '/_studio/**',
        '/__nuxt_studio',
        '/__nuxt_studio/**',
        '/api/**', // Ignore ALL API routes (not just /api/studio/**)
        '/auth/**', // Auth0 routes should be SSR (optional, not required for Studio)
        '/studio/login', // Login page should also be SSR
        '/studio/login/**', // Login page with any sub-paths
      ],
    },
    // Ensure serverless function is generated for Studio routes and API routes
    experimental: {
      wasm: true,
    },
  },
});
