<template>
    <div class="px-5 py-6 w-full max-w-[100dvw]">
      <Toast />
      <div class="flex justify-end mb-5">
        <button
          @click="isOpen = true"
          class="bg-[#3b72f1] gap-2 text-white text-sm flex justify-center items-center text-center px-3 py-2 rounded-lg"
        >
          <Icon size="15px" name="material-symbols:person-add-rounded" />
          <span>Avtomobil qo'shish </span>
        </button>
      </div>
      <AutoparkTable @UpdateData="_update"
      @_delete="requireConfirmation" :results="results" />
      <Modal v-model="isOpen" @_save="_save" :title="modalTitle">
        <div class="card">
          <Tabs value="0">
              <TabList>
                  <Tab value="0">Основная информация</Tab>
                  <Tab value="1">Тех. паспорт</Tab>
                  <Tab value="2">Transport rasmlari</Tab>
              </TabList>
              <TabPanels>
                  <TabPanel value="0">
                    <div
          class="flex items-center mt-3 max-lg:flex-wrap gap-5 max-md:grid max-md:grid-cols-1"
        >
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
        <div
          class="flex items-center gap-5 mt-5 max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1"
        >
          <div class="flex-1 flex flex-col">
            <label for="username" class="font-semibold mb-2"
              >Yuk ko’tarish vazni (t)</label
            >
            <InputNumber
              v-model="formData.weight"
              :invalid="$v.weight.$error"
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
              :invalid="$v.volume.$error"
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
              :invalid="$v.loading_type.$error"
              class="w-full text-sm"
            />
          </div>
        </div>
                  </TabPanel>
                  <TabPanel value="1">
                    <div class="mt-3">
          <!-- <h1 class="p-dialog-title">Texnik xarakteristikalar</h1> -->
          <div
            class="grid grid-cols-3 items-center gap-5 mt-5 max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1"
          >
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
            <div class="flex-1 flex flex-col">
              <label for="email" class="font-semibold mb-2">Turi</label>
              <!-- <InputText id="email" class="flex-auto" autocomplete="off" /> -->
              <InputText
                v-model="formData.document.type"
                class="flex-auto"
                autocomplete="off"
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
            <div
              class="flex-1 flex items-stretch gap-5 w-full max-md:grid max-md:grid-cols-1"
            >
              <div class="flex-1 flex flex-col max-w-[300px] max-md:max-w-full">
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
              <div class="flex-1 flex flex-col max-w-[300px] max-md:max-w-full">
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
        
                  </TabPanel>
                  <TabPanel value="2">
                    <div class="my-3">
          <label class="font-semibold my-2">Transport rasmlari</label>
          <div
            class="w-full border border-dashed border-blue-400 px-4 py-3 rounded-md mt-5"
          >
            <div
              class="flex-1 grid grid-cols-4 gap-2 max-lg:grid-cols-2 max-md:grid-cols-1"
            >
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
                  :disabled="formData.images.length >= 5"
                  id="multiple"
                  @change="previewImage($event, 'multiple')"
                  class="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-0"
                />
              </div>
              <div
                class="w-full h-40 overflow-hidden rounded-md group relative flex justify-center items-center max-lg:items-end"
                v-for="(item, i) in formData.images"
                v-if="formData.images && formData.images.length > 0"
              >
                <img class="w-full h-full" :src="item.image" alt="fff" />
                <div
                  @click="_deleteImg('multiple'), i"
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
                  </TabPanel>
              </TabPanels>
          </Tabs>
      </div>
      </Modal>
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
      <ConfirmDialog></ConfirmDialog>
    </div>
  </template>
  
  <script setup>
  import { useOption } from "../store/option";
  import { useToast } from "primevue/usetoast";
  import { format } from "date-fns";
  import useVuelidate from "@vuelidate/core";
  import { required, sameAs } from "@vuelidate/validators";
  import { useAuth } from "~/store/auth";
  import { useConfirm } from "primevue/useconfirm";
  const { getDatas, options } = useOption();
  const { user } = useAuth();
  const toast = useToast();
  let isOpen = ref(false);
  const selectedCity = ref();
  let loading = ref(true);
  const imagesInput = ref(null);
  const confirm = useConfirm();
  const results = ref([]);
  const formData = reactive({
    type: null,
    truck_body: null,
    weight: null,
    volume: null,
    loading_type: null,
    truck_body_parameter: [5],
    note: "This is a test vehicle",
    main_driver: user.id,
    images: [],
    document: {
      color: 1,
      license_plate: null,
      model: null,
      ayear: null,
      fuel_type: null,
      type: null,
      serial: null,
      main_file: null,
      back_file: null,
      driver: 1,
    },
  });
  
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
  
  const $v = useVuelidate(rules, formData);
  
  const modalTitle = computed(() => {
    return user.role == "USER" ? "Yo'nalish qo'shish" : "Avtomobil qo'shish";
  });
  //methods
  function _deleteImg(key, ind) {
    if (key != "multiple") {
      let el = document.querySelector(`#${key}`);
      el.value = "";
      formData.document[key] = null;
    } else {
      formData.images.splice(ind, 1);
    }
  }
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
            formData.images.push({ image: jpegBase64String });
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
  
  function getVihicle() {
    useApi("/v1/driver/vehicles?status=wait", {
      method: "GET",
    })
      .then((res) => {
        results.value = res.results;
        loading.value = false;
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "Xəta",
          detail: "Serverda xatolik",
          life: 3000,
        });
        loading.value = false;
      })
      .finally(() => {
        loading.value = false;
      });
  }
  const requireConfirmation = (id) => {
    confirm.require({
      message: "Siz rostan ham tasdiqlaysizmi ?",
      header: "Ogohlantirish",
      // icon: 'pi pi-info-circle',
      rejectLabel: "Bekor qilish",
      rejectProps: {
        label: "Bekor qilish",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "O'chirish",
        severity: "danger",
      },
      accept: () => {
        let putUrl =
          user.role == "USER"
            ? `/v1/cargo/application/${id}`
            : `/v1/driver/vehicle/${id}`;
        useApi(putUrl, {
          method: "PATCH",
          body: {
            status: "archived",
            user: user.id,
          },
        })
          .then(() => {
            toast.add({
              severity: "success",
              summary: "Muvaffaqiyatli",
              detail: "Ma'lumot o'chirildi",
              life: 3000,
            });
            getVihicle();
          })
          .catch(() => {
            toast.add({
              severity: "error",
              summary: "Xatolik",
              detail: "Ma'lumot o'chirilmadi",
              life: 3000,
            });
          });
      },
      reject: () => {
        console.log("r");
      },
    });
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
  const _save = async () => {
    const invalidFields = checkInvalidFields();
    $v.value.$touch();
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
    if (!formData.images || formData.images.length < 2) {
      toast.add({
        severity: "error",
        summary: "Xatolik",
        detail: "Transport rasmlari eng kamida 2ta bo'lishi kerak",
        life: 3000,
      });
      return;
    }
    try {
      const formDataToSend = {
        ...formData,
        document: {
          ...formData.document,
          ayear: formData.document.ayear
            ? timeFormatter(formData.document.ayear)
            : null,
        },
      };
  
      await useApi("/v1/driver/vehicle", {
        method: "POST",
        body: formDataToSend,
      });
  
      isOpen.value = false;
      getVihicle();
  
      toast.add({
        severity: "success",
        summary: "Muvaffaqiyatli",
        detail: "Malumotlar saqlandi",
        life: 3000,
      });
    } catch (error) {
      // toast.add({
      //   severity: "error",
      //   summary: "Xəta",
      //   detail: "Serverda xatolik",
      //   life: 3000,
      // });
    }
  };
  
  function _update() {
    getVihicle();
  }
  onMounted(() => {
    getDatas();
    getVihicle();
  });
  </script>
  
  <style lang="scss" scoped></style>
  