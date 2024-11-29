<template>
  <div
    class="flex justify-between bg-white shadow-md px-4 py-3 gap-4 rounded-md"
  >
    <div class="flex flex-col gap-1 flex-1 w-fit">
      <div class="flex gap-2 items-center">
        <!-- <p
          class="p-1 rounded-md bg-gray-200 text-gray-500 flex items-center gap-1"
        >
          <Icon name="twemoji:flag-russia" size="1.2em" /><span
            class="text-[.9em]"
            >Ru</span
          >
        </p> -->
        <p class="line-clamp-1">{{ setKeys(item.locations, "from") }}</p>
      </div>
      <p class="text-gray-500 text-xs mt-1 ">
        {{ item.departure_date.split("-").reverse().join("-") }}
      </p>
    </div>
    <div class="flex flex-col gap-1 flex-1 w-fit">
      <div class="flex gap-2 items-center">
        <!-- <p
          class="p-1 rounded-md bg-gray-200 text-gray-500 flex items-center gap-1"
        >
          <Icon name="twemoji:flag-russia" size="1.2em" /><span
            class="text-[.9em]"
            >Ru</span
          >
        </p> -->
        <p class="line-clamp-1">{{ setKeys(item.locations, "to") }}</p>
      </div>
    </div>
    <div class="flex flex-col justify-start items-start gap-1 flex-1">
      <div class="flex gap-2 items-center flex-wrap">
        <Tag severity="secondary" :value="`${item.weight} t`"></Tag>
        <Tag severity="secondary" :value="`${item.volume} ㎥`"></Tag>
      </div>
    </div>
    <div class="flex-1 flex justify-start items-center" v-if="user.role != 'USER'">
       {{ carName(item.vehicle.id) }}
    </div>
    <div class="flex gap-1 flex-1 justify-between">
      <div class="flex gap-3 items-center">
        <p class="line-clamp-1">
          {{ item.price }}
        </p>
      </div>
      <nuxt-link :to="{ path: '/cargosearch', query: setQuery(item) }" class="flex cursor-pointer bg-slate-100 rounded-xl px-2 py-1 max-w-[160px] text-center text-xs items-center">
      {{ user.role == "DRIVER"?"10 ta mos yuk topildi":"10 ta mos mashina topildi"  }}
    </nuxt-link>
      <div class="card flex justify-center">
        <Button
          type="button"
          icon="pi pi-ellipsis-v"
          @click="toggle"
          class="!bg-transparent !border-none !text-gray-400"
          aria-haspopup="true"
          aria-controls="card_option"
        />
        <!-- <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" /> -->
        <Menu ref="menuitem" id="card_option" :model="items" :popup="true">
          <template #item="{ item, props }">
            <div class="flex items-center justify-start gap-1 px-4 py-1">
              <Icon :name="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </div>
          </template>
        </Menu>
      </div>
    </div>
   
    <Modal
      v-model="isOpen"
      :loading="saveLoading"
      v-if="user.role != 'USER'"
      @_save="_save"
      title="Йўналишни ўзгартириш"
    >
      <div class="flex justify-between gap-4 py-3 items-stretch w-full">
        <div class="flex-1 relative flex gap-1 items-center">
          <InputGroup class="flex-1">
            <FloatLabel variant="on">
              <!-- <InputText id="username" v-model="value" /> -->
              <MultiSelect
                v-model="fromValue"
                :options="fromOptions"
                optionLabel="name"
                filter
                @change="getLocations('from')"
                @filter="filterOptions"
                :selectionLimit="1"
                placeholder=""
                :maxSelectedLabels="3"
                class="w-full md:w-80 fromselect"
              >
                <template #empty>
                  <div class="px-2 py-0">Manzil nomini kiriting</div>
                </template>
                <template #emptyfilter>
                  <span>Natija topilmadi</span>
                </template>
              </MultiSelect>
              <label for="username">Qayerdan</label>
            </FloatLabel>

            <!-- <InputGroupAddon class="text-xs">Radius (km)</InputGroupAddon> -->
          </InputGroup>
          <InputGroup class="flex-1 max-w-28">
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.from_radius" />
              <label for="username">Radius</label>
            </FloatLabel>
          </InputGroup>
        </div>
        <div class="flex h-auto items-center justify-center cursor-pointer">
          <Icon
            name="tdesign:arrow-left-right-3"
            class="text-gray-400"
            size="25px"
          />
        </div>
        <div class="flex-1 relative flex items-center gap-1">
          <InputGroup class="flex-1">
            <FloatLabel variant="on">
              <!-- <InputText id="username" v-model="value" /> -->
              <MultiSelect
                optionLabel="name"
                class="toselect"
                filter
                :selectionLimit="1"
                v-model="toValue"
                @change="getLocations('to')"
                :options="toOptionsData"
                @filter="toOptions"
              >
                <template #empty>
                  <div class="px-2 py-0">Manzil nomini kiriting</div>
                </template>
                <template #emptyfilter>
                  <span>Natija topilmadi</span>
                </template>
              </MultiSelect>
              <label for="username">Qayerga</label>
            </FloatLabel>
            <!-- <InputGroupAddon class="text-xs">Radius (km)</InputGroupAddon> -->
          </InputGroup>
          <InputGroup class="flex-1 max-w-28">
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.to_radius" />
              <label for="username">Radius</label>
            </FloatLabel>
          </InputGroup>
        </div>
      </div>
      <div class="flex justify-between gap-4 items-stretch w-full mt-4">
        <div class="flex-1 relative grid gap-3 grid-cols-2">
          <!-- <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.radius" />
              <label for="username">Radius</label>
            </FloatLabel>
          </InputGroup> -->
          <InputGroup>
            <FloatLabel variant="on">
              <DatePicker
                v-model="formData.departure_date"
                showIcon
                fluid
                iconDisplay="input"
                class="w-full h-full min-h-[40px]"
                dateFormat="dd.mm.yy"
              />
              <label for="username">Jo'nash vaqti</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <Select
                v-model="formData.vehicle"
                :options="optionsCar"
                optionLabel="name"
                optionValue="id"
                class="w-full text-sm"
              />
              <label for="username">Avtomobil</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.price" />
              <label for="username">Narxi</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.weight" />
              <label for="username">Vazni</label>
            </FloatLabel>
            <InputGroupAddon>тонн</InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.volume" />
              <label for="username">Hajmi</label>
            </FloatLabel>
            <InputGroupAddon>м³</InputGroupAddon>
          </InputGroup>
        </div>
        <!-- <div class="flex-1 relative grid gap-2 grid-cols-4">
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Vazni</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Vazni (gacha)</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Hajmi</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Hajmi(gacha)</label>
            </FloatLabel>
          </InputGroup>
        </div> -->
      </div>
    </Modal>
    <Modal :loading="saveLoading" v-model="isOpen" @_save="_saveUserAway" :title="modalTitle" v-else>
      <div class="flex justify-between gap-4 py-3 items-stretch w-full">
        <div class="flex-1 relative flex gap-1 items-center">
          <InputGroup class="flex-1">
            <FloatLabel variant="on">
              <!-- <InputText id="username" v-model="value" /> -->
              <MultiSelect
                v-model="fromValue"
                :options="fromOptions"
                optionLabel="name"
                filter
                @change="getLocations('from')"
                @filter="filterOptions"
                @show="focusSearchInput"
                :selectionLimit="1"
                placeholder=""
                :maxSelectedLabels="3"
                class="w-full md:w-80 fromselect"
              >
                <template #empty>
                  <div class="px-2 py-0">Manzil nomini kiriting</div>
                </template>

                <template #emptyfilter>
                  <span>Natija topilmadi</span>
                </template>
              </MultiSelect>
              <label for="username">Qayerdan</label>
            </FloatLabel>

            <!-- <InputGroupAddon class="text-xs">Radius (km)</InputGroupAddon> -->
          </InputGroup>
          <InputGroup class="flex-1 max-w-28">
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="userAway.from_radius" />
              <label for="username">Radius</label>
            </FloatLabel>
          </InputGroup>
        </div>
        <div class="flex h-auto items-center justify-center cursor-pointer">
          <Icon
            name="tdesign:arrow-left-right-3"
            class="text-gray-400"
            size="25px"
          />
        </div>
        <div class="flex-1 relative flex items-center gap-1">
          <InputGroup class="flex-1">
            <FloatLabel variant="on">
              <!-- <InputText id="username" v-model="value" /> -->
              <MultiSelect
                optionLabel="name"
                class="toselect"
                filter
                :selectionLimit="1"
                v-model="toValue"
                @show="focusSearchInput"
                @change="getLocations('to')"
                :options="toOptionsData"
                @filter="toOptions"
              >
                <template #empty>
                  <div class="px-2 py-0">Manzil nomini kiriting</div>
                </template>

                <template #emptyfilter>
                  <span>Natija topilmadi</span>
                </template>
              </MultiSelect>
              <label for="username">Qayerga</label>
            </FloatLabel>
            <!-- <InputGroupAddon class="text-xs">Radius (km)</InputGroupAddon> -->
          </InputGroup>
          <InputGroup class="flex-1 max-w-28">
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="userAway.to_radius" />
              <label for="username">Radius</label>
            </FloatLabel>
          </InputGroup>
        </div>
      </div>
      <div class="flex justify-between gap-4 items-stretch w-full mt-4">
        <div class="flex-1 relative grid gap-3 grid-cols-2">
          <!-- <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.radius" />
              <label for="username">Radius</label>
            </FloatLabel>
          </InputGroup> -->
          <InputGroup>
            <FloatLabel variant="on">
              <DatePicker
                v-model="userAway.loading_date"
                showIcon
                fluid
                iconDisplay="input"
                class="w-full h-full min-h-[40px]"
                dateFormat="dd.mm.yy"
              />
              <label for="username">Jo'nash vaqti</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup v-if="user.role != 'USER'">
            <FloatLabel variant="on">
              <Select
                v-model="userAway.vehicle"
                :options="optionsCar"
                optionLabel="name"
                optionValue="id"
                class="w-full text-sm"
              />
              <label for="username">Avtomobil</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <Select
                v-model="userAway.truck_body"
                :options="options.truck_type_parametr"
                optionLabel="name"
                optionValue="id"
                class="w-full text-sm"
              />
              <label for="email" class="font-semibold mb-2">Kuzov turi</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="userAway.price" />
              <label for="username">Narxi</label>
            </FloatLabel>
            <InputGroupAddon>
              <Select
                v-model="userAway.currency"
                :options="options.currency"
                optionLabel="name"
                optionValue="id"
                size="small"
                class="w-full text-sm currenceselect"
            /></InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="userAway.weight" />
              <label for="username">Vazni</label>
            </FloatLabel>
            <InputGroupAddon>тонн</InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="userAway.volume" />
              <label for="username">Hajmi</label>
            </FloatLabel>
            <InputGroupAddon>м³</InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="userAway.vehicle_quantity" />
              <label for="username">Mashina soni</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup v-if="user.role == 'USER'">
            <FloatLabel variant="on">
              <Select
                v-model="userAway.cargo_type"
                :options="options.cargoType"
                optionLabel="name"
                optionValue="id"
                class="w-full text-sm"
              />
              <label for="email" class="font-semibold mb-2">Yuk turi</label>
            </FloatLabel>
          </InputGroup>
        </div>
        <!-- <div class="flex-1 relative grid gap-2 grid-cols-4">
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Vazni</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Vazni (gacha)</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Hajmi</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputText id="username" v-model="value" />
              <label for="username">Hajmi(gacha)</label>
            </FloatLabel>
          </InputGroup>
        </div> -->
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { useAuth } from "~/store/auth";
import { useOption } from "../store/option";
const props = defineProps({
  item: { type: Object, required: true },
});
const saveLoading = ref(false);
const { options } = useOption();
const emit = defineEmits(["_update",'_dalete']);
const fromValue = ref(null);
const { user } = useAuth();
const toValue = ref(null);
const toOptionsData = ref([]);
const fromOptions = ref([]);
const fromCoord = ref([]);
const toCoord = ref([]);
const isOpen = ref(false);
const menuitem = ref(null);
const optionsCar = ref([]);
const formData = reactive({
  weight: null,
  volume: null,
  price: null,
  to_radius: 0,
  from_radius: 0,
  vehicle: null,
  departure_date: null,
  locations: [],
  currency: options?.currency[0]['id'],
});
const userAway = reactive({
  from_name: null,
  from_latitude: null,
  from_longitude: null,
  from_radius: 0,
  from_country: null,
  to_name: null,
  to_latitude: null,
  to_longitude:null,
  to_radius: 0,
  to_country:null,
  loading_date:null,
  vehicle_quantity: null,
  truck_body: null,
  cargo_type: null,
  weight: null,
  volume: null,
  price: null,
  currency: options?.currency[0]['id'],
  note: "Adfsdg",
  user: user.id,
});
const urlLists = computed(() => {
  let obj = {
    getUrl:
      user.role == "USER"
        ? `/v1/cargo/application/${props.item.id}`
        : `/v1/driver/vehicle-application/${props.item.id}`,
    putUrl:
      user.role == "USER"
        ? `/v1/cargo/application/${props.item.id}`
        : `/v1/driver/vehicle/${props.item.id}`,
  };
  return obj;
});
const modalTitle = computed(() => {
  return user.role == "USER" ? "Yuk qo'shish" : "Yo'nalish qo'shish";
});
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
    command: () => {
      emit("_dalete", props.item.id);
    }
  },
]);
const toggle = (event) => {
  // let data = menuitem.value[0];
  menuitem.value.toggle(event);
};
function setQuery(item){
  console.log(item);
  let obj = {
    vehicle_application_id:item.id,
    // from_volume:item.from_volume,
    // from_volume: item.volume,
    // // to_weight: item.to_weight,
    // from_weight: item.weight,
  }
  return obj;
}
function carName(id){
  let data = optionsCar.value.find(d=>d.id == id);
  return data?.name || '';
}
// async function filterOptions(key) {
//   if (key.value) {
//     useApi(`/v1/service/yandex-suggest?text=${key.value}&results=20`).then(
//       (res) => {
//         fromOptions.value = res.results.map((item, i) => ({
//           name: item.title.text,
//           code: item.code,
//           ...item,
//         }));
//       }
//     );
//   }
// }

