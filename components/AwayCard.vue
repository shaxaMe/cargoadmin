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
      <p class="text-gray-500 text-xs mt-1">{{ item.departure_date }}</p>
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
    <div class="flex gap-1 flex-1 justify-between">
      <div class="flex gap-2 items-center">
        <p class="line-clamp-1">
          {{ item.price }}
        </p>
      </div>
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
    <Modal v-model="isOpen" @_save="_save" title="Йўналишни ўзгартириш">
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
          <InputGroup>
            <FloatLabel variant="on">
              <InputNumber id="username" v-model="formData.radius" />
              <label for="username">Radius</label>
            </FloatLabel>
          </InputGroup>
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
  </div>
</template>

<script setup>
import { useAuth } from '~/store/auth';
const props = defineProps({
  item: { type: Object, required: true },
});
const emit = defineEmits(["_update"]);
const fromValue = ref(null);
const {user} = useAuth();
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
  to_radius:null,
  from_radius:null,
  vehicle: null,
  departure_date: null,
  locations: [],
});

const urlLists = computed(()=>{
  let obj = {
    getUrl:user.role=="USER"?`/v1/cargo/application/${props.item.id}`:`/v1/driver/vehicle-application/${props.item.id}`,
    putUrl:user.role=="USER"?`/v1/cargo/application/${props.item.id}`:`/v1/driver/vehicle/${props.item.id}`,
  }
  return obj;
})
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
  },
]);
const toggle = (event) => {
  // let data = menuitem.value[0];
  menuitem.value.toggle(event);
};

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
        if (!item.uri ||!uniqueData.some((existingItem) => existingItem.uri === item.uri)) {
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

async function getLocations(keyname) {
  let items = keyname == "from" ? fromValue.value : toValue.value;
  let coords = [];
  let existingCoords = keyname == "from" ? fromCoord.value : toCoord.value;
  console.log("Getting locations",existingCoords)
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
        country:res.response.GeoObjectCollection.featureMember[0]['GeoObject']['metaDataProperty']['GeocoderMetaData']['Address']['country_code']
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
      toOptionsData.value = res.locations.filter((d) => d.direction == "to");
      fromOptions.value = res.locations.filter((d) => d.direction == "from");
      for (let i in res) {
        formData.value[i] = res[i];
      }
      fromCoord.value = res.locations.filter((d) => d.direction == "from");
      toCoord.value = res.locations.filter((d) => d.direction == "to");
      toValue.value = res.locations.filter((d) => d.direction == "to");
      fromValue.value = res.locations.filter((d) => d.direction == "from");
    }
    isOpen.value = true;
  });
}
function _save() {
  formData.value.locations = [...fromCoord.value, ...toCoord.value];

  useApi(urlLists.value.putUrl, {
    method: "PUT",
    body: {
      ...formData.value,
      departure_date: formatDate(formData.value.departure_date),
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

<style lang="scss" scoped></style>
