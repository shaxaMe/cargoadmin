<template>
  <div class="px-5 py-6">
    <div>
      <div class="flex justify-end mb-5">
        <button
          @click="isOpen = true"
          class="bg-[#3b72f1] gap-2 text-white flex justify-center items-center text-center px-6 py-4 rounded-lg"
        >
          <Icon
            size="20px"
            name="streamline:travel-places-street-sign-crossroad-street-sign-metaphor-directions"
          />
          <span>yo'nalish qo'shish </span>
        </button>
      </div>

      <div class="mt-5">
        <h1 class="text-2xl font-semibold">
          найти подхонашиые и выгодны грузы
        </h1>
        <div class="flex justify-between flex-col gap-1 px-3 py-4">
          <div class="flex justify-between">
            <p class="text-sm text-gray-400 flex-1">Қаердан</p>
            <p class="text-sm text-gray-400 flex-1">Қаерга</p>
            <p class="text-sm text-gray-400 flex-1">Қўшимча маълумот</p>
            <p class="text-sm text-gray-400 flex-1">Сумма</p>
            <!-- <p class="text-sm text-gray-400">ОТВЕТСТВЕННЫЙ</p> -->
          </div>
          <div
            v-for="(item, i) in application"
            v-if="application && application.length > 0"
          >
            <AwayCard :item="item" @_save="getApplications" />
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="isOpen" @_save="_save">
      <div class="flex justify-between gap-4 py-3 items-stretch w-full">
        <div class="flex-1 relative">
          <InputGroup>
            <FloatLabel variant="on">
              <!-- <InputText id="username" v-model="value" /> -->
              <MultiSelect
                v-model="fromValue"
                :options="fromOptions"
                optionLabel="name"
                filter
                @change="getLocations('from')"
                @filter="filterOptions"
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
        </div>
        <div class="flex h-auto items-center justify-center cursor-pointer">
          <Icon
            name="tdesign:arrow-left-right-3"
            class="text-gray-400"
            size="25px"
          />
        </div>
        <div class="flex-1 relative">
          <InputGroup>
            <FloatLabel variant="on">
              <!-- <InputText id="username" v-model="value" /> -->
              <MultiSelect
                optionLabel="name"
                class="toselect"
                filter
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
const isOpen = ref(false);

const fromValue = ref(null);
const toValue = ref(null);
const toOptionsData = ref([]);
const fromOptions = ref([]);
const fromCoord = ref([]);
const toCoord = ref([]);
const optionsCar = ref([]);

const formData = reactive({
  weight: null,
  volume: null,
  price: null,
  radius: null,
  vehicle: null,
  departure_date: null,
  locations: [],
});

const application = ref([]);
async function filterOptions(key) {
  if (key.value) {
    useApi(`/v1/service/yandex-suggest?text=${key.value}&results=20`).then(
      (res) => {
        fromOptions.value = res.results.map((item, i) => ({
          name: item.title.text,
          code: item.code,
          ...item,
        }));
      }
    );
  }
}

async function toOptions(params) {
  if (params.value) {
    useApi(`/v1/service/yandex-suggest?text=${params.value}&results=20`).then(
      (res) => {
        toOptionsData.value = res.results.map((item, i) => ({
          name: item.title.text,
          code: i,
          ...item,
        }));
      }
    );
  }
}
async function getLocations(keyname) {
  let items = keyname == "from" ? fromValue.value : toValue.value;
  let coords = [];
  items.forEach((element) => {
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
      };
      coords.push(obj);
    });
  });
  if (keyname == "from") {
    fromCoord.value = coords;
  } else {
    toCoord.value = coords;
  }
}

function _save() {
  formData.locations = [...fromCoord.value, ...toCoord.value];
  useApi("/v1/driver/vehicle-application", {
    method: "POST",
    body: { ...formData, departure_date: formatDate(formData.departure_date) },
  }).then(()=>{
    getApplications()
  });
}
function getApplications() {
  useApi("/v1/driver/vehicle-application").then((res) => {
    application.value = res.results;
  });
}

onMounted(() => {
  getApplications();
});
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
