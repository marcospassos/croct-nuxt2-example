export default {
  serverMiddleware: ['~/server-middleware/cid'],
  plugins: ['~/plugins/croct'],

  privateRuntimeConfig: {
    CROCT_API_KEY: process.env.CROCT_API_KEY || '0000000-0000-0000-0000-000000000000',
    BASE_URL: process.env.BASE_URL || 'http://localhost',
    CID_COOKIE_DOMAIN: process.env.CID_COOKIE_DOMAIN || 'localhost',
  },
  publicRuntimeConfig: {
    CROCT_APP_ID: process.env.CROCT_APP_ID || '0000000-0000-0000-0000-000000000000',
    CID_ASSIGNER_ENDPOINT_URL: process.env.CID_ASSIGNER_ENDPOINT_URL || 'http://localhost:3000/cid',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'croct-nuxt2-example',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}
