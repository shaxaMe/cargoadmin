import { useAuth } from '~/store/auth'; // Import the Pinia store

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth(); // Access the auth store
  const { isLoggin,user } = storeToRefs(auth);
  // If the user is not logged in, redirect to the login page
  if (!isLoggin) {
    return navigateTo('/login');
  }else{
    let url = user.value.role == 'USER'?'/searchbar':'/autopark';
    console.log(url,user.value);
    return navigateTo(url);
  }
});
