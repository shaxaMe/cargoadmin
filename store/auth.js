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
    return { isLoggin, setUser, user,setLogin,token,set_token }
}, {
  persist:{
    storage:window.localStorage
  },
})

// base url
