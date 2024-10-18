// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: true },
  css:['primeicons/primeicons.css','../assets/scss/main.scss'],
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss'
  ],
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