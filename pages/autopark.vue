<template>
    <div class="px-5 py-6">
      <div class="flex justify-end mb-5">
         <button @click="isOpen=true" class="bg-[#3b72f1] gap-2 text-white flex justify-center items-center text-center px-6 py-4 rounded-lg">
          <Icon size="20px" name="material-symbols:person-add-rounded" />
          <span>avtomobil qo'shish</span>
         </button>
      </div>
      <div class="card overflow-hidden rounded-lg" v-if="1==2">
        <DataTable :value="customers" stripedRows paginator :rows="5" :rowsPerPageOptions="false" tableStyle="min-width: 50rem">
            <Column field="first_name" header="Haydovchi ismi"  sortable style="width: 25%"></Column>
            <Column field="car_name" header="Moshina turi" sortable style="width: 25%"></Column>
            <Column field="car_num" header="Sanasi" sortable style="width: 25%"></Column>
            <Column field="expired_date" header="Representative" sortable style="width: 25%"></Column>
        </DataTable>
    </div>
    <AutoparkCard />
    <Modal v-model="isOpen">
      <div class="flex items-center gap-5">
        <div class="flex-1 flex flex-col">
        <label for="username" class="font-semibold mb-2">Transport turi</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex-1 flex flex-col">
        <label for="email" class="font-semibold mb-2">Kuzov turi</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      </div>
      <div class="flex items-center gap-5 mt-5">
        <div class="flex-1 flex flex-col">
        <label for="username" class="font-semibold mb-2">Yuk ko’tarish vazni (t)</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex-1 flex flex-col">
        <label for="email" class="font-semibold mb-2">Yuk olish hajmi (m3)</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex-1 flex flex-col">
        <label for="email" class="font-semibold mb-2">Yuklash yo’nalishlari</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      </div>
      <div class="mt-6">
        <h1 class="p-dialog-title">Texnik xarakteristikalar</h1>
        <div class="flex items-center gap-5 mt-5">
        <div class="flex-1 flex flex-col">
        <label for="username" class="font-semibold mb-2">Davlat raqami</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex-1 flex flex-col">
        <label for="email" class="font-semibold mb-2">Modeli</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex-1 flex flex-col">
        <label for="email" class="font-semibold mb-2">Yili</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      </div>
      <div class="flex items-center gap-5 mt-5">
        <div class="flex-1 flex flex-col">
        <label for="username" class="font-semibold mb-2">Tex pasport seriya va raqami</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex-1 flex flex-col">
        <label for="email" class="font-semibold mb-2">Old rasmi</label>
        <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-start gap-1">
            <Icon name="ri:upload-cloud-2-fill" size="24px" />
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
      </div>
      <div class="flex-1 flex flex-col">
        <label for="email" class="font-semibold mb-2">Orqa rasmi</label>
        <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-start gap-1">
            <Icon name="ri:upload-cloud-2-fill" size="24px" />
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
      </div>
      </div>
      </div>
    </Modal>
    </div>
</template>

<script setup>
let isOpen = ref(false);
const customers = ref(
  [{
  "id": 1,
  "first_name": "Isa",
  "car_name": "Sienna",
  "car_num": 1999,
  "expired_date": "3/18/2024"
}, {
  "id": 2,
  "first_name": "Albina",
  "car_name": "Miata MX-5",
  "car_num": 2002,
  "expired_date": "2/15/2024"
}, {
  "id": 3,
  "first_name": "Joyann",
  "car_name": "1500",
  "car_num": 1994,
  "expired_date": "7/22/2024"
}, {
  "id": 4,
  "first_name": "Colman",
  "car_name": "G35",
  "car_num": 2007,
  "expired_date": "6/20/2024"
}, {
  "id": 5,
  "first_name": "Phoebe",
  "car_name": "Aerostar",
  "car_num": 1988,
  "expired_date": "2/15/2024"
}, {
  "id": 6,
  "first_name": "Trula",
  "car_name": "Ram 1500 Club",
  "car_num": 1997,
  "expired_date": "2/19/2024"
}, {
  "id": 7,
  "first_name": "Ketti",
  "car_name": "F350",
  "car_num": 2007,
  "expired_date": "1/22/2024"
}, {
  "id": 8,
  "first_name": "Madelon",
  "car_name": "Sierra 3500",
  "car_num": 2004,
  "expired_date": "12/3/2023"
}, {
  "id": 9,
  "first_name": "Matthias",
  "car_name": "Suburban 1500",
  "car_num": 1995,
  "expired_date": "1/12/2024"
}, {
  "id": 10,
  "first_name": "Donica",
  "car_name": "Land Cruiser",
  "car_num": 2009,
  "expired_date": "12/31/2023"
}]

);
</script>

<style lang="scss" scoped>

</style>