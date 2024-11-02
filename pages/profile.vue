<script setup>
import { format } from "date-fns";

import { useToast } from "primevue/usetoast";
const toast = useToast();

//data
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
const imgUrls = reactive({
  passport_main_file: null,
  passport_back_file: null,
  foreginpassport_main_file: null,
  foreginpassport_back_file: null,
  driver_license_front_file: null,
  driver_license_back_file: null,
});
const imgObj = reactive({
  passport_main_file: null,
  passport_back_file: null,
  foreginpassport_main_file: null,
  foreginpassport_back_file: null,
  driver_license_front_file: null,
  driver_license_back_file: null,
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
      for (let i in response) {
        formValues[i] = response[i];
      }
    }
  });
}
function getUserDocuments() {
  useApi("/v1/user/document").then((response) => {
    response.results.forEach((item) => {
      if (item.type === "passport") {
        passportData.expired_date = item.expired_date;
        passportData.given_date = item.given_date;
        passportData.serial = item.serial;
        imgUrls.passport_main_file = item.main_file;
        imgUrls.passport_back_file = item.back_file;
      } else if (item.type === "driver_passport") {
        driver_pass.expired_date = item.expired_date;
        driver_pass.given_date = item.given_date;
        driver_pass.serial = item.serial;
        passportData.driving_license_category = item.driving_license_category;
        imgUrls.driver_license_front_file = item.main_file;
        imgUrls.driver_license_back_file = item.back_file;
      } else {
        foreginpassportData.expired_date = item.expired_date;
        foreginpassportData.given_date = item.given_date;
        foreginpassportData.serial = item.serial;
        imgUrls.foreginpassport_main_file = item.main_file;
        imgUrls.foreginpassport_back_file = item.back_file;
        console.log(imgUrls, "foreginpassportData");
      }
    });
  });
}
function _deleteImg(key) {
  let el = document.querySelector(`#${key}`);
  el.value = "";
  imgUrls[key] = null;
}
function previewImage(e, key) {
  const obj = e.target.files[0];
  if (obj) {
    imgUrls[key] = URL.createObjectURL(obj); // Set the preview URL for the selected file
    imgObj[key] = e; // Set the selected file for further processing
  }
  // console.log(imgObj,'obj')
}
function _save(img) {
  formValues.photo = img;
}
function saveForeignPassport() {
  if (!foreginpassportData.serial) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Xorijiy passport seriasini kiriting",
      life: 3000,
    });
  } else if (!foreginpassportData.expired_date) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Xorijiy passport amal qilish sanasini kiriting",
      life: 3000,
    });
  } else if (!foreginpassportData.given_date) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Xorijiy passport berilgan sanasini kiriting",
      life: 3000,
    });
  } else if (!foreginpassport_main_file.value) {
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
    data.append(
      "expired_date",
      timeFormatter(foreginpassportData.expired_date)
    );
    data.append("given_date", timeFormatter(foreginpassportData.given_date));
    data.append("serial", foreginpassportData.serial.replaceAll(" ", ""));
    data.append("main_file", foreginpassport_main_file.value.files[0]);
    data.append("back_file", foreginpassport_back_file.value.files[0]);
    data.append("type", "foreign_passport");
    useApi("/v1/user/document", { method: "POST", body: data })
      .then((response) => {
        console.log(response);
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
  if (!driver_pass.serial) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Haydovchilik guvohnomasi seriasini kiriting",
      life: 3000,
    });
  } else if (!driver_pass.expired_date) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Haydovchilik guvohnomasi amal qilish sanasini kiriting",
      life: 3000,
    });
  } else if (!driver_pass.given_date) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Haydovchilik guvohnomasi sanasini kiriting",
      life: 3000,
    });
  } else if (!driver_license_front_file.value) {
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
    // console.log(imgObj)
    let front_file = imgObj[driver_license_front_file];

    // let driver_license_back_file = imgObj[driver_license_back_file];
    data.append("expired_date", timeFormatter(driver_pass.expired_date));
    data.append("given_date", timeFormatter(driver_pass.given_date));
    data.append("serial", driver_pass.serial.replaceAll(" ", ""));
    data.append("main_file", driver_license_front_file.value.files[0]);
    data.append("back_file", driver_license_back_file.value.files[0]);
    driver_pass.driving_license_category.forEach((item, index) => {
      data.append("driving_license_category", item);
    });
    data.append("type", "driver_passport");
    useApi("/v1/user/document", { method: "POST", body: data })
      .then((response) => {
        console.log(response);
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
  if (!driver_pass.serial) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Passport seriasini kiriting",
      life: 3000,
    });
  } else if (!driver_pass.expired_date) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Passport amal qilish sanasini kiriting",
      life: 3000,
    });
  } else if (!driver_pass.given_date) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Passport sanasini kiriting",
      life: 3000,
    });
  } else if (!driver_license_front_file.value) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Passport old rasmini kiriting",
      life: 3000,
    });
  } else if (!driver_license_back_file.value) {
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
  data.append("main_file", passport_main_file.value.files[0]);
  data.append("back_file", passport_back_file.value.files[0]);
  data.append("type", "passport");
  useApi("/v1/user/document", { method: "POST", body: data })
    .then((response) => {
      console.log(response);
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
              v-show="!imgUrls['passport_main_file']"
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
              v-if="imgUrls['passport_main_file']"
            >
              <img
                :src="imgUrls['passport_main_file']"
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
              v-show="!imgUrls['passport_back_file']"
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
              v-if="imgUrls['passport_back_file']"
            >
              <img
                :src="imgUrls['passport_back_file']"
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
          @click="savePassport"
          class="bg-white w-fit min-h-[40px] relative border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          Saqlash
        </button>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-4">
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
    <div class="mt-5" v-if="!!isOpen">
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
              v-show="!imgUrls['foreginpassport_main_file']"
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
              v-if="imgUrls['foreginpassport_main_file']"
            >
              <img
                :src="imgUrls['foreginpassport_main_file']"
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
              v-show="!imgUrls['foreginpassport_back_file']"
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
              v-if="imgUrls['foreginpassport_back_file']"
            >
              <img
                :src="imgUrls['foreginpassport_back_file']"
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
          @click="saveForeignPassport"
          class="bg-white min-h-[40px] relative w-fit border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          Saqlash
        </button>
      </div>
    </div>
    <div class="mt-10">
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
              v-show="!imgUrls['driver_license_front_file']"
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
              v-if="imgUrls['driver_license_front_file']"
            >
              <img
                :src="imgUrls['driver_license_front_file']"
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
              v-show="!imgUrls['driver_license_back_file']"
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
              v-if="imgUrls['driver_license_back_file']"
            >
              <img
                :src="imgUrls['driver_license_back_file']"
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
          @click="saveDriverLicense"
          class="bg-white max-w-fit min-h-[40px] relative w-full border border-green-400 px-6 text-green-400 rounded-md h-full flex items-center justify-center gap-1"
        >
          Saqlash
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
