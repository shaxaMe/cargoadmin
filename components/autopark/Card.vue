<template>
  <div>
    <Toast />
    <div
      class="border border-gray-400 px-5 py-4 max-md:pt-10 bg-white rounded-xl flex max-md:flex-col max-md:gap-6 relative"
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
            <span class="font-bold text-lg">{{ cardData?.document?.model }}</span>
            <span class="text-gray-400 ml-1">{{ cardData.document.license_plate }}</span>
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
        <Tag v-if="cardData.status=='accepted'" severity="success" class="max-lg:!hidden" value="Tasdiqlangan"></Tag>
        <Tag v-else severity="warn" class="max-lg:!hidden" value="Tasdiqlanmagan"></Tag>
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
    <Modal  v-model="isOpen" @_save="_save" :loading="updateLoading" title="Avtobilni o'gartirish">
      <div class="flex items-center max-lg:flex-wrap gap-5 max-md:grid max-md:grid-cols-1">
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
            :invalid="$v.truck_body.$error"
            optionLabel="name"
            optionValue="id"
            class="w-full text-sm"
          />
        </div>
      </div>
      <div class="flex items-center gap-5 mt-5 max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1">
        <div class="flex-1 flex flex-col">
          <label for="username" class="font-semibold mb-2"
            >Yuk ko’tarish vazni (t)</label
          >
          <InputNumber
            v-model="formData.weight"
            id="username"
            :invalid="$v.weight.$error"
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
            :invalid="$v.volume.$error"
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
            :invalid="$v.loading_type.$error"
            optionValue="id"
            class="w-full text-sm"
          />
        </div>
      </div>
      <div class="mt-6">
        <h1 class="p-dialog-title">Texnik xarakteristikalar</h1>
        <div class="grid grid-cols-3 items-center gap-5 mt-5 max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1">
          <div class="flex-1 flex flex-col">
            <label for="username" class="font-semibold mb-2"
              >Davlat raqami</label
            >
            <InputText
              id="username"
              :invalid="$v.document.license_plate.$error"
              v-model="formData.document.license_plate"
              class="flex-auto"
              autocomplete="off"
            />
          </div>
          <div class="flex-1 flex flex-col">
            <label for="email" class="font-semibold mb-2">Modeli</label>
            <InputText
              v-model="formData.document.model"
              :invalid="$v.document.model.$error"
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
          <div class="flex flex-col max-md:w-full">
            <label for="username" class="font-semibold mb-2"
              >Tex pasport seriya va raqami</label
            >
            <InputText
              v-model="formData.document.serial"
              :invalid="$v.document.serial.$error"
              id="username"
              class="flex-auto"
              autocomplete="off"
            />
          </div>
          <div class="flex-1 flex items-stretch gap-5 w-full max-md:grid max-md:grid-cols-1">
            <div class="flex-1 flex flex-col max-w-[300px] max-md:max-w-full">
              <label for="email" class="font-semibold mb-2">Old rasmi</label>
              <!-- <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-start gap-1">
            <Icon name="ri:upload-cloud-2-fill" size="24px" />
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button> -->
              <button
                class="bg-white overflow-hidden h-[150px] max-md:h-60 max-lg:h-52 w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
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
                    class="p-4 bg-red-100 cursor-pointer max-lg:translate-y-0 max-lg:bottom-2 max-lg:right-2 rounded-full flex justify-center items-center absolute z-10 translate-y-[400%] trans-delete group-hover:translate-y-0"
                  >
                    <Icon
                      name="material-symbols:delete-outline"
                      size="24px"
                      class="text-red-400 max-lg:!text-sm"
                    />
                  </div>
                </div>
              </button>
            </div>
            <div class="flex-1  flex flex-col max-w-[300px] max-md:max-w-full">
              <label for="email" class="font-semibold mb-2">Orqa rasmi</label>
              <!-- <button class="bg-white  min-h-[40px] w-full relative border border-[#4880FF] px-6 text-[#4880FF] rounded-md h-full flex items-center justify-start gap-1">
            <Icon name="ri:upload-cloud-2-fill" size="24px" />
            <input type="file"  class="opacity-0 absolute w-full h-full z-10" />
          </button> -->
              <button
                class="bg-white overflow-hidden h-[150px] max-lg:h-52 max-md:h-60  w-full relative border border-dashed flex-col border-[#4880FF] text-[#4880FF] rounded-md flex items-center justify-center"
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
                    class="p-4 bg-red-100 cursor-pointer max-lg:translate-y-0 max-lg:bottom-2 max-lg:right-2 rounded-full flex justify-center items-center absolute z-10 translate-y-[400%] trans-delete group-hover:translate-y-0"
                  >
                    <Icon
                      name="material-symbols:delete-outline"
                      size="24px"
                      class="text-red-400 max-lg:!text-sm"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="my-4">
        <label class="font-semibold my-2">Transport rasmlari</label>
        <div
          class="w-full border border-dashed border-blue-400 px-4 py-3 rounded-md mt-5"
        >
          <div class="flex-1 grid grid-cols-4 gap-2 max-lg:grid-cols-2 max-md:grid-cols-1">
            <div
              class="w-40 h-40 max-lg:w-full border border-blue-400 rounded-md flex justify-center relative items-center cursor-pointer"
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
              class="w-full h-40 max-md:h-60 max-lg:items-end overflow-hidden rounded-md group relative flex justify-center items-center"
              v-for="(item, i) in formData.images"
              v-if="formData.images && formData?.images?.length > 0"
            >
              <img class="w-full h-full" :src="item.image" alt="fff" />
              <div
                @click="_deleteImg('multiple', i)"
                class="p-4 bg-red-100 cursor-pointer max-lg:translate-y-0 max-lg:bottom-2 max-lg:right-2 rounded-full flex justify-center items-center absolute z-10 translate-y-[400%] trans-delete group-hover:translate-y-0"
              >
                <Icon
                  name="material-symbols:delete-outline"
                  size="24px"
                  class="text-red-400 max-lg:!text-sm"
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
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";
import { format } from "date-fns";
const toast = useToast();
import { useOption } from "../store/option";
const emit = defineEmits(["UpdateData","_delete"]);
const { options } = useOption();
const delete_img = ref(null);
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

