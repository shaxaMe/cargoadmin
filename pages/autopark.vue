<template>
  <div class="px-5 py-6">
    <Toast />
    <div class="flex justify-end mb-5">
      <button
        @click="isOpen = true"
        class="bg-[#3b72f1] gap-2 text-white flex justify-center items-center text-center px-6 py-4 rounded-lg"
      >
        <Icon size="20px" name="material-symbols:person-add-rounded" />
        <span>avtomobil qo'shish
        </span>
      </button>
    </div>
    <div class="card overflow-hidden rounded-lg" v-if="1 == 2">
      <DataTable
        :value="customers"
        stripedRows
        paginator
        :rows="5"
        :rowsPerPageOptions="false"
        tableStyle="min-width: 50rem"
      >
        <Column
          field="first_name"
          header="Haydovchi ismi"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="car_name"
          header="Moshina turi"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="car_num"
          header="Sanasi"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="expired_date"
          header="Representative"
          sortable
          style="width: 25%"
        ></Column>
      </DataTable>
    </div>
    <div v-if="!loading">
      <AutoparkCard @UpdateData="_update" class="my-2" v-for="(item,i) in results" :cardData="item" :key="`cadr${i}`"  />
    </div>
    <Modal v-model="isOpen" @_save="_save">
      <div class="flex items-center gap-5">
        <div class="flex-1 flex flex-col">
          <label for="username" class="font-semibold mb-2"
            >Transport turi</label
          >
          <Select
            v-model="formData.type"
            :options="options.vehicle_type"
            :invalid="$v.type.$error"
            optionLabel="name"
            optionValue="id"
            class="w-full text-sm"
          />
        </div>
        <div class="flex-1 flex flex-col">
          <label for="email" class="font-semibold mb-2">Kuzov turi</label>
          <Select
            v-model="formData.truck_body"
            :options="options.truck_type_parametr"
            :invalid="$v.truck_type_parametr.$error"
            optionLabel="name"
            optionValue="id"
            class="w-full text-sm"
          />
        </div>
      </div>
      <div class="flex items-center gap-5 mt-5">
        <div class="flex-1 flex flex-col">
          <label for="username" class="font-semibold mb-2"
            >Yuk ko’tarish vazni (t)</label
          >
          <InputNumber v-model="formData.weight" :invalid="$v.weight.$error" id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex-1 flex flex-col">
          <label for="email" class="font-semibold mb-2"
            >Yuk olish hajmi (m3)</label
          >
          <InputNumber v-model="formData.volume" :invalid="$v.volume.$error" id="email" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex-1 flex flex-col">
          <label for="email" class="font-semibold mb-2"
            >Yuklash yo’nalishlari</label
          >
          <MultiSelect
            v-model="formData.loading_type"
            :options="options.truck_load_type"
            optionLabel="name"
            optionValue="id"
            :invalid="$v.loading_type.$error" 
            class="w-full text-sm"
          />
        </div>
      </div>
      <div class="mt-6">
        <h1 class="p-dialog-title">Texnik xarakteristikalar</h1>
        <div class="grid grid-cols-3 items-center gap-5 mt-5">
          <div class="flex-1 flex flex-col">
            <label for="username" class="font-semibold mb-2"
              >Davlat raqami</label
            >
            <InputText id="username" :invalid="$v.document.license_plate.$error" v-model="formData.document.license_plate" class="flex-auto" autocomplete="off" />
          </div>
          <div class="flex-1 flex flex-col">
            <label for="email" class="font-semibold mb-2">Modeli</label>
            <InputText v-model="formData.document.model" :invalid="$v.document.model.$error" id="email" class="flex-auto" autocomplete="off" />
          </div>
          <div class="flex-1 flex flex-col">
          <label for="email" class="font-semibold mb-2"
            >Yoqilg'i turi</label
          >
          <MultiSelect
            v-model="formData.document.fuel_type"
            :options="options.fuel_type"
            :invalid="$v.document.fuel_type.$error"
            optionLabel="name"
            optionValue="id"
            class="w-full text-sm"
          />
        </div>
          <div class="flex-1 flex flex-col">
            <label for="email" class="font-semibold mb-2">Yili</label>
            <!-- <InputText id="email" class="flex-auto" autocomplete="off" /> -->
            <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="formData.document.ayear"
            :invalid="$v.document.ayear.$error"
            view="year" 
            dateFormat="yy"
          />
          </div>
        </div>
        <div class="flex items-start flex-col gap-5 mt-5">
          <div class="flex flex-col">
            <label for="username" class="font-semibold mb-2"
              >Tex pasport seriya va raqami</label
            >
            <InputText v-model="formData.document.serial" :invalid="$v.document.serial.$error" id="username" class="flex-auto" autocomplete="off" />
          </div>
          <div class="flex-1 flex items-stretch gap-5 w-full">
            <div class="flex-1 flex flex-col max-w-[300px]">
              <label for="email" class="font-semibold mb-2">Old rasmi</label>
              <!-- <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-start gap-1">
            <Icon name="ri:upload-cloud-2-fill" size="24px" />
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button> -->
              <button
                class="bg-white overflow-hidden h-[150px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
              >
              <div class="flex flex-col items-center gap-6" v-show="!formData.document.main_file">
                  <Icon name="uil:plus-circle" size="34px" />
                  <!--  -->
                  <input
                    id="main_file"
                    type="file"
                    ref="main_file"
                    @change="previewImage($event, 'main_file')"
                    class="opacity-0 cursor-pointer absolute w-full h-full z-10"
                  />
                </div>
                <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="formData.document.main_file"
            >
              <img
                :src="formData.document.main_file"
                class="w-full h-full object-cover"
                alt="main file"
              />
              <div
                @click="_deleteImg('main_file')"
                class="p-4 bg-red-100 cursor-pointer rounded-full flex justify-center items-center absolute z-10 translate-y-[400%] trans-delete group-hover:translate-y-0"
              >
                <Icon
                  name="material-symbols:delete-outline"
                  size="24px"
                  class="text-red-400"
                />
              </div>
            </div>
              </button>
            </div>
            <div class="flex-1 flex flex-col max-w-[300px]">
              <label for="email" class="font-semibold mb-2">Orqa rasmi</label>
              <!-- <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-start gap-1">
            <Icon name="ri:upload-cloud-2-fill" size="24px" />
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button> -->
              <button
                class="bg-white overflow-hidden h-[150px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
              >
                <div class="flex flex-col items-center gap-6" v-show="!formData.document.back_file">
                  <Icon name="uil:plus-circle" size="34px" />
                  <input
                    id="back_file"
                    type="file"
                    ref="back_file"
                    @change="previewImage($event, 'back_file')"
                    class="opacity-0 cursor-pointer absolute w-full h-full z-10"
                  />
                </div>
                <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="formData.document.back_file"
            >
              <img
                :src="formData.document.back_file"
                class="w-full h-full object-cover"
                alt="back file"
              />
              <div
                @click="_deleteImg('back_file')"
                class="p-4 bg-red-100 cursor-pointer rounded-full flex justify-center items-center absolute z-10 translate-y-[400%] trans-delete group-hover:translate-y-0"
              >
                <Icon
                  name="material-symbols:delete-outline"
                  size="24px"
                  class="text-red-400"
                />
              </div>
            </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-5 mt-5">
        <div class="flex-1 flex flex-col max-w-[380px]">
          <label for="username" class="font-semibold mb-2"
            >Haydovchi biriktirish</label
          >
          <!-- <InputText id="username" class="flex-auto" autocomplete="off" /> -->
          <Select
            v-model="selectedCity"
            :options="cities"
            optionLabel="name"
            optionValue="code"
            class="w-full text-sm"
          />
        </div>
      </div>
      <div class="my-4">
        <label class="font-semibold my-2">Transport rasmlari</label>
        <div
          class="w-full border border-dashed border-blue-400 px-4 py-3 rounded-md mt-5"
        >
          <div class="flex-1 grid grid-cols-4 gap-2">
            <div
            class="w-40 h-40 border border-blue-400 rounded-md flex justify-center relative items-center cursor-pointer"
          >
            <Icon
              name="material-symbols:photo-camera-outline"
              class="text-blue-400"
              size="34px"
            />
            <input
              type="file"
              ref="imagesInput"
              :disabled="formData.images.length>=5"
              id="multiple"
              @change="previewImage($event,'multiple')"
              class="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-0"
            />
          </div>
           <div class="w-full h-40 overflow-hidden rounded-md group relative flex justify-center items-center" v-for="(item,i) in formData.images" v-if="formData.images && formData.images.length>0">
            <img class="w-full h-full" :src="item.image" alt="fff">
            <div
                @click="_deleteImg('multiple'),i"
                class="p-4 bg-red-100 cursor-pointer rounded-full flex justify-center items-center absolute z-10 translate-y-[400%] trans-delete group-hover:translate-y-0"
              >
                <Icon
                  name="material-symbols:delete-outline"
                  size="24px"
                  class="text-red-400"
                />
              </div>
           </div>
        </div>
        </div>
      </div>
    </Modal>
    <div v-if="loading" class="fixed w-screen h-screen top-0 left-0 backdrop-blur-sm bg-white/10 flex justify-center items-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
  </div>
