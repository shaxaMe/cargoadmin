<template>
  <div>
    <div class="fixed top-0 left-0 z-30 bg-black/15  w-0 h-full" :class="{'trans-custom !w-full':toggleNav}">
      <div class="max-w-[250px] px-3 py-5 bg-gray-800 w-full h-full max-h-[100dvh] hidden" :class="{'!block':toggleNav}">
      <div class="flex w-full justify-end mb-5">
        <Icon name="material-symbols-light:cancel-outline-rounded" size="30px" @click="toggleNav=false" />
      </div>  
    <aside class="w-full h-fit  flex flex-col justify-start">
      <div class="w-full h-10 text-center text-white font-extrabold text-lg">
        <img src="../assets/images/FG1.png" class="w-full h-full object-cover" alt="">
        <!-- <span class="text-[#4880FF]">Fura</span>Go -->
      </div>
      <div class="pb-5 pt-6 flex px-2 flex-col items-center gap-4 navbar-mobile-item">
        <!-- <nuxt-link to="/profile" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="mingcute:profile-line" />
            <span> Profil </span>
          </div>
        </nuxt-link> -->
        <nuxt-link v-if="user?.role!='USER'" to="/autopark" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="fa6-solid:truck-front" />
            <span> {{ $t('aside.car_park') }} </span>
          </div>
        </nuxt-link>
        <nuxt-link to="/searchbar" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="hugeicons:maps" />
            <span> {{ user.role=="USER"?$t('aside.loads'):$t('aside.direction') }} </span>
          </div>
        </nuxt-link>
        <!-- <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="material-symbols:security" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="hugeicons:customer-service-01" />
            <span> Dashboard </span>
          </div>
        </div> -->
        <!-- <div class="cursor-pointer group relative w-full gap-3 flex justify-start" @click="logOut">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#FF0000] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-red-500 text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#FF0000] flex-1">
            <Icon size="18px" name="circum:logout" />
            <span> Log out </span>
          </div>
        </div> -->
      </div>
    </aside>
  </div>
    </div>
    <div class="max-w-[280px] px-3 py-5 bg-gray-800 text-white  w-full h-full max-lg:hidden">
    <aside class="w-full h-full flex flex-col justify-between gap-5">
      <div>
        <div class="w-full h-10 text-center text-white font-extrabold text-lg">
        <img src="../assets/images/FG1.png" class="w-full h-full object-cover" alt="">
        <!-- <span class="text-[#4880FF]">Fura</span>Go -->
      </div>
      <div class="pb-5 pt-6 flex px-2 flex-col items-center gap-4">
        <!-- <nuxt-link to="/profile" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="mingcute:profile-line" />
            <span> Profil </span>
          </div>
        </nuxt-link> -->
        <nuxt-link v-if="user?.role!='USER' && user.role!='OPERATOR'" :to="localePath('/autopark')" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="fa6-solid:truck-front" />
            <span> {{ $t('aside.car_park') }} </span>
          </div>
        </nuxt-link>
        <nuxt-link v-if="user.role!='OPERATOR'" :to="localePath('/searchbar')" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="hugeicons:maps" />
            <span> {{ user.role=="USER"?$t('aside.loads'):$t('aside.direction') }} </span>
          </div>
        </nuxt-link>
        

        <nuxt-link v-if="user.role=='OPERATOR'" :to="localePath('/user')" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="solar:user-id-outline" />
            <span> Foydalanuvchilar </span>
          </div>
        </nuxt-link>
        <nuxt-link v-if="user.role=='OPERATOR'" :to="localePath('/cars')" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="fa6-solid:truck-front" />
            <span> Mashinalar </span>
          </div>
        </nuxt-link>
        <nuxt-link :to="localePath('/orders')" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="material-symbols-light:remove-shopping-cart" />
            <span> Buyurtmalar </span>
          </div>
        </nuxt-link>
        <nuxt-link :to="localePath('/chats')" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="material-symbols:android-chat-outline" />
            <span> Xabarlar </span>
          </div>
        </nuxt-link>
        <!-- <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="material-symbols:security" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-white text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="hugeicons:customer-service-01" />
            <span> Dashboard </span>
          </div>
        </div> -->
        <!-- <div class="cursor-pointer group relative w-full gap-3 flex justify-start" @click="logOut">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#FF0000] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-red-500 text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#FF0000] flex-1">
            <Icon size="18px" name="circum:logout" />
            <span>Chiqish</span>
          </div>
        </div> -->
      </div>
      </div>
      <div class="border-t border-slate-400 p-4">
        <router-link to="/profile" class="flex items-center mb-4 hover:bg-slate-400 p-2 rounded-lg transition duration-200">
          <div  class="w-10 h-10 rounded-md overflow-hidden !bg-transparent">
            <img class="w-full h-full object-cover" src="../assets/images/profile.svg" alt="">
           </div>
          <div class="ml-3 !bg-transparent">
            <p class="font-medium line-clamp-1 text-white ">{{ user.full_name }}</p>
            <p class="text-sm text-gray-50">admin@example.com</p>
          </div>
        </router-link>
        <button 
          @click="logOut" 
          class="w-full py-2 rounded-xl px-4 text-white bg-red-600 hover:bg-red-700 transition duration-200 flex items-center justify-center"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>
          Выйти
        </button>
      </div>
    </aside>
  </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/store/auth';
const {set_token,setUser,setLogin,user} = useAuth();
const localePath = useLocalePath()
const router = useRouter();
const toggleNav = useState('toggleNav');
function logOut(){
  setLogin(false);
  set_token(null);
  setUser({});
  router.push('/login')
}

onMounted(()=>{
    let items = document.querySelectorAll('.navbar-mobile-item a');
    items.forEach(item => {
      item.addEventListener('click', () => {
        toggleNav.value = false;
      });
    });
})
</script>

<style lang="scss" scoped></style>
