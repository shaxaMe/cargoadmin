<script setup>
const selectedCities = ref();
const date = ref(null);
const isOpen = ref(false);
const cities = ref([
    { name: 'A', code: 'A' },
    { name: 'B', code: 'B' },
    { name: 'C', code: 'C' },
    { name: 'D', code: 'D' },
    { name: 'E', code: 'E' }
]);
</script>
<template>
  <div class="px-5 py-6">
    <div>
      <h1 class="text-xl">Haydovchi profili</h1>
      <div class="form-container max-w-[500px] mt-5 flex items-center gap-10">
        <div class="flex-1">
          <FloatLabel variant="on">
          <InputText
            class="w-full"
            id="full_name"
          />
          <label for="full_name">Ism familiya,otasini ismi</label>
        </FloatLabel>
        <FloatLabel variant="on" class="mt-3">
          <InputText
            class="w-full"
            id="full_name"
          />
          <label for="full_name">Telefon raqam</label>
        </FloatLabel>
        </div>
        <div class="w-24 h-24 bg-gray-400 rounded-full flex justify-center items-center relative cursor-pointer">
            <input class="opacity-0 absolute w-full h-full z-10" type="file">
            <Icon name="uil:image-plus" class="text-white" size="40px" />
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h1 class="text-xl">Passport malumotlari</h1>
      <div class="form-container w-full grid grid-cols-5 mt-5 max-lg:grid-cols-3 max-md:grid-cols-1 items-stretch gap-5">
          <FloatLabel variant="on">
          <InputText
            class="w-full"
            id="full_name"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <div>
          <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button class="bg-white  min-h-[40px] relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport orqa rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button @click="isOpen=true" v-if="!isOpen" class="bg-white min-h-[40px] border-dashed relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            хорижий паспортни киритиш 
            <!-- <input type="file"  class="opacity-0 absolute w-full h-full z-10" /> -->
          </button>
          <button @click="isOpen=false" v-if="!!isOpen" class="bg-white min-h-[40px] border-dashed relative w-full border border-red-400 px-6 text-red-400 rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="solar:minus-circle-outline" size="24px" />
            horijiy passportni o'chirish 
            <!-- <input type="file"  class="opacity-0 absolute w-full h-full z-10" /> -->
          </button>
        </div>
      </div>
    </div>
    <div class="mt-5" v-if="!!isOpen">
      <h1 class="text-xl">Horijiy pasportni malumotlari</h1>
      <div class="form-container w-full grid grid-cols-5 mt-5  max-lg:grid-cols-3 max-md:grid-cols-1 items-stretch gap-5">
          <FloatLabel variant="on">
          <InputText
            class="w-full"
            id="full_name"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <div>
          <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button class="bg-white  min-h-[40px] relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport orqa rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h1 class="text-xl">Haydovchilik guvohnomasi</h1>
      <div class="form-container w-full grid grid-cols-4 mt-5 max-lg:grid-cols-3 max-md:grid-cols-1 items-stretch gap-5">
          <FloatLabel variant="on">
          <InputText
            class="w-full"
            id="full_name"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <MultiSelect v-model="selectedCities" :options="cities" optionLabel="name"
             class="w-full" />
          <label for="full_name">Kategoriyalar</label>
        </FloatLabel>
        <div>
          <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Guvohnoma rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button class="bg-white  min-h-[40px] relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Guvohnoma orqa rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
