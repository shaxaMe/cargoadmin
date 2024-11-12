import { useAuth } from '~/store/auth'; // Import the Pinia store

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth(); // Access the auth store
  const { isLoggin } = storeToRefs(auth);
  // If the user is not logged in, redirect to the login page
  if (!isLoggin) {
    return navigateTo('/login');
  }else{
    return navigateTo('/profile')
  }
});
