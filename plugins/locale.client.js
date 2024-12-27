import { useAuth } from "~/store/auth";
export default defineNuxtPlugin((nuxtApp) => {
   const {locale} = useAuth();
   const localStorageLocale = localStorage.getItem('locale');
  // URL-dagi locale ni aniqlash
  const currentLocale = localStorageLocale || locale;

  // Lokalni sozlash
  nuxtApp.$i18n.setLocale(currentLocale);

  // LocalStorage'ga saqlash
  localStorage.setItem('locale', currentLocale);
});