</template>

<script setup>
import { useOption } from '../store/option';
import { useToast } from "primevue/usetoast";
import { format } from "date-fns";
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
const toast = useToast();
let isOpen = ref(false);
const selectedCity = ref();
let loading = ref(true);
const imagesInput = ref(null);
const {options} = useOption();
const results = ref([])
const cities = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);
const customers = ref([
  {
    id: 1,
    first_name: "Isa",
    car_name: "Sienna",
    car_num: 1999,
    expired_date: "3/18/2024",
  },
  {
    id: 2,
    first_name: "Albina",
    car_name: "Miata MX-5",
    car_num: 2002,
    expired_date: "2/15/2024",
  },
  {
    id: 3,
    first_name: "Joyann",
    car_name: "1500",
    car_num: 1994,
    expired_date: "7/22/2024",
  },
  {
    id: 4,
    first_name: "Colman",
    car_name: "G35",
    car_num: 2007,
    expired_date: "6/20/2024",
  },
  {
    id: 5,
    first_name: "Phoebe",
    car_name: "Aerostar",
    car_num: 1988,
    expired_date: "2/15/2024",
  },
  {
    id: 6,
    first_name: "Trula",
    car_name: "Ram 1500 Club",
    car_num: 1997,
    expired_date: "2/19/2024",
  },
  {
    id: 7,
    first_name: "Ketti",
    car_name: "F350",
    car_num: 2007,
    expired_date: "1/22/2024",
  },
  {
    id: 8,
    first_name: "Madelon",
    car_name: "Sierra 3500",
    car_num: 2004,
    expired_date: "12/3/2023",
  },
  {
    id: 9,
    first_name: "Matthias",
    car_name: "Suburban 1500",
    car_num: 1995,
    expired_date: "1/12/2024",
  },
  {
    id: 10,
    first_name: "Donica",
    car_name: "Land Cruiser",
    car_num: 2009,
    expired_date: "12/31/2023",
  },
]);
const formData = reactive({
  type: '1',
  truck_body: 2,
  weight: null,
  volume: null,
  loading_type: null,
  truck_body_parameter: [5],
  note: "This is a test vehicle",
  main_driver: 1,
  images: [],
  document: {
    color: 1,
    license_plate: null,
    model: null,
    ayear: null,
    fuel_type: null,
    serial: null,
    main_file: null,
    back_file: null,
    driver: 1,
  },
});

