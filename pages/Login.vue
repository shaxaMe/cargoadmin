<script setup>
import AuthImg from "~/assets/images/auth-img.png";
import Logo from "../public/FG1.png"
definePageMeta({
  layout: "LoginLayout",
});

//data


//methods



</script>

<template>
  <div class="flex justify-end max-lg:justify-center items-center max-lg:max-w-full max-lg:px-4">
    <Toast />
    <div class="flex-1 bg-slate-50 max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full h-screen">
      <img class="w-full h-full" :src="AuthImg" alt="logo" />
    </div>
    <div
      class="bg-gray-100 font-[sans-serif] flex-1 h-full max-lg:min-h-screen p-4 mx-auto max-md:w-full flex flex-col items-center justify-center"
    >
   <div class="max-w-[800px] w-full mx-auto">
    <div class="max-w-40 h-20">
     <img :src="Logo" alt="logo">
   </div>
    <div class="bg-white w-full rounded-2xl p-6 relative z-10 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
      <LoginUser />
    </div>
   </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
