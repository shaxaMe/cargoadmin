<template>
    <div class="px-5 py-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 class="text-2xl font-semibold">Заказы</h2>
      </div>
  
      <!-- Таблица заказов для десктопа -->
      <div class="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mijoz</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yo'nalish</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holati</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Narxi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yaratilgan vaqti</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boshqarish</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap">#{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order?.owner?.full_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ setNamesFlags("from", order.locations)['name'] }}-{{ setNamesFlags("to", order.locations)['name'] }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ getStatusName(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap"  @click="isOpenOrder=true">{{ order.price }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.created_at }}</td>
              
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Карточки заказов для мобильных устройств -->
      <div class="space-y-4 md:hidden">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-white rounded-lg shadow p-4"
        >
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm text-gray-500">#{{ order.id }}</span>
            <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
              {{ order.status }}
            </span>
          </div>
          <div class="mb-2">
            <h3 class="font-medium">{{ order.client }}</h3>
            <p class="text-sm text-gray-500">{{ order.route }}</p>
          </div>
          <div class="text-right">
            <span class="font-medium">{{ order.amount }}</span>
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
    <Modal v-model="isOpenOrder" :max-width="'600px'">
      <div class="card flex justify-center">
        <Stepper v-model:value="activeStep" class="basis-[40rem]">
            <StepList>
                <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
                    <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
                        <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                            <span
                                :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                    { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                ]"
                            >
                                <i class="pi pi-user" />
                            </span>
                        </button>
                        <Divider />
                    </div>
                </Step>
                <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
                    <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
                        <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                            <span
                                :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                    { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                ]"
                            >
                                <i class="pi pi-star" />
                            </span>
                        </button>
                        <Divider />
                    </div>
                </Step>
                <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="3">
                    <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
                        <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                            <span
                                :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                    { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                ]"
                            >
                                <i class="pi pi-id-card" />
                            </span>
                        </button>
                    </div>
                </Step>
            </StepList>
        </Stepper>
    </div>
    </Modal>
    </div>
  </template>
  
  <script setup>

  import { useAuth } from '~/store/auth';  
  const {user} = useAuth();
  const selectedStatus = ref('all')
  const searchQuery = ref('')
  const loading = ref(true);
  const orders = ref([
    // {
    //   id: '1234',
    //   client: 'ТОО "Логистик Про"',
    //   route: 'Алматы - Астана',
    //   status: 'В пути',
    //   amount: '450,000'
    // },
    // {
    //   id: '1233',
    //   client: 'ИП Иванов',
    //   route: 'Шымкент - Караганда',
    //   status: 'Доставлен',
    //   amount: '280,000'
    // },
    // {
    //   id: '1232',
    //   client: 'АО "Транспорт KZ"',
    //   route: 'Актау - Атырау',
    //   status: 'Обработка',
    //   amount: '650,000'
    // },
    // {
    //   id: '1231',
    //   client: 'ТОО "Карго Плюс"',
    //   route: 'Павлодар - Костанай',
    //   status: 'Доставлен',
    //   amount: '320,000'
    // },
    // {
    //   id: '1230',
    //   client: 'ТОО "Экспресс Логистика"',
    //   route: 'Усть-Каменогорск - Семей',
    //   status: 'В пути',
    //   amount: '180,000'
    // }
  ]);
  const isOpenOrder = ref(false);
  const activeStep = ref(1);
  
  const filteredOrders = computed(() => {
    return orders.value
    // .filter(order => {
    //   const matchesStatus = selectedStatus.value === 'all' || order.status === selectedStatus.value
    //   const matchesSearch = order.client.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    //                        order.route.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    //                        order.id.includes(searchQuery.value)
    //   return matchesStatus && matchesSearch
    // })
  })
  
  const getStatusClass = (status) => {
    const classes = {
      'created': 'bg-slate-100 text-slate-800',
      'wait': 'bg-yellow-100 text-yellow-800',
      'accept': 'bg-yellow-100 text-yellow-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  function getStatusName(status){
       const statusName = {
        'created': 'Yaratildi',
        'wait': 'Kutilmoqda',
        'accept': 'Qabul qilingan'
       }
       return statusName[status] || 'Unknown'
  }
  function setNamesFlags(direction, item) {
  let cargo = null;
  if (item && item.length > 0) {
    cargo =
      loading.value == false
        ? item.find((loc) => loc.direction == direction)
        : "";
  }

  let obj = {
    name: cargo?.name,
    flag: cargo?.country?.flag,
  };

  return obj;
}
  onMounted(()=>{
    loading.value = true;
    useApi('/v1/order/list').then((res)=>{
      // orders.value = res.results;
      // if (user.role == "DRIVER") {
        orders.value = res.results.map((item) => {
        const locations = [
          {
            id: item.id * 10 + 1, // Unique ID creation
            direction: "from",
            name: item.cargo_application.from_name,
            latitude: item.cargo_application.from_latitude,
            longitude: item.cargo_application.from_longitude,
            radius: item.cargo_application.from_radius,
            country: item.cargo_application.from_country,
          },
          {
            id: item.id * 10 + 2, // Unique ID creation
            direction: "to",
            name: item.cargo_application.to_name,
            latitude: item.cargo_application.to_latitude,
            longitude: item.cargo_application.to_longitude,
            radius: item.cargo_application.to_radius,
            country: item.cargo_application.to_country,
          },
        ];
        return { ...item, locations };

      });
      loading.value = false;
    // } else {
    //   orders.value = res.results;
    //   loading.value = false;
    // }
    })
  })
  </script>
  