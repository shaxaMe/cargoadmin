<script setup>
import { format } from 'date-fns';
//data
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

const formValues = reactive({});
const passport_main_file = ref(null);
const passport_back_file = ref(null);
const foreginpassport_main_file = ref(null);
const foreginpassport_back_file = ref(null);
const foreginpassportData = reactive({
  expired_date: '',
  given_date: '',
  serial: '',
})
const passportData = reactive({
  expired_date: '',
  given_date: '',
  serial: '',
})
const driver_pass = reactive({
   
})
const img_url = ref(null);
//methods
function _focus() {
  if (!formValues.phone) {
    formValues.phone = "+998 ";
  }
}
function timeFormatter(date){
 return  format(new Date(date), 'yyyy-MM-dd')
}
function getUserProfile() {
     useApi('/v1/user/info').then((response) => {
      if(response){
        for(let i in response){
          formValues[i] = response[i];
        }
      }
       console.log(response);
     })
}
function _save(img){
  formValues.photo = img;
}
function saveForeignPassport(){
  const data = new FormData();
  data.append('expired_date', timeFormatter(foreginpassportData.expired_date));
  data.append('given_date', timeFormatter(foreginpassportData.given_date));
  data.append('serial', foreginpassportData.serial.replaceAll(' ', ''));
  data.append('main_file', foreginpassport_main_file.value.files[0]);
  data.append('back_file', foreginpassport_back_file.value.files[0]);
  data.append('type','foreign_passport');
   useApi('/v1/user/document', {method:'POST',body:data}).then((response) => {
      console.log(response);
   })
}
function savePassport(){
  const data = new FormData();
  data.append('expired_date', timeFormatter(passportData.expired_date));
  data.append('given_date', timeFormatter(passportData.given_date));
  data.append('serial', passportData.serial.replaceAll(' ', ''));
  data.append('main_file', passport_main_file.value.files[0]);
  data.append('back_file', passport_back_file.value.files[0]);
  data.append('type','passport');
   useApi('/v1/user/document', {method:'POST',body:data}).then((response) => {
      console.log(response);
   })
}
//actins

onMounted(()=>{
  getUserProfile();
})
</script>
<template>
  <div class="px-5 py-6">
    <div>
      <h1 class="text-xl">Haydovchi profili</h1>
      <div class="form-container max-w-[500px] mt-5 flex items-center gap-10">
        <div class="flex-1">
          <FloatLabel variant="on">
          <InputText
            class="w-full h-full"
            id="full_name"
            v-model="formValues.full_name"
          />
          <label for="full_name">Ism familiya,otasini ismi</label>
        </FloatLabel>
        <FloatLabel variant="on" class="mt-3">
          <InputText
            class="w-full h-full"
            id="full_name"
            v-mask="'+998 ## ### ## ##'"
            v-model="formValues.phone"
            @focus="_focus"
          />
          <label for="full_name">Telefon raqam</label>
        </FloatLabel>
        </div>
        <div class="w-24 h-24 bg-gray-400 rounded-full flex justify-center items-center relative cursor-pointer overflow-hidden shadow-md">
            <div v-if="!formValues.photo"> 
            <Icon name="uil:image-plus" class="text-white" size="40px" />
            </div>
            <ProfileImage @save="_save" />
            <!-- <input @change="_uploadImage" class="opacity-0 absolute w-full h-24 z-10" type="file"> -->
            <img :src="formValues.photo" v-if="formValues.photo" alt="Passport" class="w-full h-full object-cover cursor-pointer" />
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h1 class="text-xl">Passport malumotlari</h1>
      <div class="form-container w-full grid grid-cols-5 mt-5 max-xl:grid-cols-3 max-md:grid-cols-1 items-stretch gap-5">
          <FloatLabel variant="on">
          <InputText
            class="w-full h-full"
            id="full_name"
            v-model="passportData.serial"
            v-mask="'AA #######'"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full h-full" v-model="passportData.given_date" dateFormat="dd.mm.yy" />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full h-full" v-model="passportData.expired_date" dateFormat="dd.mm.yy" />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <div>
          <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport rasmi
            <input type="file" ref="passport_main_file" class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button class="bg-white  min-h-[40px] relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport orqa rasmi
            <input type="file" ref="passport_back_file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button @click="savePassport" class="bg-white  min-h-[40px] relative w-full border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1">
            Saqlash
          </button>
        </div>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-4">
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
    <div class="mt-5" v-if="!!isOpen">
      <h1 class="text-xl">Horijiy pasportni malumotlari</h1>
      <div class="form-container w-full grid grid-cols-5 mt-5  max-xl:grid-cols-3 max-md:grid-cols-1 items-stretch gap-5">
          <FloatLabel variant="on">
          <InputText
            class="w-full h-full"
            id="full_name"
            v-model="foreginpassportData.serial"
            v-mask="'AA #######'"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full h-full" v-model="foreginpassportData.given_date" dateFormat="dd.mm.yy" />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full h-full" v-model="foreginpassportData.expired_date" dateFormat="dd.mm.yy" />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <div>
          <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport rasmi
            <input type="file" ref="foreginpassport_main_file" class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button class="bg-white  min-h-[40px] relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport orqa rasmi
            <input type="file" ref="foreginpassport_back_file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div>
        <div>
          <button @click="saveForeignPassport" class="bg-white  min-h-[40px] relative w-full border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1">
            Saqlash
          </button>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h1 class="text-xl">Haydovchilik guvohnomasi</h1>
      <div class="form-container w-full grid grid-cols-4 mt-5 max-xl:grid-cols-3 max-md:grid-cols-1 items-stretch justify-end gap-5">
          <FloatLabel variant="on">
          <InputText
            class="w-full h-full"
            id="full_name"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full h-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker class="w-full h-full" v-model="date" dateFormat="dd.mm.yy" />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <MultiSelect v-model="selectedCities" :options="cities" optionLabel="name"
             class="w-full h-full" />
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
      <div class="flex justify-end mt-3">
          <button @click="saveForeignPassport" class="bg-white max-w-fit  min-h-[40px] relative w-full border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1">
            Saqlash
          </button>
        </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
