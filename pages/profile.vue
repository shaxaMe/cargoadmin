<script setup>
import { format } from "date-fns";
import {useAuth} from "../store/auth"
import { useToast } from "primevue/usetoast";


const toast = useToast();

//data
const loading = ref(true);
const auth = useAuth()
const {setUser,user} = auth
const selectedCities = ref();
const date = ref(null);
const isOpen = ref(false);
const cities = ref([
  { name: "A", code: 1 },
  { name: "B", code: 2 },
  { name: "C", code: 3 },
  { name: "D", code: 4 },
  { name: "E", code: 5 },
]);
const isPassportEdit = ref(false);
const isForeginPassportEdit = ref(false);
const isDriverLicenseEdit = ref(false);
const imgUrls = reactive({
  passport_main_file: {
    url:null,
    base64: null,
  },
  passport_back_file: {
    url: null,
    base64: null,
  },
  foreginpassport_main_file: {
    url: null,
    base64: null,
  },
  foreginpassport_back_file: {
    url: null,
    base64: null,
  },
  driver_license_front_file: {
    url: null,
    base64: null,
  },
  driver_license_back_file: {
    url: null,
    base64: null,
  },
});
const formValues = reactive({});
const passport_main_file = ref(null);
const passport_back_file = ref(null);
const foreginpassport_main_file = ref(null);
const foreginpassport_back_file = ref(null);
const driver_license_front_file = ref(null);
const driver_license_back_file = ref(null);
const foreginpassportData = reactive({
  expired_date: "",
  given_date: "",
  serial: "",
});
const passportData = reactive({
  expired_date: "",
  given_date: "",
  serial: "",
  driving_license_category: [],
});
const driver_pass = reactive({
  expired_date: "",
  given_date: "",
  serial: "",
  driving_license_category: [],
});
const img_url = ref(null);
//methods
function _focus() {
  if (!formValues.phone) {
    formValues.phone = "+998 ";
  }
}
function timeFormatter(date) {
  return format(new Date(date), "yyyy-MM-dd");
}
function getUserProfile() {
  useApi("/v1/user/info").then((response) => {
    if (response) {
      setUser(response);
      for (let i in response) {
        formValues[i] = response[i];
      }
    }
  });
}
function getUserDocuments() {
  useApi("/v1/user/documents").then((response) => {
    loading.value = false;
    response.results.forEach((item) => {
      if (item.type === "passport") {
        isPassportEdit.value = true;
        passportData.expired_date = item.expired_date;
        passportData.id = item.id;
        passportData.given_date = item.given_date;
        passportData.serial = item.serial;
        imgUrls.passport_main_file.url = item.main_file;
        imgUrls.passport_back_file.url = item.back_file;
      } else if (item.type === "driver_passport") {
        isDriverLicenseEdit.value = true;
        driver_pass.expired_date = item.expired_date;
        driver_pass.given_date = item.given_date;
        driver_pass.serial = item.serial;
        driver_pass.driving_license_category = item.driving_license_category;
        imgUrls.driver_license_front_file.url = item.main_file;
        imgUrls.driver_license_back_file.url = item.back_file;
        driver_pass.id = item.id;
      } else {
        isForeginPassportEdit.value = true;
        foreginpassportData.expired_date = item.expired_date;
        foreginpassportData.given_date = item.given_date;
        foreginpassportData.serial = item.serial;
        imgUrls.foreginpassport_main_file.url = item.main_file;
        imgUrls.foreginpassport_back_file.url = item.back_file;
        foreginpassportData.id = item.id;
      }
    });
  }).catch((error) => {
     loading.value = false;
  }).finally(() => {
     loading.value = false;
  })
}
function _deleteImg(key) {
  let el = document.querySelector(`#${key}`);
  el.value = "";
  imgUrls[key]['url'] = null;
  imgUrls[key]['base64'] = null;
}
function previewImage(e, key) {
  const obj = e.target.files[0];
//   if (obj) {
//     imgUrls[key]['url'] = URL.createObjectURL(obj);  // Set the URL for preview

//     const reader = new FileReader();
    
//     reader.onload = function(event) {
//         const base64String = event.target.result;
//         imgUrls[key]['base64'] = base64String;  // Store the Base64 string in imgUrls

//         const data = new FormData();
//         data.append("back_file", base64String);
        
//         // Now you can send `data` with the Base64-encoded file
//         console.log("FormData with Base64 back_file:", data.get("back_file"));
//         console.log("Base64 stored in imgUrls:", imgUrls[key]['base64']);
        
//         // Make your API call here, passing `data` as the payload
//     };
    
//     reader.onerror = function(error) {
//         console.error("Error converting file to Base64:", error);
//     };
    
//     reader.readAsDataURL(obj);  // Convert file to Base64
// }
if (obj) {
    imgUrls[key]['url'] = URL.createObjectURL(obj);  // Set the URL for preview
    console.log("URL stored in imgUrls:", imgUrls[key]['url']);
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
            imgUrls[key]['base64'] = jpegBase64String;

            // Make your API call here, passing `data` as the payload
        };
    };

    reader.onerror = function(error) {
        console.error("Error converting file to Base64:", error);
    };

    reader.readAsDataURL(obj);  // Convert file to Base64
}

}
function _save(img) {
  formValues.photo = img;
  setUser(formValues)

}
function saveForeignPassport() {
  if (!foreginpassport_main_file.value) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Xorijiy passport old rasmini kiriting",
      life: 3000,
    });
  } else if (!foreginpassport_back_file.value) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Xorijiy passport orqa rasmini kiriting",
      life: 3000,
    });
  } else {
    const data = new FormData();
    foreginpassportData.expired_date?data.append(
      "expired_date",
      timeFormatter(foreginpassportData.expired_date)
    ):'';
    foreginpassportData.given_date?data.append("given_date", timeFormatter(foreginpassportData.given_date)):'';
    foreginpassportData.serial?data.append("serial", foreginpassportData.serial.replaceAll(" ", "")):'';
    data.append("main_file", imgUrls.foreginpassport_main_file.base64);
    data.append("back_file", imgUrls.foreginpassport_back_file.base64);
    data.append("type", "foreign_passport");
    data.append('user',auth.user.id);
    data.append('driving_license_category',[1])
    useApi("/v1/user/document", { method: "POST", body: data })
      .then((response) => {
        getUserDocuments()
        toast.add({
          severity: "success",
          summary: "Muvaffaqiyatli",
          detail: "Malumotlar saqlandi",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "Xatolik",
          detail: error.message,
          life: 3000,
        });
      });
  }
}
function saveDriverLicense() {
  if (!driver_license_front_file.value) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Haydovchilik guvohnomasi old rasmini kiriting",
      life: 3000,
    });
  } else if (!driver_license_back_file.value) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Haydovchilik guvohnomasi orqa rasmini kiriting",
      life: 3000,
    });
  } else {
    const data = new FormData();
    driver_pass.expired_date?data.append("expired_date", timeFormatter(driver_pass.expired_date)):'';
    driver_pass.given_date?data.append("given_date", timeFormatter(driver_pass.given_date)):'';
    data.append("serial", driver_pass.serial.replaceAll(" ", ""));
    data.append("main_file", imgUrls.driver_license_front_file.base64);
    data.append("back_file", imgUrls.driver_license_back_file.base64);
    data.append('user',auth.user.id);
    driver_pass.driving_license_category.forEach((item, index) => {
      data.append("driving_license_category", item);
    });
    data.append("type", "driver_passport");
    useApi("/v1/user/document", { method: "POST", body: data })
      .then((response) => {
        getUserDocuments();
        toast.add({
          severity: "success",
          summary: "Muvaffaqiyatli",
          detail: "Malumotlar saqlandi",
          life: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.add({
          severity: "error",
          summary: "Xatolik",
          detail: error.back_file[0],
          life: 3000,
        });
      });
  }
}
function savePassport() {
  if (!passport_main_file.value) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Passport old rasmini kiriting",
      life: 3000,
    });
  } else if (!passport_back_file.value) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Passport orqa rasmini kiriting",
      life: 3000,
    });
  }else{
    const data = new FormData();
  data.append("expired_date", timeFormatter(passportData.expired_date));
  data.append("given_date", timeFormatter(passportData.given_date));
  data.append("serial", passportData.serial.replaceAll(" ", ""));
  data.append("main_file", imgUrls.passport_main_file.base64);
  data.append("back_file", imgUrls.passport_back_file.base64);
  data.append("type", "passport");
  data.append('user',auth.user.id);
  data.append('driving_license_category',[1]);
  useApi("/v1/user/document", { method: "POST", body: data })
    .then((response) => {
      getUserDocuments();
      toast.add({
        severity: "success",
        summary: "Muvaffaqiyatli",
        detail: "Malumotlar saqlandi",
        life: 3000,
      });
    })
    // .catch((error) => {
    //   toast.add({
    //     severity: "error",
    //     summary: "Xatolik",
    //     detail: error.message,
    //     life: 3000,
    //   });
    // });
  }
}
function isValidFuragoMediaUrl(url) {
    const baseUrl = "http://api.furago.uz/media";
    return url.includes(baseUrl);
}
function saveEditProfile(editedType) {
  let id = null;
   let data = {}
     if(editedType === 'passport'){
       id=passportData.id;
       data.serial=passportData.serial.replaceAll(" ", "");
       !!isValidFuragoMediaUrl(imgUrls.passport_main_file.url)?"":data.main_file=imgUrls.passport_main_file.base64;
       !!isValidFuragoMediaUrl(imgUrls.passport_back_file.url)?"":data.back_file=imgUrls.passport_back_file.base64;
       data.type='passport';
       data.given_date=passportData.given_date? timeFormatter(passportData.given_date) : '';
       data.expired_date=passportData.expired_date? timeFormatter(passportData.expired_date) : '';
     }
     else if(editedType === 'driver_license'){
      id  = driver_pass.id
       data.serial=driver_pass.serial.replaceAll(" ", "");
       !!isValidFuragoMediaUrl(imgUrls.driver_license_front_file.url)?"":data.main_file=imgUrls.driver_license_front_file.base64;
       isValidFuragoMediaUrl(imgUrls.driver_license_back_file.url)?"":data.back_file=imgUrls.driver_license_back_file.base64;
       data.type='driver_passport';
       data.driving_license_category=driver_pass.driving_license_category;
       data.given_date=driver_pass.given_date? timeFormatter(driver_pass.given_date) : '';
       data.expired_date=driver_pass.expired_date? timeFormatter(driver_pass.expired_date) : '';
     }
     else if(editedType === 'foreign_passport'){
       data.serial=foreginpassportData.serial.replaceAll(" ", "");
       isValidFuragoMediaUrl(imgUrls.foreginpassport_main_file.url)?"":data.main_file=imgUrls.foreginpassport_main_file.base64;
       isValidFuragoMediaUrl(imgUrls.foreginpassport_back_file.url)?"":data.back_file=imgUrls.foreginpassport_back_file.base64;
       data.type='foreign_passport';
       data.given_date=foreginpassportData.given_date? timeFormatter(foreginpassportData.given_date) : '';
       data.expired_date=foreginpassportData.expired_date? timeFormatter(foreginpassportData.expired_date) : '';
       id = foreginpassportData.id
     }
     data.user=auth.user.id;
     useApi(`v1/user/document/${id}`, { method: "PUT", body: JSON.stringify(data) }).then((response) => {
      getUserDocuments();
      toast.add({
        severity: "success",
        summary: "Muvaffaqiyatli",
        detail: "Malumotlar saqlandi",
        life: 3000,
      });
     }).catch((error) => {
      toast.add({
        severity: "error",
        summary: "Xatolik",
        detail: 'Qayta urinib kuring',
        life: 3000,
      });
     })
}
//actins

