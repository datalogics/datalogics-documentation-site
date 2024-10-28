import { createGtm } from '@gtm-support/vue-gtm';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createGtm({
      id: 'G-Y2P2CZ9B8N',
      defer: false, // defaults to false.
      compatibility: false, // Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`
      // nonce: '2726c7f26c',     // Will be added to script tag as 'nonce' attr
      enabled: true,
      debug: true, // Whether or not display console logs debugs (optional)
      loadScript: true, // Whether the GTM <script> tag should be added
      vueRouter: useRouter(), // Pass the router instance to automatically sync with router (optional)
      trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
    }),
  );
});
