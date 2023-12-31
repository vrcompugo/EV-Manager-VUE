
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Energie360',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Uploader' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#1976D2' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dateFormat.js',
    '~/plugins/formatNumber.js',
    { src: '~/plugins/ckeditor', mode: 'client' },
    '~/plugins/dateTimePicker',
    '~/plugins/confirmDialog'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/pwa',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    'simple-code-editor/nuxt'
  ],

  router: {
    base: '/vue/',
    middleware: ['auth']
  },
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: "#AD1457",
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c'
        }
      }
    }
  },
  env: {
    baseUrl: process.env.API_URL || 'https://api.korbacher-energiezentrum.de/'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_URL || 'https://api.korbacher-energiezentrum.de/'
  },
  /*
  ** Auth module configuration
  ** See https://auth.nuxtjs.org/guide/setup.html
  */
  auth: {
    rewriteRedirects: false,
    strategies: {
      local: {
        _scheme: '~/plugins/token-auth.js',
        endpoints: {
          user: { url: '/auth/refresh', method: 'post', propertyName: 'data' }
        },
        globalToken: true
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },

  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
