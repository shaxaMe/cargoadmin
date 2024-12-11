<script setup>
import { format } from "date-fns";
import { useAuth } from "../store/auth";
import { useToast } from "primevue/usetoast";

const toast = useToast();

//data
const loading = ref(true);
const auth = useAuth();
const { setUser, user } = auth;
const isAddDoc = ref(false);
const docsSaveId = ref(null);
const IsDocSaves = ref(false);
const isEditProfile = ref(false);
const docsSaveData = ref({
  serial: null,
  expired_date: null,
  given_date: null,
  driving_license_category: [],
});
const cities = ref([
  { name: "A", code: 1 },
  { name: "B", code: 2 },
  { name: "C", code: 3 },
  { name: "D", code: 4 },
  { name: "E", code: 5 },
]);
const statusList = {
  wait: "Kutilmoqda",
  rejected: "Rad etildi",
  archived: "Arxivga olindi",
  accept: "Qabul qilindi",
};
const docsType = ref([
  {
    name: "Passport",
    code: 1,
    type: "passport",
  },
  {
    name: "Xorij pasporti",
    code: 2,
    type: "foreign_passport",
  },
  {
    name: "Haydovchi hujjatlari",
    code: 3,
    type: "driver_passport",
  },
]);
const docType = ref(1);
const isDocEdit = ref(false);
const getDocsData = ref([]);
const imgUrls = reactive({
  docs_save_back: {
    url: null,
    base64: null,
  },
  docs_save_old: {
    url: null,
    base64: null,
  },
});
const formValues = reactive({});
const editValues = reactive({});
const docs_save_old = ref(null);
const docs_save_back = ref(null);

//methods

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
  useApi("/v1/user/documents")
    .then((response) => {
      getDocsData.value = response.results;
      if (response.results) {
        let filtered = new Set(response.results.map((item) => item.type));
        let arr = docsType.value.filter((doc) => !filtered.has(doc.type));
        if (arr.length == 0) {
          IsDocSaves.value = true;
        }
      }
      loading.value = false;
    })
    .catch((error) => {
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
}
function _deleteImg(key) {
  let el = document.querySelector(`#${key}`);
  el.value = "";
  imgUrls[key]["url"] = null;
  imgUrls[key]["base64"] = null;
}
function previewImage(e, key) {
  const obj = e.target.files[0];
  if (obj) {
    imgUrls[key]["url"] = URL.createObjectURL(obj);
    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target.result;

      // Create an offscreen canvas to render the image in JPEG format
      const image = new Image();
      image.src = base64String;

      image.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        // Convert canvas to JPEG Base64 format
        const jpegBase64String = canvas.toDataURL("image/jpeg", 0.9); // 0.9 for quality setting (1 is max)

        // Store the JPEG Base64 string in imgUrls
        imgUrls[key]["base64"] = jpegBase64String;

        // Make your API call here, passing `data` as the payload
      };
    };

    reader.onerror = function (error) {
      console.error("Error converting file to Base64:", error);
    };

    reader.readAsDataURL(obj); // Convert file to Base64
  }
}
function _save(img) {
  formValues.photo = img;
  setUser(formValues);
}

function isValidFuragoMediaUrl(url) {
  if(url){
    const baseUrl = "http://api.furago.uz/media";
    return url.includes(baseUrl);
  }
}