async function filterOptions(key) {
  if (key.value) {
    try {
      // API dan yangi ma'lumotlarni olish
      const res = await useApi(
        `/v1/service/yandex-suggest?text=${key.value}&results=20`
      );
      // Yangi natijalarni qayta ishlash
      const newData = res.results.map((item) => ({
        name: item.title.text,
        code: item.uri, // Manzillarni `uri` bo'yicha tekshiramiz
        ...item,
      }));

      // Eski va yangi ma'lumotlarni birlashtirish
      const allData = [...fromOptions.value, ...newData];

      // Unikal `uri` bo‘yicha birinchi kelgan manzilni saqlash
      const uniqueData = [];
      allData.forEach((item) => {
        // Agar item `uri` avvalgi manzillarda mavjud bo'lmasa, qo‘shamiz
        if (
          !item.uri ||
          !uniqueData.some((existingItem) => existingItem.uri === item.uri)
        ) {
          uniqueData.push(item);
        }
      });

      // `fromOptions.value` ni faqat unikal manzillar bilan yangilash
      fromOptions.value = uniqueData;

      // Yangi ma'lumotlar qo‘shilganini tekshirish uchun konsolga chiqarish
    } catch (error) {
      console.error("API dan ma'lumot olishda xato:", error);
    }
  }
}

