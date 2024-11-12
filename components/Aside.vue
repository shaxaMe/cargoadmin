<template>
  <div>
    <div class="fixed top-0 left-0 z-30 bg-black/15  w-0" :class="{'trans-custom !w-full':toggleNav}">
      <div class="max-w-[220px] px-3 py-5 bg-white w-full h-auto min-h-screen hidden" :class="{'!block':toggleNav}">
      <div class="flex w-full justify-end mb-5">
        <Icon name="material-symbols-light:cancel-outline-rounded" size="30px" @click="toggleNav=false" />
      </div>  
    <aside class="w-full h-full">
      <div class="w-full h-10 text-center text-[#202224] font-extrabold text-lg">
        <img src="../assets/images/FG1.png" class="w-full h-full object-cover" alt="">
        <!-- <span class="text-[#4880FF]">Fura</span>Go -->
      </div>
      <div class="pb-5 pt-6 flex px-2 flex-col items-center gap-4 navbar-mobile-item">
        <nuxt-link to="/profile" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="mingcute:profile-line" />
            <span> Profil </span>
          </div>
        </nuxt-link>
        <nuxt-link to="/autopark" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="fa6-solid:truck-front" />
            <span> Автопарк </span>
          </div>
        </nuxt-link>
        <nuxt-link to="/searchbar" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="ic:outline-warehouse" />
            <span> Ҳайдовчилар </span>
          </div>
        </nuxt-link>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="material-symbols:security" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="hugeicons:customer-service-01" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start" @click="logOut">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#FF0000] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-red-500 text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#FF0000] flex-1">
            <Icon size="18px" name="circum:logout" />
            <span> Log out </span>
          </div>
        </div>
      </div>
    </aside>
  </div>
    </div>
    <div class="max-w-[220px] px-3 py-5 bg-white w-full h-full min-h-screen max-lg:hidden">
    <aside class="w-full h-full">
      <div class="w-full h-10 text-center text-[#202224] font-extrabold text-lg">
        <img src="../assets/images/FG1.png" class="w-full h-full object-cover" alt="">
        <!-- <span class="text-[#4880FF]">Fura</span>Go -->
      </div>
      <div class="pb-5 pt-6 flex px-2 flex-col items-center gap-4">
        <nuxt-link to="/profile" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="mingcute:profile-line" />
            <span> Profil </span>
          </div>
        </nuxt-link>
        <nuxt-link to="/autopark" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="16px" name="fa6-solid:truck-front" />
            <span> Автопарк </span>
          </div>
        </nuxt-link>
        <nuxt-link to="/searchbar" class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="ic:outline-warehouse" />
            <span> Ҳайдовчилар </span>
          </div>
        </nuxt-link>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="material-symbols:security" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF] flex-1">
            <Icon size="18px" name="hugeicons:customer-service-01" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start" @click="logOut">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl opacity-0 group-hover:opacity-100 group-hover:bg-[#FF0000] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-red-500 text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#FF0000] flex-1">
            <Icon size="18px" name="circum:logout" />
            <span> Log out </span>
          </div>
        </div>
      </div>
    </aside>
  </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/store/auth';
const {set_token,setUser,setLogin} = useAuth();
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
