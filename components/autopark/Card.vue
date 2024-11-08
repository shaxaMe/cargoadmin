<template>
  <div>
    <Toast />
    <div
      class="border border-gray-400 px-5 py-4 max-md:pt-10 bg-white rounded-xl flex max-md:flex-col max-md:gap-4 relative"
      v-if="props.cardData"
    >
      <div class="flex-1 flex items-center gap-3">
        <div
          class="w-14 h-14 bg-blue-400 rounded-md text-white flex items-center justify-center overflow-hidden"
        >
          <!-- <Icon name="mdi:truck" size="20px" v-if="" /> -->
          <img
            class="w-full h-full"
            :src="cardData.images[0]['image']"
            alt=""
          />
        </div>
        <div>
          <div>
            <span class="font-bold text-lg">{{ cardData.document.model }}</span>
            <span class="text-gray-400 ml-1">01 601 BGA</span>
          </div>
          <p class="text-gray-400">
            тентованный, {{ cardData.volume }} м3, {{ cardData.weight }} т
          </p>
        </div>
      </div>
      <div class="flex-1 flex items-center gap-3">
        <div
          class="w-14 h-14 bg-blue-400 rounded-md text-white flex items-center justify-center overflow-hidden"
        >
          <img
            :src="cardData.main_driver.photo"
            class="object-cover w-full h-full"
            alt=""
          />
        </div>
        <div>
          <span class="font-semibold text-lg">{{
            cardData.main_driver.full_name
          }}</span>
          <p class="text-gray-400">+{{ cardData.main_driver.phone }}</p>
        </div>
      </div>
      <div
        class="flex items-center gap-3 max-md:absolute max-md:top-0 max-md:right-0"
      >
        <Tag severity="success" value="Tasdiqlangan"></Tag>
        <div class="card flex justify-center">
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            @click="toggle"
            class="!bg-transparent !border-none !text-gray-400"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <!-- <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" /> -->
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
            <template #item="{ item, props }">
              <div class="flex items-center justify-start gap-1 px-4 py-1">
                <Icon :name="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </div>
            </template>
          </Menu>
        </div>
      </div>
    </div>
    <Modal v-model="isOpen" @_save="_save" :loading="updateLoading">
      <div class="flex items-center gap-5">
        <div class="flex-1 flex flex-col">
          <label for="username" class="font-semibold mb-2"
            >Transport turi</label
          >
          <Select
            v-model="formData.type"
            :options="options.vehicle_type"
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
          <InputNumber
            v-model="formData.weight"
            id="username"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex-1 flex flex-col">
          <label for="email" class="font-semibold mb-2"
            >Yuk olish hajmi (m3)</label
          >
          <InputNumber
            v-model="formData.volume"
            id="email"
            class="flex-auto"
            autocomplete="off"
          />
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
            <InputText
              id="username"
              v-model="formData.document.license_plate"
              class="flex-auto"
              autocomplete="off"
            />
          </div>
          <div class="flex-1 flex flex-col">
            <label for="email" class="font-semibold mb-2">Modeli</label>
            <InputText
              v-model="formData.document.model"
              id="email"
              class="flex-auto"
              autocomplete="off"
            />
          </div>
          <div class="flex-1 flex flex-col">
            <label for="email" class="font-semibold mb-2">Yoqilg'i turi</label>
            <MultiSelect
              v-model="formData.document.fuel_type"
              :options="options.fuel_type"
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
            <InputText
              v-model="formData.document.serial"
              id="username"
              class="flex-auto"
              autocomplete="off"
            />
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
                <div
                  class="flex flex-col items-center gap-6"
                  v-show="!formData.document.main_file"
                >
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
                <div
                  class="flex flex-col items-center gap-6"
                  v-show="!formData.document.back_file"
                >
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
                :disabled="formData?.images?.length >= 5"
                id="multiple"
                @change="previewImage($event, 'multiple')"
                class="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-0"
              />
            </div>
            <div
              class="w-full h-40 overflow-hidden rounded-md group relative flex justify-center items-center"
              v-for="(item, i) in formData.images"
              v-if="formData.images && formData?.images?.length > 0"
            >
              <img class="w-full h-full" :src="item.image" alt="fff" />
              <div
                @click="_deleteImg('multiple',i)"
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
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { format } from "date-fns";
const toast = useToast();
import { useOption } from "../store/option";
const emit = defineEmits(['UpdateData'])
const { options } = useOption();
const delete_img = ref(null)
const menu = ref();
let updateLoading = ref(false);
const formData = reactive({
  type: "1",
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
const props = defineProps({
  cardData: {
    type: Object,
    default: {},
  },
});
const isOpen = ref(false);
const items = ref([
  {
    label: "O'chirish",
    icon: "material-symbols:delete-outline",
  },
  {
    label: "O'zgartirish",
    icon: "material-symbols:edit-rounded",
    command: () => {
      // toast.add({
      //   severity: "success",
      //   summary: "Success",
      //   detail: "File created",
      //   life: 3000,
      // });
      getEditData();
    },
  },
]);

function previewImage(e, key) {
  const obj = e.target.files[0];
  if (obj) {
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
        if (key != "multiple") {
          formData.document[key] = jpegBase64String;
        } else {
          formData.images.push({id:delete_img.value.id,image: jpegBase64String });
        }
      };
    };

    reader.onerror = function (error) {
      console.error("Error converting file to Base64:", error);
    };

    reader.readAsDataURL(obj); // Convert file to Base64
  }
}
function timeFormatter(date) {
  return format(new Date(date), "yyyy");
}
function _deleteImg(key, ind) {
  if (key != "multiple") {
    let el = document.querySelector(`#${key}`);
    el.value = "";
    formData.document[key] = null;
  } else {
    delete_img.value = formData.images[ind]
    console.log("Image deleted",delete_img.value);
    formData.images.splice(ind, 1);
  }
}

