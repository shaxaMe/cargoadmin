<template>
    <div class="card rounded-lg scroll default">
        <div class="w-full rounded-xl border min-w-fit overflow-hidden">
          <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3">ID</th>
                <th scope="col" class="px-6 py-3">Клиент</th>
                <th scope="col" class="px-6 py-3">Маршрут</th>
                <!-- <th scope="col" class="px-6 py-3">Тип кузова</th> -->
                <th scope="col" class="px-6 py-3">Статус</th>
                <th scope="col" class="px-6 py-3">Сумма</th>
                <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in props.application" v-if="props.application && props.application.length > 0"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td class="px-6 py-4">{{ i + 1 }}</td>
                <td class="px-6 py-4">Test</td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                {{ setFlags(item.locations,'from')[0] }} {{ setKeys(item.locations, "from") }}-{{ setFlags(item.locations,'to')[0] }} {{ setKeys(item.locations, "to") }}
                </td>
                
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1.5 text-sm font-medium 'bg-green-100 text-green-800"
                  >
                    wait
                  </span>
                </td>
                <td class="px-6 py-4">
                  {{
                    item.price
                  }}
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                >
                  <div class="flex justify-end space-x-3">
                    <button @click="getEditData(item.id)" class="text-indigo-600 hover:text-indigo-900">
                      <Icon name="line-md:edit" class="w-4 h-4"></Icon>
                      <span class="sr-only">Редактировать</span>
                    </button>
                    <button @click="$emit('_delete',item.id)" class="text-red-600 hover:text-red-900">
                      <Icon name="mi:delete-alt" class="w-4 h-4"></Icon>
                      <span class="sr-only">Удалить</span>
                    </button>
                  </div>
                </td> 
              </tr>
            </tbody>
          </table>
        </div>
        <Modal
      v-model="isOpen"
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
        <div class="flex-1 relative grid gap-3 grid-cols-5">
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
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.volume" />
              <label for="username">Hajmi</label>
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
    <Modal v-model="isOpen" @_save="_saveUserAway" :title="modalTitle" v-else>
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
        <div class="flex-1 relative grid gap-3 grid-cols-5">
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
          </InputGroup>
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="userAway.volume" />
              <label for="username">Hajmi</label>
            </FloatLabel>
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
  application: { type: Array, required: true },
});

const { options } = useOption();
const emit = defineEmits(["_update",'_delete']);
const fromValue = ref(null);
const { user } = useAuth();
const toValue = ref(null);
const toOptionsData = ref([]);
const fromOptions = ref([]);
const fromCoord = ref([]);
const toCoord = ref([]);
const isOpen = ref(false);
const optionsCar = ref([]);
const currenceselect = ref(null)
const formData = reactive({
  weight: null,
  volume: null,
  price: null,
  to_radius: null,
  from_radius: null,
  vehicle: null,
  departure_date: null,
  locations: [],
});
const userAway = reactive({
  from_name: null,
  from_latitude: null,
  from_longitude: null,
  from_radius: null,
  from_country: null,
  to_name: null,
  to_latitude: null,
  to_longitude:null,
  to_radius: null,
  to_country:null,
  loading_date:null,
  vehicle_quantity: null,
  truck_body: null,
  cargo_type: null,
  weight: null,
  volume: null,
  price: null,
  currency: null,
  note: "Adfsdg",
  user: user.id,
});
const urlLists = computed(() => {
  let obj = {
    getUrl:
      user.role == "USER"
        ? `/v1/cargo/application/`
        : `/v1/driver/vehicle-application/`,
    putUrl:
      user.role == "USER"
        ? `/v1/cargo/application/`
        : `/v1/driver/vehicle/`,
  };
  return obj;
});
const modalTitle = computed(() => {
  return user.role == "USER" ? "Yuk qo'shish" : "Yo'nalish qo'shish";
});


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
    useApi(urlLists.value.putUrl+currenceselect.value, {
    method: "PUT",
    body: {
      ...userAway,
      loading_date: formatDate(userAway.loading_date),
    },
  }).then((res) => {
    isOpen.value = false;
    emit("_update");
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

function getEditData(id) {
    currenceselect.value = id;
  useApi(urlLists.value.getUrl+id).then((res) => {
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

function setFlags(locations, keyname) {
  if (locations) {
    let str = locations
      .map((d) => {
        if (d.direction === keyname) {
          return d.country.flag;
        }
      }).filter((d)=>d!=null);
    return str
  }
}
function _save() {
  formData.locations = [...fromCoord.value, ...toCoord.value];

  useApi(urlLists.value.putUrl+currenceselect.value, {
    method: "PUT",
    body: {
      ...formData,
      departure_date: formatDate(formData.departure_date),
    },
  }).then((res) => {
    isOpen.value = false;
    emit("_update");
  });
}
watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal) {
      useApi("/v1/driver/vehicles").then((res) => {
        optionsCar.value = res.results.map((d) => ({
          id: d.id,
          name: d.document.model,
        }));
      });
    }
  }
);
</script>

<style lang="scss" scoped>

</style>