import { defineNuxtPlugin } from '#app'
    import {YmapPlugin} from 'vue-yandex-maps'
    
    
    const settings = {
      apiKey: 'a1078e60-f7ec-4b02-9419-0e839bf3ef5b', // Индивидуальный ключ API
      // lang: 'ru_RU', // Используемый язык
      // coordorder: 'latlong', // Порядок задания географических координат
      // debug: false, // Режим отладки
      // version: '2.1' // Версия Я.Карт
    }
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.vueApp.use(YmapPlugin, settings)
    });