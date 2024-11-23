<template>
    <div class="px-5 py-6">
      <Toast />
      <div v-if="!loading">
        <div class="flex justify-end mb-5">
          <button
            @click="isOpen = true"
            class="bg-[#3b72f1] gap-2 text-white text-sm flex justify-center items-center text-center px-3 py-2 rounded-lg"
          >
            <Icon
              size="15px"
              name="streamline:travel-places-street-sign-crossroad-street-sign-metaphor-directions"
            />
            <span
              >{{ user.role == "USER" ? "yuk qo'shish" : "yo'nalish qo'shish" }}
            </span>
          </button>
        </div>
        <Awaytable :application="application" @_update="getApplications" @_delete="requireConfirmation" />
        <Empty
          v-if="!loading && application.length==0"
          title="Hech qanday malumot topilmadi"
          subtitle="Yo'nalishlarni qo'shing"
        />
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
      <ConfirmDialog></ConfirmDialog>
    </div>
  </template>
  
  <script setup>
  import InputGroup from "primevue/inputgroup";
  import { useOption } from "../store/option";
  import Empty from "~/components/Empty.vue";
  import { useConfirm } from "primevue/useconfirm";
  import { useAuth } from "~/store/auth";
  import { useToast } from "primevue/usetoast";
import Awaytable from "~/components/Awaytable.vue";
  const isOpen = ref(false);
  const toast = useToast();
  const { getDatas, options } = useOption();
  const { user } = useAuth();
  const fromValue = ref(null);
  const toValue = ref(null);
  const toOptionsData = ref([]);
  const fromOptions = ref([]);
  const fromCoord = ref([]);
  const toCoord = ref([]);
  const optionsCar = ref([]);
  const confirm = useConfirm();
  let loading = ref(true);
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
    from_latitude:null,
    from_longitude:null,
    from_radius:null,
    from_country:null,
    to_name:null,
    to_latitude:null,
    to_longitude:null,
    to_radius: null,
    to_country: null,
    loading_date:null,
    vehicle_quantity:null,
    truck_body: null,
    cargo_type: null,
    weight:null,
    volume:null,
    price:null,
    currency:null,
    note: "Adfsdg",
    user: null,
  });
  
  const urlLists = computed(() => {
    let obj = {
      getUrl:
        user.role == "USER"
          ? "/v1/cargo/applications?status=wait"
          : "/v1/driver/vehicle-applications?status=wait",
      postUrl:
        user.role == "USER"
          ? "/v1/cargo/application"
          : "/v1/driver/vehicle-application",
    };
    return obj;
  });
  const modalTitle = computed(() => {
    return user.role == "USER" ? "Yuk qo'shish" : "Yo'nalish qo'shish";
  });
  const application = ref([]);
  const focusSearchInput = () => {
    // Use setTimeout to ensure the input is available after rendering
    setTimeout(() => {
      const input = document.querySelector(".p-multiselect-filter");
      if (input) {
        input.focus();
      }
    }, 0);
  };
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
          if (!uniqueData.some((existingItem) => existingItem.uri === item.uri)) {
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
  const requireConfirmation = (id) => {
    confirm.require({
          message: 'Siz rostan ham tasdiqlaysizmi ?',
          header: 'Ogohlantirish',
          // icon: 'pi pi-info-circle',
          rejectLabel: 'Bekor qilish',
          rejectProps: {
              label: 'Bekor qilish',
              severity: 'secondary',
              outlined: true
          },
          acceptProps: {
              label: 'O\'chirish',
              severity: 'danger'
          },
          accept: () => {
              let putUrl=user.role == "USER"? `/v1/cargo/application/${id}`: `/v1/driver/vehicle/${id}`;
              useApi(putUrl,{
                method: 'PATCH',
                body: {
                  status: "archived",
                  user:user.id
                }
              }).then(()=>{
                toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: 'Ma\'lumot o\'chirildi', life: 3000 });
                getApplications();
              }).catch(()=>{
                toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ma\'lumot o\'chirilmadi', life: 3000 });
              })
          },
          reject: () => {
              console.log('r')
          }
      });
  };
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
          if (!uniqueData.some((existingItem) => existingItem.uri === item.uri)) {
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
          country:
            res.response.GeoObjectCollection.featureMember[0]["GeoObject"][
              "metaDataProperty"
            ]["GeocoderMetaData"]["Address"]["country_code"],
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
    useApi(urlLists.value.postUrl, {
      method: "POST",
      body: { ...formData, departure_date: formatDate(formData.departure_date) },
    }).then(() => {
      getApplications();
      isOpen.value = false;
    });
  }
  function _saveUserAway() {
      userAway.from_name = fromCoord.value[0]["name"],
      userAway.from_latitude = fromCoord.value[0]["latitude"],
      userAway.from_longitude = fromCoord.value[0]["longitude"],
      userAway.from_country = fromCoord.value[0]["country"],
      userAway.to_name = toCoord.value[0]["name"],
      userAway.to_latitude = toCoord.value[0]["latitude"],
      userAway.to_longitude = toCoord.value[0]["longitude"],
      userAway.to_country = toCoord.value[0]["country"];
      userAway.user = user.id
    useApi(urlLists.value.postUrl, {
      method: "POST",
      body: { ...userAway, loading_date: formatDate(userAway.loading_date) },
    }).then(() => {
      getApplications();
      isOpen.value = false;
    });
  }
  
  function getApplications() {
    useApi(urlLists.value.getUrl)
      .then((res) => {
        if(user.role == 'USER'){
          application.value = res.results.map((item) => ({
          id: item.id,
          vehicle: item.vehicle_quantity,
          weight: item.weight,
          departure_date: item.loading_date,
          volume: item.volume,
          price: item.price,
          from_radius: item.from_radius,
          to_radius: item.to_radius,
          locations: [
            {
              id: item.id * 10 + 1, // location ID o'ylab berilmoqda
              direction: "from",
              name: item.from_name,
              latitude: item.from_latitude,
              longitude: item.from_longitude,
              country: {
                ...item.from_country,
              },
            },
            {
              id: item.id * 10 + 2, // location ID o'ylab berilmoqda
              direction: "to",
              name: item.to_name,
              latitude: item.to_latitude,
              longitude: item.to_longitude,
              country: {
                ...item.to_country,
              },
            },
          ],
        }));
        }else{
          application.value = res.results
        }
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
        console.error("Error fetching applications");
      })
      .finally(() => {
        loading.value = false;
      });
  }
  
  onMounted(() => {
    getDatas();
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
  