onMounted(() => {
  setTimeout(() => {
    getUserProfile();
    getUserDocuments();
  }, 200);
});
</script>
<template>
  <div class="px-5 py-6">
    <Toast />
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
              disabled
              v-mask="'+998 ## ### ## ##'"
              v-model="formValues.phone"
              @focus="_focus"
            />
            <label for="full_name">Telefon raqam</label>
          </FloatLabel>
        </div>
        <div
          class="w-24 h-24 bg-gray-400 rounded-full flex justify-center items-center relative cursor-pointer overflow-hidden shadow-md"
        >
          <div v-if="!formValues.photo">
            <Icon name="uil:image-plus" class="text-white" size="40px" />
          </div>
          <ProfileImage @save="_save" />
          <!-- <input @change="_uploadImage" class="opacity-0 absolute w-full h-24 z-10" type="file"> -->
          <img
            :src="formValues.photo"
            v-if="formValues.photo"
            alt="Passport"
            class="w-full h-full object-cover cursor-pointer"
          />
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h1 class="text-xl">Passport malumotlari</h1>
      <div
        class="form-container w-full grid grid-cols-3 mt-5 max-xl:grid-cols-3 max-md:grid-cols-1 items-stretch gap-5"
      >
        <FloatLabel variant="on">
          <InputText
            class="w-full h-full min-h-[40px]"
            id="full_name"
            v-model="passportData.serial"
            v-mask="'AA #######'"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="passportData.given_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="passportData.expired_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <!-- <div>
          <button class="bg-white  h-[200px]  w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center gap-1">
            <div v-if="!imgUrls['passport_main_file']" class="flex flex-col items-center gap-6">
              <Icon name="uil:plus-circle" size="34px" />
            Passport rasmi
            <input type="file"  ref="passport_main_file" @change="previewImage($event,'passport_main_file')" class="opacity-0 cursor-pointer absolute w-full h-full z-10" />
            </div>
            <img v-if="imgUrls['passport_main_file']" :src="imgUrls['passport_main_file']" alt="passport_main_file">
          </button>
        </div> -->
        <div>
          <button
            class="bg-white overflow-hidden h-[200px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
          >
            <div
              v-show="!imgUrls['passport_main_file']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Passport old rasmi
              <input
                id="passport_main_file"
                type="file"
                ref="passport_main_file"
                @change="previewImage($event, 'passport_main_file')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['passport_main_file']['url']"
            >
              <img
                :src="imgUrls['passport_main_file']['url']"
                class="w-full h-full object-cover"
                alt="passport_main_file"
              />
              <div
                @click="_deleteImg('passport_main_file')"
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
        <div>
          <button
            class="bg-white overflow-hidden h-[200px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
          >
            <div
              v-show="!imgUrls['passport_back_file']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Passport orqa rasmi
              <input
                type="file"
                id="passport_back_file"
                ref="passport_back_file"
                @change="previewImage($event, 'passport_back_file')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['passport_back_file']['url']"
            >
              <img
                :src="imgUrls['passport_back_file']['url']"
                class="w-full h-full object-cover"
                alt="passport_back_file"
              />
              <div
                @click="_deleteImg('passport_back_file')"
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
      <div class="flex justify-end mt-2">
        <button
          v-if="!isPassportEdit"
          @click="savePassport"
          class="bg-white w-fit min-h-[40px] relative border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          Saqlash
        </button>
        <button
        v-if="!!isPassportEdit"
          @click="saveEditProfile('passport')"
          class="bg-white min-h-[40px] relative hover:bg-blue-500 hover:text-white trans-custom w-fit border border-blue-400 px-6 text-blue-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          O'zgartirishlarni saqlash
        </button>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-1" v-if="!isForeginPassportEdit && user?.role!='USER'">
      <button
        @click="isOpen = true"
        v-if="!isOpen"
        class="bg-white min-h-[40px] border-dashed relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1"
      >
        <Icon name="uil:plus-circle" size="24px" />
        хорижий паспортни киритиш
        <!-- <input type="file"  class="opacity-0 absolute w-full h-full z-10" /> -->
      </button>
      <button
        @click="isOpen = false"
        v-if="!!isOpen"
        class="bg-white min-h-[40px] border-dashed relative w-full border border-red-400 px-6 text-red-400 rounded-md h-full flex items-center justify-center gap-1"
      >
        <Icon name="solar:minus-circle-outline" size="24px" />
        horijiy passportni o'chirish
        <!-- <input type="file"  class="opacity-0 absolute w-full h-full z-10" /> -->
      </button>
    </div>
    <div class="mt-5" v-if="!!isOpen || !!isForeginPassportEdit && user?.role!='USER'">
      <h1 class="text-xl">Horijiy pasportni malumotlari</h1>
      <div
        class="form-container w-full grid grid-cols-3 mt-5 max-xl:grid-cols-3 max-md:grid-cols-1 items-stretch gap-5"
      >
        <FloatLabel variant="on">
          <InputText
            class="w-full h-full min-h-[40px]"
            id="full_name"
            v-model="foreginpassportData.serial"
            v-mask="'AA #######'"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="foreginpassportData.given_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="foreginpassportData.expired_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <!-- <div>
          <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport rasmi
            <input type="file" ref="foreginpassport_main_file" @change="previewImage('foreginpassport_main_file')" class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div> -->
        <div>
          <button
            class="bg-white overflow-hidden h-[200px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
          >
            <div
              v-show="!imgUrls['foreginpassport_main_file']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Passport old rasmi
              <input
                type="file"
                id="foreginpassport_main_file"
                ref="foreginpassport_main_file"
                @change="previewImage($event, 'foreginpassport_main_file')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['foreginpassport_main_file']['url']"
            >
              <img
                :src="imgUrls['foreginpassport_main_file']['url']"
                class="w-full h-full object-cover"
                alt="foreginpassport_main_file"
              />
              <div
                @click="_deleteImg('foreginpassport_main_file')"
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
        <!-- <div>
          <button class="bg-white  min-h-[40px] relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Passport orqa rasmi
            <input type="file" ref="foreginpassport_back_file"  @change="previewImage('foreginpassport_back_file')"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div> -->
        <div>
          <button
            class="bg-white overflow-hidden h-[200px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
          >
            <div
              v-show="!imgUrls['foreginpassport_back_file']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Passport orqa rasmi
              <input
                id="foreginpassport_back_file"
                type="file"
                ref="foreginpassport_back_file"
                @change="previewImage($event, 'foreginpassport_back_file')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['foreginpassport_back_file']['url']"
            >
              <img
                :src="imgUrls['foreginpassport_back_file']['url']"
                class="w-full h-full object-cover"
                alt="foreginpassport_back_file"
              />
              <div
                @click="_deleteImg('foreginpassport_back_file')"
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
      <div class="w-full flex justify-end">
        <button
        v-if="!isForeginPassportEdit"
          @click="saveForeignPassport"
          class="bg-white min-h-[40px] relative w-fit border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          Saqlash
        </button>
        <button
        v-if="!!isForeginPassportEdit"
          @click="saveEditProfile('foreign_passport')"
          class="bg-white min-h-[40px] relative hover:bg-blue-500 hover:text-white trans-custom w-fit border border-blue-400 px-6 text-blue-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          O'zgartirishlarni saqlash
        </button>
      </div>
    </div>
    <div class="mt-10" v-if="user?.role!='USER'">
      <h1 class="text-xl">Haydovchilik guvohnomasi</h1>
      <div
        class="form-container w-full grid grid-cols-4 mt-5 max-xl:grid-cols-3 max-md:grid-cols-1 items-stretch justify-end gap-5"
      >
        <FloatLabel variant="on">
          <InputText
            class="w-full h-full min-h-[40px]"
            id="full_name"
            v-mask="'AA #######'"
            v-model="driver_pass.serial"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="driver_pass.given_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="driver_pass.expired_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <MultiSelect
            v-model="driver_pass.driving_license_category"
            :options="cities"
            optionValue="code"
            optionLabel="name"
            class="w-full h-full min-h-[40px]"
          />
          <label for="full_name">Kategoriyalar</label>
        </FloatLabel>
        <!-- <div>
          <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Guvohnoma rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div> -->
        <div>
          <button
            class="bg-white overflow-hidden h-[200px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
          >
            <div
              v-show="!imgUrls['driver_license_front_file']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Guvohnoma rasmi
              <input
                id="driver_license_front_file"
                type="file"
                ref="driver_license_front_file"
                @change="previewImage($event, 'driver_license_front_file')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['driver_license_front_file']['url']"
            >
              <img
                :src="imgUrls['driver_license_front_file']['url']"
                class="w-full h-full object-cover"
                alt="driver_license_front_file"
              />
              <div
                @click="_deleteImg('driver_license_front_file')"
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
        <!-- <div>
          <button class="bg-white  min-h-[40px] relative w-full border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-center gap-1">
            <Icon name="uil:plus-circle" size="24px" />
            Guvohnoma orqa rasmi
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button>
        </div> -->
        <div>
          <button
            class="bg-white overflow-hidden h-[200px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
          >
            <div
              v-show="!imgUrls['driver_license_back_file']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Guvohnoma orqa rasmi
              <input
                id="driver_license_back_file"
                type="file"
                ref="driver_license_back_file"
                @change="previewImage($event, 'driver_license_back_file')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['driver_license_back_file']['url']"
            >
              <img
                :src="imgUrls['driver_license_back_file']['url']"
                class="w-full h-full object-cover"
                alt="driver_license_back_file"
              />
              <div
                @click="_deleteImg('driver_license_back_file')"
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
      <div class="flex justify-end mt-3">
        <button
          v-if="!isDriverLicenseEdit"
          @click="saveDriverLicense"
          class="bg-white max-w-fit min-h-[40px] relative w-full border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          Saqlash
        </button>
        <button
        v-if="!!isDriverLicenseEdit"
          @click="saveEditProfile('driver_license')"
          class="bg-white min-h-[40px] relative hover:bg-blue-500 hover:text-white trans-custom w-fit border border-blue-400 px-6 text-blue-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          O'zgartirishlarni saqlash
        </button>
      </div>
    </div>
    <div v-if="loading" class="fixed w-screen h-screen top-0 left-0 backdrop-blur-sm bg-white/10 flex justify-center items-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
