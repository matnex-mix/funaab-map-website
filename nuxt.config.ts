// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css',
    'bootstrap/dist/css/bootstrap.min.css'
  ],

  app: {
    header: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      title: 'FUNAAB Map'
    },
  },

  modules: [
    "@nuxtjs/leaflet",
    '@bootstrap-vue-next/nuxt',
    "nuxt-mongoose"
  ],

  bootstrapVueNext: {
    composables: true,
    directives: {all: true},
    css: true,
  },

  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {},
    modelsDir: 'models',
    devtools: true,
  },
})