// async function toOptions(params) {
//   if (params.value) {
//     useApi(`/v1/service/yandex-suggest?text=${params.value}&results=20`).then(
//       (res) => {
//         toOptionsData.value = res.results.map((item, i) => ({
//           name: item.title.text,
//           code: i,
//           ...item,
//         }));
//       }
//     );
//   }
// }
async function toOptions(params) {
  if (params.value) {
    try {
      // API dan yangi ma'lumotlarni olish
      const res = await useApi(
        `/v1/service/yandex-suggest?text=${params.value}&results=20`
      );

      // Yangi natijalarni qayta ishlash
      const newData = res.results.map((item, i) => ({
        name: item.title.text,
        code: item.uri, // Manzillarni `uri` bo'yicha tekshiramiz
        ...item,
      }));

      // Eski ma'lumotlar bilan birlashtirish
      const allData = [...toOptionsData.value, ...newData];

      // Unikal `uri` bo‘yicha birinchi kelgan manzilni saqlash
      const uniqueData = [];
      allData.forEach((item) => {
        // Agar item `uri` avvalgi manzillarda mavjud bo'lmasa, qo‘shamiz
        if (
          !item.uri ||
          !uniqueData.some((existingItem) => existingItem.uri === item.uri)
        ) {
          uniqueData.push(item);
        }
      });

      // `toOptionsData.value` ni faqat unikal manzillar bilan yangilash
      toOptionsData.value = uniqueData;
    } catch (error) {
      console.error("API dan ma'lumot olishda xato:", error);
    }
  }
}
function _saveUserAway(){
    userAway.from_name = fromCoord.value[0]["name"],
    userAway.from_latitude = fromCoord.value[0]["latitude"],
    userAway.from_longitude = fromCoord.value[0]["longitude"],
    userAway.from_country = fromCoord.value[0]["country"],
    userAway.to_name = toCoord.value[0]["name"],
    userAway.to_latitude = toCoord.value[0]["latitude"],
    userAway.to_longitude = toCoord.value[0]["longitude"],
    userAway.to_country = toCoord.value[0]["country"];
    userAway.user = user.id
    saveLoading.value = true;
    useApi(urlLists.value.putUrl, {
    method: "PUT",
    body: {
      ...userAway,
      loading_date: formatDate(userAway.loading_date),
    },
  }).then((res) => {
    saveLoading.value = false;
    isOpen.value = false;
    emit("_update");
  }).catch((e)=>{
    saveLoading.value = false;
  });
}
async function getLocations(keyname) {
  let items = keyname == "from" ? fromValue.value : toValue.value;
  let coords = [];
  let existingCoords = keyname == "from" ? fromCoord.value : toCoord.value;
  items.forEach((element) => {
    if (element.uri) {
      useApi(`/v1/service/yandex-geocode?uri=${element.uri}`).then((res) => {
        let obj = {
          name: element.name,
          latitude: parseFloat(
            res.response.GeoObjectCollection.featureMember[0]["GeoObject"][
              "Point"
            ]["pos"].split(" ")[1]
          ).toFixed(2),
          longitude: parseFloat(
            res.response.GeoObjectCollection.featureMember[0]["GeoObject"][
              "Point"
            ]["pos"].split(" ")[0]
          ).toFixed(2),
          direction: keyname,
          country:
            res.response.GeoObjectCollection.featureMember[0]["GeoObject"][
              "metaDataProperty"
            ]["GeocoderMetaData"]["Address"]["country_code"],
        };
        coords.push(obj);
        if (keyname == "from") {
          fromCoord.value = [...existingCoords, ...coords]; // Eski manzillarni qo'shish
          // console.log(fromCoord.value);
        } else {
          toCoord.value = [...existingCoords, ...coords]; // Eski manzillarni qo'shish
          // console.log(toCoord.value);
        }
      });
    }
  });
}
function setKeys(locations, keyname) {
  if (locations) {
    let str = locations
      .map((d) => {
        if (d.direction === keyname) {
          return d.name;
        }
      })
      .filter((name) => name != null);
    return str.join(",");
  }
}

