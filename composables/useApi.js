import { useAuth } from "~/store/auth";

export const useApi = async (path, options = {}) => {
  const authStore = useAuth();
  const { set_token, setUser } = authStore;
  const { token, refreshToken } = storeToRefs(authStore);
  const router = useRouter();

  const apiCall = async () => {
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
    try {
      return await $fetch(path, { ...options });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle 401 Unauthorized by attempting to refresh the token
        // return handle401Error();
      }
      throw error; // Rethrow if it's not a 401 error
    }
  };

  const handle401Error = async () => {
    try {
      // Refresh the token
      const refreshResponse = await $fetch('/v1/user/token/refresh', {
        method: 'POST',
        baseURL: "https://api.furago.uz/web/api/",
        headers: {
          ...useRequestHeaders(),
        },
        body: {
          refresh: refreshToken.value, // Use refresh token
        },
      });

      if (refreshResponse && refreshResponse.access) {
        // Update the token in the store
        set_token(refreshResponse.access);

        // Retry the original API call
        return await apiCall();
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (refreshError) {
      // Handle refresh token failure
      set_token(null);
      setUser({});
      router.push('/login');
      throw refreshError;
    }
  };

  return apiCall();
};
