import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      kapaWebsiteId: process.env.KAPA_WEBSITE_ID,
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
    '@nuxtjs/tailwindcss',
    'nuxt-gtag',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxthq/studio',
    '@nuxtjs/color-mode',
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
  components: {
    dirs: [
      {
        path: './components',
        ignore: ['**/*.ts'],
      },
    ],
  },
  colorMode: {
    classSuffix: '',
  },
  css: [
    join(currentDir, './assets/css/themes.css'),
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini'],
    },
    navigation: {
      fields: ['icon'],
    },
    experimental: {
      search: {
        indexed: true,
      },
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
  compatibilityDate: '2024-07-05',
});
