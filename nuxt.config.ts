// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';
import locales from './locales'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: true },
  css:['primeicons/primeicons.css','../assets/scss/main.scss'],
  plugins:['~/plugins/vmask.js','~/plugins/peristit.ts','~/plugins/validate.js', { src: '~/plugins/ymap.js', mode: 'client' },],
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    // 'vue-yandex-maps/nuxt'
  ],
  // i18n: {
  //   vueI18n: './i18n.config.ts',
  //    // if you are using custom path, default
  // },
  // yandexMaps:{
  //     apikey:"a1078e60-f7ec-4b02-9419-0e839bf3ef5b"
  // },
  i18n: {
    lazy: true,
    langDir: 'locales',
    locales,
    defaultLocale: 'uz',
    detectBrowserLanguage: false,
    strategy: 'prefix_and_default',
  },
  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: true,
  },
  primevue: {
  options: {
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: 'darkMode',
        cssLayer: false
      }
    }
  }
}
})