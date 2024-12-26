<template>
  <div class="flex h-full items-stretch">
    <!-- Левая панель со списком грузов -->
    <div class="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-4">Список грузов</h2>
        <!-- Список грузов -->
        <div class="space-y-3 overflow-x-auto">
          <div v-if="!loading && cargoList && cargoList.length > 0" v-for="cargo in cargoList" :key="cargo.id"
            @click="selectCargo(cargo)" :class="[
              'p-4 rounded-lg cursor-pointer transition-all duration-200',
              selectedCargo?.id === cargo.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200',
            ]" class="border">
            <!-- Краткая информация о грузе -->
            <div class="flex items-start justify-between">
              <div>
                <div class="font-medium text-gray-900">
                  {{ setNamesFlags("from", cargo.locations)["flag"] }}
                  {{ setNamesFlags("from", cargo.locations)["name"] }} →{{
                    setNamesFlags("to", cargo.locations)["flag"]
                  }}
                  {{ setNamesFlags("to", cargo.locations)["name"] }}
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ formatDate(cargo.departure_date) }}
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-sm text-gray-600">
                    {{ cargo.weight }}кг • {{ cargo.volume }}м³
                  </span>
                  <span class="px-2 py-1 text-xs rounded-full">
                    {{ cargo.status }}
                  </span>
                </div>
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ formatPrice(cargo.price) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Правая панель с детальной информацией -->
    <div class="flex-1 flex flex-col bg-gray-50">
      <div v-if="selectedCargo">
        <!-- Детальная информация о грузе -->
        <div class="px-6 py-3 bg-white border-b border-gray-200">
          <div class="grid grid-cols-3 gap-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Информация о грузе
              </h2>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm text-gray-500">Откуда</div>
                    <div class="font-medium">
                      {{
                        setNamesFlags("from", selectedCargo.locations)["flag"]
                      }}
                      {{
                        setNamesFlags("from", selectedCargo.locations)["name"]
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Куда</div>
                    <div class="font-medium">
                      {{ setNamesFlags("to", selectedCargo.locations)["flag"] }}
                      {{ setNamesFlags("to", selectedCargo.locations)["name"] }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm text-gray-500">Дата загрузки</div>
                    <div class="font-medium">
                      {{ formatDate(selectedCargo.departure_date) }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <div class="text-sm text-gray-500">Вес</div>
                    <div class="font-medium">{{ selectedCargo.weight }} кг</div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Объем</div>
                    <div class="font-medium">{{ selectedCargo.volume }} м³</div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Цена</div>
                    <div class="font-medium">
                      {{ formatPrice(selectedCargo.price) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                Контактная информация
              </h3>
              <div class="space-y-3">
                <div>
                  <div class="text-sm text-gray-500">Контактное лицо</div>
                  <div class="font-medium">
                    {{
                      user.role == "USER"
                        ? selectedCargo.main_driver["full_name"]
                        : selectedCargo.user.full_name
                    }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Телефон</div>
                  <div class="font-medium">
                    +{{
                      user.role == "USER"
                        ? selectedCargo.main_driver["phone"]
                        : selectedCargo.user.phone
                    }}
                  </div>
                </div>
                <div v-if="selectedCargo.notes">
                  <div class="text-sm text-gray-500">Примечания</div>
                  <div class="font-medium">{{ selectedCargo?.notes }}</div>
                </div>
              </div>

            </div>
            <div class="flex justify-end">
              <button @click="confirmCargo"
                class="px-6 py-2 bg-green-500 w-fit h-fit text-white rounded-lg hover:bg-green-600 transition-colors">
                Подтвердить
              </button>
            </div>
          </div>
        </div>

        <!-- Чат -->
        <div class="flex-1 p-6 bg-gray-50">
          <div class="bg-white rounded-lg shadow-sm p-4 h-full">
            <h3 class="text-lg font-semibold mb-4">Чат с владельцем груза</h3>
            <div class="space-y-4 h-full max-h-[60dvh] overflow-y-auto chatContainer my-2" v-if="!chatLoading">
              <div v-for="(message, index) in chatList" :key="index" :class="[
                'flex',
                message.isOwner ? 'justify-start' : 'justify-end',
              ]">
                <div :class="[
                  'max-w-[70%] rounded-lg p-3',
                  message.isOwner
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-blue-500 text-white',
                ]">
                  {{ message.text }}
                  <div :class="[
                    'text-xs mt-1',
                    message.isOwner ? 'text-gray-500' : 'text-blue-100',
                  ]">
                    {{ message.time }}
                  </div>
                </div>
              </div>
            </div>
            <div class="h-[50dvh] flex items-center justify-center" v-else>
              <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            </div>
            <!-- Ввод сообщения -->
            <div class="flex gap-2">
              <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Введите сообщение..."
                class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button @click="sendMessage"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Отправить
              </button>
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <!-- <div class="px-6 py-3 bg-white border-t border-gray-200">
          <div class="flex justify-end gap-4">
             <button @click="takeCargo"
                      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Забрать груз
              </button> 
            <button
              @click="confirmCargo"
              class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Подтвердить
            </button>
          </div>
        </div> -->
      </div>

      <!-- Заглушка при отсутствии выбранного груза -->
      <div v-else class="h-full flex items-center justify-center text-gray-500">
        <div class="text-center">
          <i class="fas fa-truck text-6xl mb-4"></i>
          <p>Выберите груз из списка слева</p>
        </div>
      </div>
    </div>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div v-if="loading"
      class="fixed w-screen h-screen top-0 left-0 backdrop-blur-sm bg-white/10 flex justify-center items-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" />
    </div>
  </div>
</template>

<script setup>
// import { formatDate, formatPrice, getStatusClass, getStatusName } from '../utils/formatters'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useAuth } from "~/store/auth";
import { useChatStore } from "~/store/chat";
import { Centrifuge } from "centrifuge";

// Состояние
const cargoList = ref([]);

const selectedCargo = ref(null);
const chatMessages = ref([]);
const newMessage = ref("");
const loading = ref(true);
const chatStore = useChatStore();
const { createChat } = chatStore;
const { centrafugoToken } = storeToRefs(chatStore);
const route = useRoute();
const confirm = useConfirm();
const toast = useToast();
const { user } = useAuth();
const chatLoading = ref(true);
let channelId = ref(null);
const centrifuge = ref(null);
const channel = ref(null);

const chatList = computed(() => {
  return chatMessages.value
})
// Загрузка данных
onMounted(async () => {
  // TODO: Загрузка списка грузов с сервера
  // cargoList.value = [
  //   {
  //     id: 1,
  //     fromLocation: 'Москва',
  //     toLocation: 'Санкт-Петербург',
  //     loadingDate: '2024-01-20',
  //     unloadingDate: '2024-01-21',
  //     weight: 1000,
  //     volume: 5,
  //     price: 50000,
  //     status: 'active',
  //     cargoType: 'general',
  //     contactPerson: 'Иван Иванов',
  //     contactPhone: '+7 (999) 123-45-67',
  //     notes: 'Хрупкий груз'
  //   },
  //   {
  //     id: 2,
  //     fromLocation: 'Екатеринбург',
  //     toLocation: 'Новосибирск',
  //     loadingDate: '2024-01-22',
  //     unloadingDate: '2024-01-24',
  //     weight: 2500,
  //     volume: 12,
  //     price: 85000,
  //     status: 'pending',
  //     cargoType: 'fragile',
  //     contactPerson: 'Петр Петров',
  //     contactPhone: '+7 (999) 234-56-78',
  //     notes: 'Требуется температурный режим'
  //   },
  //   {
  //     id: 3,
  //     fromLocation: 'Казань',
  //     toLocation: 'Самара',
  //     loadingDate: '2024-01-21',
  //     unloadingDate: '2024-01-22',
  //     weight: 800,
  //     volume: 3,
  //     price: 35000,
  //     status: 'active',
  //     cargoType: 'perishable',
  //     contactPerson: 'Анна Сидорова',
  //     contactPhone: '+7 (999) 345-67-89',
  //     notes: 'Срочная доставка'
  //   },
  //   {
  //     id: 4,
  //     fromLocation: 'Краснодар',
  //     toLocation: 'Ростов-на-Дону',
  //     loadingDate: '2024-01-23',
  //     unloadingDate: '2024-01-23',
  //     weight: 1500,
  //     volume: 8,
  //     price: 45000,
  //     status: 'pending',
  //     cargoType: 'dangerous',
  //     contactPerson: 'Михаил Козлов',
  //     contactPhone: '+7 (999) 456-78-90',
  //     notes: 'Опасный груз, требуются спец. разрешения'
  //   },
  //   {
  //     id: 5,
  //     fromLocation: 'Нижний Новгород',
  //     toLocation: 'Владимир',
  //     loadingDate: '2024-01-25',
  //     unloadingDate: '2024-01-25',
  //     weight: 600,
  //     volume: 2,
  //     price: 25000,
  //     status: 'active',
  //     cargoType: 'general',
  //     contactPerson: 'Елена Морозова',
  //     contactPhone: '+7 (999) 567-89-01',
  //     notes: ''
  //   }
  // ]
  getApplications();
  createChat()
  // Тестовые сообщения чата
});

// Методы

function getApplications() {
  let url =
    user.role == "DRIVER"
      ? "/v1/cargo/applications/driver/filter"
      : "/v1/driver/cargo-vehicle-applications/filter";
  loading.value = true;

  useApi(url, {
    params: route.query,
  }).then((res) => {
    if (user.role == "DRIVER") {
      cargoList.value = res.results.map((item) => {
        const locations = [
          {
            id: item.id * 10 + 1, // Unique ID creation
            direction: "from",
            name: item.from_name,
            latitude: item.from_latitude,
            longitude: item.from_longitude,
            radius: item.from_radius,
            country: item.from_country,
          },
          {
            id: item.id * 10 + 2, // Unique ID creation
            direction: "to",
            name: item.to_name,
            latitude: item.to_latitude,
            longitude: item.to_longitude,
            radius: item.to_radius,
            country: item.to_country,
          },
        ];
        return { ...item, locations };
      });
    } else {
      cargoList.value = res.results;
    }

    loading.value = false;
  });
}

const selectCargo = (cargo) => {
  selectedCargo.value = cargo;
  chatLoading.value = true;
  useApi(`/v1/chat/channel`, {
    method: "POST",
    body: {
      sender: user.id,
      receiver: user.role == 'DRIVER' ? cargo.user.id : cargo.main_driver.id,
      vehicle_application: user.role == 'DRIVER' ? route.query.vehicle_application_id : cargo.id,
      cargo_application: user.role == 'DRIVER' ? cargo.id : route.query.cargo_application_id
    },
  }).then((response) => {
    channelId.value = response.id;
    // SetChannel(response.id)
    SetChannelSelected(channelId.value);
    getMessage();
  });
};

function getMessage() {
  useApi(`/v1/chat/channel/messages?channel=${channelId.value}`).then((res) => {
    chatMessages.value = res.results.map((res) => {
      return { ...res, isOwner: res.created_by !== user.id };
    });
    chatLoading.value = false;
  });
}
const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  const chatContainer = document.querySelector(".chatContainer");

  // Wait for the DOM to fully render
  setTimeout(() => {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth", // Optional
    });
  }, 100); // Adjust delay if necessary

  useApi("/v1/chat/channel/message", {
    method: "POST",
    body: {
      channel: channelId.value,
      text: newMessage.value,
    },
  });
  newMessage.value = "";
};

async function SetChannelSelected(id) {
  try {
    // Ensure the Centrifugo instance exists


    // Unsubscribe from the previous channel if it exists
    if (channel.value) {
      channel.value.unsubscribe();
    }

    // Check if the subscription already exists
    let existingSubscription = centrifuge.value.getSubscription(id);

    if (existingSubscription) {
      console.log("Using existing subscription for channel:", id);
      channel.value = existingSubscription;
    } else {
      console.log("Creating a new subscription for channel:", id);
      channel.value = centrifuge.value.newSubscription(id);

      // Attach event listeners only once
      channel.value.on("publication", (ctx) => {
        console.log("New message received:", ctx.data);
      });
      channel.value.on("subscribing", () => {
        console.log("Subscribing to channel:", id);
      });
      channel.value.on("subscribed", (ctx) => {
        console.log("Subscribed successfully to channel:", id, ctx);
      });
      channel.value.on("unsubscribed", () => {
        console.log("Unsubscribed from channel:", id);
      });
    }

    // Subscribe to the channel
    await channel.value.subscribe();

    channel.value.on("publication", (ctx) => {
      // getMessage();
      chatMessages.value.push({
        text: ctx.data.text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwner: ctx.data.created_by != user.id,
      });
      console.log(ctx.data.created_by == user.id, user.id, ctx.data.created_by);
      const chatContainer = document.querySelector(".chatContainer");

      // Wait for the DOM to fully render
      setTimeout(() => {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth", // Optional
        });
      }, 100); // Adjust delay if necessary
    });

    // Ensure the Centrifugo connection is active
  } catch (error) {
    console.error("Error in SetChannelSelected:", error);
  }
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
const confirmCargo = () => {
  // TODO: Реализовать логику подтверждения
  confirm.require({
    message: "Siz rostan ham yukni qabul qilasizmi?",
    header: "tasdiqlash",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Yo'q",
      severity: "Ha",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: () => {
      let data = {
        vehicle_application: route.query.vehicle_application_id,
        cargo_application: selectedCargo.value.id,
        driver: null,
        owner: null,
        price: null,
        vehicle: null,
      };
      if (user.role == "DRIVER") {
        data.driver = user.id;
        data.owner = selectedCargo.value.user.id;
        data.price = selectedCargo.value.price;
        data.vehicle = route.query.vehicle_id;
      } else {
        data.driver = selectedCargo.value.main_driver.id;
        data.owner = user.id;
        data.price = selectedCargo.value.price;
        data.vehicle = selectedCargo.value.vehicle.id;
        data.vehicle_application = selectedCargo.value.id;
        data.cargo_application = route.query.cargo_application_id;
      }
      useApi(`/v1/order/create`, {
        method: "POST",
        body: data,
      }).then(() => {
        toast.add({
          severity: "success",
          summary: "Muvaffaqiyatli",
          detail: "Yuk qabul qilindi",
          life: 3000,
        });
      });
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    },
  });
};

async function Load() {
  if (centrafugoToken.value) {
    console.log('load')
    centrifuge.value = new Centrifuge(
      "wss://centrifugo.furago.uz/connection/websocket",
      {
        token: centrafugoToken.value, // Token for authentication
        resubscribe: true, // Automatically resubscribe on reconnect
      }
    );

    // Attach event handlers for Centrifuge connection
    centrifuge.value.on("connect", function (ctx) {
      console.log("Connected to Centrifugo:", ctx);
    });

    centrifuge.value.on("disconnect", function (ctx) {
      console.log("Disconnected from Centrifugo:", ctx);
    });

    centrifuge.value.connect();
  }
  // Establish connection
}

watch(
  () => centrafugoToken.value,
  (newVal) => {
    if (newVal) {
      Load();
    }
  }
);
</script>
