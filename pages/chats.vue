<template>
  <section class="w-full flex justify-center py-6 px-4 z-0">
    <div class="bg-white w-full h-full px-5 rounded-md py-5">
      <!-- <h1 class="text-3xl">
        Xabarlar
        
      </h1> -->
      <span
          class="bg-gray-100 px-2 py-1 rounded-lg text-blue-500 text-sm font-bold"
          >Xabarlar</span
        >
      <div class="w-full flex min-h-[70dvh] border-2 rounded-lg mt-4">
        <div class="flex-1 max-w-[300px] border-r-2 p-2">
          <IconField class="w-full">
            <InputIcon class="pi pi-search" />
            <InputText class="w-full" v-model="value1" placeholder="Search" />
          </IconField>
          <div class="py-2 flex flex-col gap-1 justify-start items-stretch max-h-[70dvh] overflow-y-auto">
              <div v-for="item in 15" class="w-full flex items-center py-2 px-3 cursor-pointer group trans-custom hover:bg-[#5715B0] rounded-xl">
                  <div class="w-10 h-10 overflow-hidden rounded-full ">
                    <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800" alt="">
                  </div>
                  <div class="flex flex-col pl-2 group-hover:text-white">
                    <p class="text-lg">Jon Sena</p>
                  </div>
              </div>
          </div>
        </div>
        <div class="flex-1">
           <div class="w-full h-full flex items-center flex-col justify-center">
                 <img src="../assets/images/empty.png" alt="empty">
                 <div>
                    <p>Hech qanday xabar tanlanmagan</p>
                 </div>
           </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup></script>

<style>
.animated-message {
  transition: all 3.5s ease;
  animation: replay 3.5s forwards;
}

@keyframes replay {
  0% {
    background: rgba(202, 240, 192, 0.5);
    /* background: linear-gradient(90deg, rgba(0,149,255,1) 0%, rgba(0,149,255,1) 0%, rgba(0,230,26,0.47942927170868344) 0%, rgba(9,255,0,0.3533788515406162) 100%); */
  }

  100% {
    background: none;
  }
}
</style>
