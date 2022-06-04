export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'withプラス|集中力測定アプリ',
    title: 'withプラス|集中力測定アプリ',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: 'withプラスは、集中力の測定ができるアプリケーションです。' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/assets/img/logo/logo_eco.png' },
      { rel: "stylesheet", type: "text/css", href: "https://use.fontawesome.com/releases/v5.6.1/css/all.css" },
    ],
    script: [
      { src: "/assets/js/libs/jquery-3.4.1.js" },
      { src: "/assets/js/libs/jquery.depend-1.1.7.js" },
      { src: "/assets/js/common.js" },      
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~static/assets/css/reset.css',
    '~static/assets/css/style.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/adobe-fonts.js',
    '~plugins/moment-filter.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'ja',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: { disable: true },
  },
  axios: {
    proxy: true,
  },

  proxy: {
    '/api/': {
      target: 'https://asia-northeast1-with-c-web.cloudfunctions.net',
      pathRewrite: {'^/api/': '/'}
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
