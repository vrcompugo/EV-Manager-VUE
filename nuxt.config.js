
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/ckeditor', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth'
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