const toggle = (event) => {
  menu.value.toggle(event);
};

function _save() {
  updateLoading.value = true;
  console.log("Image saved",updateLoading.value);
  formData.document.ayear = timeFormatter(formData.document.ayear);
  if (
    formData.document.main_file &&
    !formData.document.main_file.includes("http://api.furago.uz/media")
  ) {
    // Keep the new main_file, otherwise remove it from formData if it's old
    formData.document.main_file = formData.document.main_file;
  } else {
    // Remove old main_file to prevent it from being sent
    delete formData.document.main_file;
  }

  if (
    formData.document.back_file &&
    !formData.document.back_file.includes("http://api.furago.uz/media")
  ) {
    // Keep the new back_file, otherwise remove it from formData if it's old
    formData.document.back_file = formData.document.back_file;
  } else {
    // Remove old back_file to prevent it from being sent
    delete formData.document.back_file;
  }

  // Filter out old images from formData.images
  formData.images = formData.images.filter((img) => {
    return !img.image.includes("http://api.furago.uz/media");
  });
  delete formData.document.vehicle
  if(formData.images.length == 0) {
     delete formData.images
  }
  useApi(`/v1/driver/vehicle/${props.cardData.id}`, {
    method: "PATCH",
    body: formData,
  }).then(() => {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Vehicle saved successfully",
      life: 3000,
    });
    emit('UpdateData')
    updateLoading.value = false;
    isOpen.value = false;
  }).catch(() => {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to save vehicle",
      life: 3000,
    });
    updateLoading.value = false;
  }).finally(()=>{
    updateLoading.value = false;
  });
}

function getEditData() {
  useApi(`/v1/driver/vehicle/${props.cardData.id}`).then((res) => {
    if (res) {
      formData.type = res.type;
      formData.truck_body = res.truck_body;
      formData.weight = res.weight;
      formData.volume = res.volume;
      formData.loading_type = res.loading_type;
      formData.truck_body_parameter = res.truck_body_parameter;
      formData.note = res.note;
      formData.main_driver = res.main_driver;
      formData.images = res.images;
      formData.document = res.document;
      formData.document.ayear = new Date(res.document["ayear"],1,1);
      isOpen.value = true;
    }
  });
}
</script>

<style lang="scss" scoped></style>
