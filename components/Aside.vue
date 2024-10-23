<template>
  <div class="max-w-[220px] px-3 py-5 bg-white w-full h-full min-h-screen">
    <aside class="w-full h-full">
      <div class="w-full text-center text-[#202224] font-extrabold text-lg">
        <span class="text-[#4880FF]">Dash</span>Stack
      </div>
      <div class="pb-5 pt-6 flex px-2 flex-col items-center gap-4">
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl hidden group-hover:block group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF]">
            <Icon size="16px" name="mdi:desktop-mac-dashboard" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl hidden group-hover:block group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF]">
            <Icon size="16px" name="fa6-solid:truck-front" />
            <span> Products </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl hidden group-hover:block group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF]">
            <Icon size="16px" name="ic:outline-warehouse" />
            <span> Warehouse </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl hidden group-hover:block group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF]">
            <Icon size="16px" name="material-symbols:security" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl hidden group-hover:block group-hover:bg-[#4880FF] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#4880FF]">
            <Icon size="16px" name="hugeicons:customer-service-01" />
            <span> Dashboard </span>
          </div>
        </div>
        <div class="cursor-pointer group relative w-full gap-3 flex justify-start" @click="logOut">
          <span class="absolute -left-2 top-0 trans-custom  h-full rounded-xl hidden group-hover:block group-hover:bg-[#FF0000] w-1"></span>
          <div class="flex items-center gap-2 ml-3 trans-custom text-[#202224] text-base py-2 px-5 rounded-xl group-hover:text-white group-hover:bg-[#FF0000]">
            <Icon size="16px" name="circum:logout" />
            <span> Log out </span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useAuth } from '~/store/auth';
const {set_token,setUser,setLogin} = useAuth();
const router = useRouter();
function logOut(){
  setLogin(false);
  set_token(null);
  setUser({});
  router.push('/login')
}

</script>

<style lang="scss" scoped></style>