function getEditData() {
  useApi(urlLists.value.getUrl).then((res) => {
    // formData.value = res
    if (res) {
      if (user.role != "USER") {
        toOptionsData.value = res.locations.filter((d) => d.direction == "to");
        fromOptions.value = res.locations.filter((d) => d.direction == "from");
        for (let i in res) {
          formData[i] = res[i];
        }
        fromCoord.value = res.locations.filter((d) => d.direction == "from");
        toCoord.value = res.locations.filter((d) => d.direction == "to");
        toValue.value = res.locations.filter((d) => d.direction == "to");
        fromValue.value = res.locations.filter((d) => d.direction == "from");
      }else{
        const transformedData = {
  locations: [
    {
      id: res.id * 10 + 1, // unique ID yaratish uchun
      direction: "from",
      name: res.from_name,
      latitude: res.from_latitude,
      longitude: res.from_longitude,
      radius: res.from_radius,
      country: res.from_country
    },
    {
      id: res.id * 10 + 2, // unique ID yaratish uchun
      direction: "to",
      name: res.to_name,
      latitude: res.to_latitude,
      longitude: res.to_longitude,
      radius: res.to_radius,
      country: res.to_country
    }
  ],
}
 toOptionsData.value = transformedData.locations.filter(d => d.direction === "to");
 fromOptions.value = transformedData.locations.filter(d => d.direction === "from");

 fromCoord.value = transformedData.locations.filter(d => d.direction === "from");
 toCoord.value = transformedData.locations.filter(d => d.direction === "to");

 toValue.value = transformedData.locations.filter(d => d.direction === "to");
 fromValue.value = transformedData.locations.filter(d => d.direction === "from");
        for (let i in res) {
          userAway[i] = res[i];
        }
      }
    }
    isOpen.value = true;
  });
}
function _save() {
  formData.locations = [...fromCoord.value, ...toCoord.value];
  saveLoading.value = true;
  useApi(urlLists.value.putUrl, {
    method: "PUT",
    body: {
      ...formData,
      departure_date: formatDate(formData.departure_date),
    },
  }).then((res) => {
    saveLoading.value = false;
    isOpen.value = false;
    emit("_update");
  }).catch(()=>{
    saveLoading.value = false;
  });
}
watch(
  () => isOpen.value,
  (newVal) => {
    // if (newVal) {
    //   useApi("/v1/driver/vehicles").then((res) => {
    //     optionsCar.value = res.results.map((d) => ({
    //       id: d.id,
    //       name: d?.document?.license_plate,
    //     }));
    //   });
    // }
    if(!newVal){
      for(let i in formData){
        formData[i] = null;
        if(i == 'to_radius' || i=='from_radius'){
          formData[i] = 0;
        }
      }
      for(let i in userAway){
        userAway[i] = null;
        if(i == 'to_radius' || i=='from_radius'){
          userAway[i] = 0;
        }
      }
      toValue.value = null;
      fromValue.value = null;
    }
  }
);
onMounted(()=>{
  useApi("/v1/driver/vehicles").then((res) => {
        optionsCar.value = res.results.map((d) => ({
          id: d.id,
          name: d?.document?.license_plate,
        }));
      });
})
</script>

<style lang="scss" scoped></style>