const rules = {
      type: { required },
      truck_body: { required },
      weight: { required, },
      volume: { required, },
      loading_type: { required },
      truck_type_parametr: { required },
      note: { required },
      main_driver: { required },
      document: {
        license_plate: { required },
        model: { required },
        ayear: { required },
        fuel_type: { required },
        serial: { required },
      },
}

const $v = useVuelidate(rules, formData);
//methods
function _deleteImg(key,ind) {
  if(key != 'multiple'){
    let el = document.querySelector(`#${key}`);
    el.value = "";
    formData.document[key] = null;
  }else{
    formData.images.splice(ind,1);
  }
}
function previewImage(e, key) {
  const obj = e.target.files[0];
if (obj) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const base64String = event.target.result;

        // Create an offscreen canvas to render the image in JPEG format
        const image = new Image();
        image.src = base64String;

        image.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);

            // Convert canvas to JPEG Base64 format
            const jpegBase64String = canvas.toDataURL('image/jpeg', 0.9); // 0.9 for quality setting (1 is max)

            // Store the JPEG Base64 string in imgUrls
            if(key!='multiple') {
              formData.document[key] = jpegBase64String;
            }else{
              formData.images.push({image:jpegBase64String});
            }
        };
    };

    reader.onerror = function(error) {
        console.error("Error converting file to Base64:", error);
    };

    reader.readAsDataURL(obj);  // Convert file to Base64
}
}
function timeFormatter(date) {
  return format(new Date(date), "yyyy");
}

function getVihicle(){
  useApi('/v1/driver/vehicles',{
    method: 'GET',
  }).then((res)=>{
    results.value = res.results;
    loading.value = false;
  }).catch((error)=>{
    toast.add({
      severity: "error",
      summary: "Xəta",
      detail: "Serverda xatolik",
      life: 3000,
    });
    loading.value = false;
  }).finally(()=>{
    loading.value = false;
  })
}

function _save(){
  $v.value.$touch();
  const result = $v.value.$validate();
  result.then((res)=>{
    if(!!res){
      formData.document.ayear = timeFormatter(formData.document.ayear);
      useApi('/v1/driver/vehicle',{
        method: 'POST',
        body: formData,
      }).then((res)=>{
        isOpen.value = false;
        getVihicle()
        toast.add({
          severity: "success",
          summary: "Muvaffaqiyatli",
          detail: "Malumotlar saqlandi",
          life: 3000,
        });
      }).catch((e)=>{
        toast.add({
          severity: "error",
          summary: "Xəta",
          detail: "Serverda xatolik",
          life: 3000,
        });
      })
    }
  })
}
function _update(){
  getVihicle()
}
onMounted(()=>{
  getVihicle()
})
</script>

<style lang="scss" scoped></style>
