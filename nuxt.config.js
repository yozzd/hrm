const pkg = require('./package');

module.exports = {
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    'iview/dist/styles/iview.css',
    '@/assets/css/main.css',
    '@/static/iconfont/iconfont.css',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/auth', '@/plugins/iview', '@/plugins/vue-the-mask'],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/apollo'],

  apollo: {
    clientConfigs: {
      default: '@/apollo/config/default.js',
      upload: '@/apollo/config/upload.js',
    },
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
