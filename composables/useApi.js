import { useAuth } from "~/store/auth";

export const useApi = (path, options = {}) => {  
  const authStore = useAuth();
  const { set_token, set_user } = authStore;
  const { token } = storeToRefs(authStore);  
  const router = useRouter();

  // Attach Authorization header if token is available
  if (token.value) { 
    options.headers = {
      ...useRequestHeaders(), 
      'Authorization': `Bearer ${token.value}`
    };
  }

  // Set the base URL
  options.baseURL = "https://api.furago.uz/web/api/";

  // Make API request
  return $fetch(path, {
    ...options,

    onResponse({ request, response }) {  
      // Handle 401 Unauthorized responses
      if (response.status === 401) {  
        set_token(null);
        set_user({});

        // Redirect if the request was for the profile
        // if (request.includes('profile')) {
          router.push('/login');  
        // }
      }
    }
  });
};
