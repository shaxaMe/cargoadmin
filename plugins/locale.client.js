import { useAuth } from "~/store/auth";
export default defineNuxtPlugin((nuxtApp) => {
   const {locale} = useAuth()
  // URL-dagi locale ni aniqlash
  const currentLocale = locale || 'en';

  // Lokalni sozlash
  nuxtApp.$i18n.setLocale(currentLocale);

  // LocalStorage'ga saqlash
  localStorage.setItem('locale', currentLocale);
});
