export const useAuth = defineStore('auth', () => {
    const isLoggin = ref(false);
    const user = ref({})
    const token = ref(null)
    function setUser(payload) {
        user.value = payload
    }
    function setLogin(payload){
        isLoggin.value = payload
    }
    function set_token(payload){
      token.value = payload
    }
    function logout() {
      user.value = null;
      token.value = null;
      isLoggin.value = false;
    }
    return { isLoggin, setUser, user,setLogin,token,set_token,logout }
}, {
  persist:{
    storage:window.localStorage
  },
})

// base url