function userDocsNames(type) {
  let obj = {
    passport: "Pasport",
    driver_passport: "Haydovchi hujjatlar",
    foreign_passport: "Xorij pasporti",
  };
  return obj[type];
}
function openModalEdit(item) {
  isDocEdit.value = true;
  docsSaveId.value = item.id;
  docType.value = docsType.value.find((d) => d.type == item.type)["code"];
  for (let i in item) {
    docsSaveData.value[i] = item[i];
  }
  imgUrls.docs_save_back.url = item.back_file;
  imgUrls.docs_save_old.url = item.main_file;
  isAddDoc.value = true;
}
function saveProfile() {
  let data = {
    expired_date: "",
    given_date: "",
    serial: "",
    driving_license_category: [],
    main_file: "",
    back_file: "",
  };
  for (let i in docsSaveData.value) {
    data[i] = docsSaveData.value[i];
  }
  data.type = docsType.value.find((doc) => doc.code == docType.value)["type"];
  if (docType.value != 3) {
    delete data.driving_license_category;
  }
  data.expired_date = timeFormatter(docsSaveData.value.expired_date);
  data.given_date = timeFormatter(docsSaveData.value.given_date);
  data.user = auth.user.id;
  if (!!isValidFuragoMediaUrl(imgUrls.docs_save_back.url)) {
    delete data.back_file;
  } else {
    data.back_file = imgUrls.docs_save_back.base64;
  }
  if (!!isValidFuragoMediaUrl(imgUrls.docs_save_old.url)) {
    delete data.main_file;
  } else {
    data.main_file = imgUrls.docs_save_old.base64;
  }
  if (isDocEdit.value == false) {
    if(!data.back_file && !data.main_file){
        toast.add({
          severity: "error",
          summary: "Xatolik",
          detail: "Rasmlar to'g'ri kiritilganini tekshiring",
          life: 3000,
        });
    }
    else{
    useApi("/v1/user/document", { method: "POST", body: data }).then(
      (response) => {
        getUserDocuments();
        isAddDoc.value = false;
        resetFields();
        toast.add({
          severity: "success",
          summary: "Muvaffaqiyatli",
          detail: "Malumotlar saqlandi",
          life: 3000,
        });
      }
    );
  } 
  }
  if(isDocEdit.value == true){
    useApi(`v1/user/document/${docsSaveId.value}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
      .then((response) => {
        getUserDocuments();
        isAddDoc.value = false;
        toast.add({
          severity: "success",
          summary: "Muvaffaqiyatli",
          detail: "Malumotlar saqlandi",
          life: 3000,
        });
        resetFields();
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "Xatolik",
          detail: "Qayta urinib kuring",
          life: 3000,
        });
      });
  }
}
function saveEditProfile() {
  let data = {
    full_name: editValues.full_name,
    phone: formatNum(editValues.phone, " ").substr(1),
  };
  useApi(`/v1/user/info`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }).then(() => {
    toast.add({
      severity: "success",
      summary: "Muvaffaqiyatli",
      detail: "Malumotlar o'zgartirildi",
      life: 3000,
    });
    isEditProfile.value = false;
    getUserProfile();
  });
}
function resetFields() {
  for (let i in docsSaveData.value) {
    docsSaveData.value[i] = "";
  }
  docsSaveId.value = null;
  imgUrls.docs_save_back.url = "";
  imgUrls.docs_save_old.url = "";
  isDocEdit.value = false;
}

function _focus() {
  if (!editValues.phone) {
    editValues.phone = "+998 ";
  }
}
//actins

onMounted(() => {
  setTimeout(() => {
    getUserProfile();
    getUserDocuments();
    if (auth.user.role == "USER") {
      docsType.value = docsType.value.filter(
        (d) => d.type != "driver_passport"
      );
    }
  }, 200);
});

//watcher

watch(
  () => isAddDoc.value,
  (newVal) => {
    if (!newVal) {
      resetFields();
    }
  }
);
watch(
  () => isEditProfile.value,
  (newVal) => {
    if (newVal) {
      for (let i in formValues) {
        editValues[i] = formValues[i];
      }
    }
  }
);
</script>
<template>
  <div class="px-5 py-6 max-w-4xl bg-white mx-auto rounded-xl my-5">
    <Toast />
    <div>
      <h1 class="text-xl">Haydovchi profili</h1>
      <div class="flex justify-between w-full items-start pb-10 border-b">
        <div class="form-container max-w-[500px] mt-5 flex items-center gap-10">
          <div
            class="w-32 h-32 bg-gray-400 rounded-full flex justify-center items-center relative cursor-pointer overflow-hidden shadow-md"
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
          <div class="flex-1 relative">
            <div class="px-3 py-2 text-xs absolute right-0 w-fit rounded-lg" :class="userStatus(formValues.status)['class'] || 'bg-gray-300'">
               {{ userStatus(formValues.status)['status'] }}
            </div>
            <p class="text-2xl font-bold text-gray-900">
              {{ formValues.full_name }}
            </p>
            <div class="text-gray-600 flex items-center gap-1 mt-1">
              <Icon name="line-md:phone" class="w-6 h-6" />
              <p>+{{ formValues.phone }}</p>
            </div>
          </div>
        </div>
        <div
          class="flex justify-start gap-1 items-center text-blue-600 cursor-pointer"
          @click="isEditProfile = true"
        >
          <Icon name="line-md:edit" class="w-5 h-5" />
          <p class="underline text-blue-600 hover:text-blue-800">
            O'zgartirish
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200">
      <div class="p-6 sm:p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Документы</h2>
          <div>
            <button
              :disabled="IsDocSaves"
              @click="isAddDoc = true"
              class="bg-[#3b72f1] gap-2 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm flex justify-center items-center text-center px-3 py-2 rounded-lg"
            >
              <Icon size="15px" name="material-symbols:add-2" />
              <span>Hujjat qo'shish </span>
            </button>
          </div>
        </div>
        <div
          class="space-y-4 mt-4"
          v-for="(item, i) in getDocsData"
          v-if="!loading && getDocsData.length > 0"
        >
          <div
            class="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-100 transition-colors duration-200"
          >
            <!-- Основная информация -->
            <div class="flex-grow mb-4 md:mb-0">
              <div class="flex items-center mb-2">
                <Icon name="hugeicons:passport" class="w-6 h-6" />
                <h3 class="font-semibold text-lg ml-2">
                  <span class="px-3 py-2 text-xs ml-3 w-fit rounded-lg" :class="userDocsStatus(item.status)['class']|| 'bg-gray-300'">{{ userDocsStatus(item.status)['status'] }}</span>
                </h3>
              </div>
              <div class="ml-8 space-y-1 text-gray-600">
                <p>
                  <span class="font-medium">Серийный номер:</span>
                  {{ item.serial }} 
                </p>
                <p>
                  <span class="font-medium">Срок действия:</span>
                  {{ item.expired_date }}
                </p>
              </div>
            </div>
            <div class="flex space-x-4 mb-4 md:mb-0">
              <div v-if="item.main_file" class="w-20 h-20">
                <img
                  :src="item.main_file"
                  alt="Front"
                  class="w-full h-full object-cover rounded"
                />
              </div>
              <div v-if="item.back_file" class="w-20 h-20">
                <img
                  :src="item.back_file"
                  alt="Back"
                  class="w-full h-full object-cover rounded"
                />
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex items-center space-x-3 ml-3">
              <button
                @click="openModalEdit(item)"
                class="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                title="Редактировать"
              >
                <Icon name="line-md:edit" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="loading"
      class="fixed w-screen h-screen top-0 left-0 backdrop-blur-sm bg-white/10 flex justify-center items-center"
    >
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <Modal
      v-model="isAddDoc"
      title="Hujjat qo'shish"
      maxWidth="400px"
      @_save="saveProfile"
    >
      <div class="flex-1 flex flex-col py-4">
        <FloatLabel variant="on">
          <Select
            :disabled="isDocEdit"
            v-model="docType"
            :options="docsType"
            optionLabel="name"
            optionValue="code"
            class="w-full text-sm"
          />
          <label for="username">Hujjat turi</label>
        </FloatLabel>
      </div>
      <div
        class="form-container w-full grid grid-cols-1 mt-5 items-stretch gap-5"
      >
        <FloatLabel variant="on">
          <InputText
            class="w-full h-full min-h-[40px]"
            id="full_name"
            v-model="docsSaveData.serial"
            v-mask="'AA #######'"
          />
          <label for="full_name">Seria va raqami</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="docsSaveData.given_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Berilgan muddati</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            class="w-full h-full min-h-[40px]"
            v-model="docsSaveData.expired_date"
            dateFormat="dd.mm.yy"
          />
          <label for="full_name">Amal qilish muddati</label>
        </FloatLabel>
        <FloatLabel variant="on" v-if="docType == 3">
          <MultiSelect
            v-model="docsSaveData.driving_license_category"
            :options="cities"
            optionValue="code"
            optionLabel="name"
            class="w-full h-full min-h-[40px]"
          />
          <label for="full_name">Kategoriyalar</label>
        </FloatLabel>
        <div>
          <button
            class="bg-white overflow-hidden h-[200px] w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
          >
            <div
              v-show="!imgUrls['docs_save_old']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Old rasmi
              <input
                id="docs_save_old"
                type="file"
                ref="docs_save_old"
                @change="previewImage($event, 'docs_save_old')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['docs_save_old']['url']"
            >
              <img
                :src="imgUrls['docs_save_old']['url']"
                class="w-full h-full object-cover"
                alt="docs_save_old"
              />
              <div
                @click="_deleteImg('docs_save_old')"
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
              v-show="!imgUrls['docs_save_back']['url']"
              class="flex flex-col items-center gap-6"
            >
              <Icon name="uil:plus-circle" size="34px" />
              Orqa rasmi
              <input
                type="file"
                id="docs_save_back"
                ref="docs_save_back"
                @change="previewImage($event, 'docs_save_back')"
                class="opacity-0 cursor-pointer absolute w-full h-full z-10"
              />
            </div>
            <div
              class="relative flex items-center justify-center group w-full h-full"
              v-if="imgUrls['docs_save_back']['url']"
            >
              <img
                :src="imgUrls['docs_save_back']['url']"
                class="w-full h-full object-cover"
                alt="docs_save_back"
              />
              <div
                @click="_deleteImg('docs_save_back')"
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
    </Modal>
    <Modal
      v-model="isEditProfile"
      title="Profilni o'zgartirish"
      maxWidth="400px"
      @_save="saveEditProfile"
    >
      <div
        class="form-container w-full grid grid-cols-1 mt-5 items-stretch gap-5"
      >
        <FloatLabel variant="on">
          <InputText
            class="w-full h-full min-h-[40px]"
            id="full_name"
            v-model="editValues.full_name"
          />
          <label for="full_name">Foydalanuvchi nomi</label>
        </FloatLabel>
        <!-- <FloatLabel variant="on" class="w-full">
          <InputText
            type="tel"
            class="w-full"
            @focus="_focus"
            v-mask="'+998 ## ### ## ##'"
            id="phone_num"
            pattern="[0-9]*"
            v-model="editValues.phone"
          />
          <label for="phone_num">Telefon raqam</label>
        </FloatLabel> -->
      </div>
    </Modal>
  </div>
</template>

<style lang="scss" scoped></style>
