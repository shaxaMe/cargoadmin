<script setup>
import { useAuth } from "~/store/auth";
import { useToast } from "primevue/usetoast";
import AuthImg from "~/assets/images/auth-img.png";
definePageMeta({
  layout: "LoginLayout",
});

//data
const user_type = ref("");
const Isnext = ref(false);


//methods
function restart(){
  Isnext.value = false;
  user_type.value = "";
}

provide('restart', restart)


</script>

<template>
  <div class="flex justify-end" style="max-width: 1920px; margin: 0 auto">
    <Toast />
    <div class="flex-1 bg-slate-50">
      <img class="w-full h-full" :src="AuthImg" alt="logo" />
    </div>
    <div
      class="flex-1 bg-gray-100 font-[sans-serif] h-full md:min-h-screen p-4 min-w-[700px] mx-auto flex flex-col items-center justify-center"
    >
    <h1 class="text-3xl my-6 font-bold " v-if="!Isnext">Profilingizni tanlang</h1>
    <div v-if="!Isnext" class="bg-white rounded-2xl p-6 relative z-10 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)] max-w-[650px]">
       <div @click="user_type='user'"  class="border cursor-pointer w-full border-gray-500 py-4 px-3 transition duration-300 ease-linear rounded-2xl hover:bg-[rgba(73,100,216,.1)] flex items-center justify-between gap-2 group hover:border-[#4964D8]">
           <div class="flex items-center gap-4">
            <div class="group-hover:text-[#4964D8] text-gray-500">
            <Icon size="35px" name="solar:user-circle-linear" />
           </div>
           <div>
            <p class="text-lg m-0 group-hover:text-[rgba(73,100,216,1)]">User</p>
            <span class="text-sm text-gray-500 group-hover:text-[rgba(73,100,216,1)]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum, illo.</span>
           </div>
           </div>
           <div class="p-2 rounded-full bg-gray-500/25" :class="{'!bg-[#4964D8]':user_type=='user'}">

           </div>
       </div>
       <div @click="user_type='admin'" class="border cursor-pointer w-full mt-4 border-gray-500 py-4 px-3 transition duration-300 ease-linear rounded-2xl hover:bg-[rgba(73,100,216,.1)] flex items-center justify-between gap-2 group hover:border-[#4964D8]">
           <div class="flex items-center gap-4">
            <div class="group-hover:text-[#4964D8] text-gray-500">
            <Icon size="35px" name="mdi:shield-account" />
           </div>
           <div>
            <p class="text-lg m-0 group-hover:text-[rgba(73,100,216,1)]">Admin</p>
            <span class="text-sm text-gray-500 group-hover:text-[rgba(73,100,216,1)]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum, illo.</span>
           </div>
           </div>
           <div class="p-2 rounded-full bg-gray-500/25" :class="{'!bg-[#4964D8]':user_type=='admin'}">

           </div>
       </div>
       <div class="mt-12">
        <button @click="Isnext=true"
              type="button"
              class="w-full disabled:cursor-not-allowed disabled:opacity-60 py-2.5 px-4 text-sm font-semibold tracking-wider rounded-md text-white bg-[#4964D8] hover:bg-blue-700 focus:outline-none"
            >
              Next
            </button>
       </div>
    </div>
      <LoginUser v-if="!!Isnext&& user_type=='user'" />
      <LoginAdmin v-if="!!Isnext && user_type=='admin'"  />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