const rules = {
  type: { required },
  truck_body: { required },
  weight: { required },
  volume: { required },
  loading_type: { required },
  truck_type_parametr: { required },
  main_driver: { required },
  document: {
    license_plate: { required },
    model: { required },
    ayear: { required },
    fuel_type: { required },
    serial: { required },
  },
};

const items = ref([
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
  {
    label: "O'chirish",
    icon: "material-symbols:delete-outline",
    command:()=>{
      emit("_delete",props.cardData.id);
    }
  },
]);
const $v = useVuelidate(rules, formData);

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
          formData.images.push({
            id: delete_img.value.id,
            image: jpegBase64String,
          });
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
    delete_img.value = formData.images[ind];
    console.log("Image deleted", delete_img.value);
    formData.images.splice(ind, 1);
  }
}

const toggle = (event) => {
  menu.value.toggle(event);
};

function checkInvalidFields() {
  const invalidFields = [];

  // Check main fields
  if ($v.value.type.$invalid) invalidFields.push("Transport turi");
  if ($v.value.truck_body.$invalid) invalidFields.push("Kuzov turi");
  if ($v.value.weight.$invalid) invalidFields.push("Yuk ko'tarish vazni");
  if ($v.value.volume.$invalid) invalidFields.push("Yuk olish hajmi");
  if ($v.value.loading_type.$invalid)
    invalidFields.push("Yuklash yo'nalishlari");

  // Check document fields
  if ($v.value.document.license_plate.$invalid)
    invalidFields.push("Davlat raqami");
  if ($v.value.document.model.$invalid) invalidFields.push("Modeli");
  if ($v.value.document.ayear.$invalid) invalidFields.push("Yili");
  if ($v.value.document.fuel_type.$invalid) invalidFields.push("Yoqilg'i turi");
  if ($v.value.document.serial.$invalid)
    invalidFields.push("Tex pasport seriya va raqami");

  return invalidFields;
}
async function _save() {
  $v.value.$touch();
  const invalidFields = checkInvalidFields();
  formData.document.ayear = timeFormatter(formData.document.ayear);
  if (invalidFields.length > 0) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Barcha maydonlarni to'ldiring",
      life: 3000,
    });
    return;
  }
  if (!formData.document.main_file) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Tex pasport old rasmini yuklang",
      life: 3000,
    });
    return;
  }
  if (!formData.document.back_file) {
    toast.add({
      severity: "error",
      summary: "Xatolik",
      detail: "Tex pasport orqa rasmini yuklang",
      life: 3000,
    });
    return;
  }
  // if(!formData.images || formData.images.length<2){
  //   toast.add({
  //     severity: "error",
  //     summary: "Xatolik",
  //     detail: "Transport rasmlari eng kamida 2ta bo'lishi kerak",
  //     life: 3000,
  //   });
  //   return;
  // }
  try {
    
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
    delete formData.document.vehicle;
    if (formData.images.length == 0) {
      delete formData.images;
    }
    updateLoading.value = true;
    await useApi(`/v1/driver/vehicle/${props.cardData.id}`, {
      method: "PATCH",
      body: formData,
    })
      .then(() => {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Vehicle saved successfully",
          life: 3000,
        });
        emit("UpdateData");
        updateLoading.value = false;
        isOpen.value = false;
      })
      .catch(() => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save vehicle",
          life: 3000,
        });
        updateLoading.value = false;
      })
      .finally(() => {
        updateLoading.value = false;
      });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Xəta",
      detail: "Serverda xatolik",
      life: 3000,
    });
  }
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
      formData.document.ayear = new Date(res.document["ayear"], 1, 1);
      isOpen.value = true;
    }
  });
}
</script>

<style lang="scss" scoped></style>
