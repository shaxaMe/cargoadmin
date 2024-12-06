<template>
  <div class="flex h-screen py-3">
    <!-- Левая панель со списком грузов -->
    <div class="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
      <div class="px-4">
        <h2 class="text-lg font-semibold mb-4">Список грузов</h2>
        <!-- Список грузов -->
        <div class="space-y-3 max-h-[80dvh] overflow-x-auto">
          <div
            v-if="!loading && cargoList && cargoList.length > 0"
            v-for="cargo in cargoList"
            :key="cargo.id"
            @click="selectCargo(cargo)"
            :class="[
              'p-4 rounded-lg cursor-pointer transition-all duration-200',
              selectedCargo?.id === cargo.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200',
            ]"
            class="border"
          >
            <!-- Краткая информация о грузе -->
            <div class="flex items-start justify-start gap-4">
            <div class="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex justify-center items-center">
               <Icon v-if="!cargo.receiver.photo" name="material-symbols:account-circle-outline" size="20px" />
               <img :src="cargo.receiver.photo" alt="senderphoto" v-else>
            </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ cargo.receiver.full_name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Правая панель с детальной информацией -->
    <div class="flex-1 flex flex-col h-full bg-gray-50">
      <div v-if="selectedCargo" class="h-full">

        <!-- Чат -->
        <div class="flex-1 px-6 h-full overflow-y-auto bg-gray-50">
          <div class="bg-white rounded-lg shadow-sm p-4 h-full">
            <div class="w-full mb-2 flex justify-start items-center gap-4 border-b py-2">
              <div class="w-14 h-14 bg-gray-300 rounded-full overflow-hidden flex justify-center items-center">
               <Icon v-if="!selectedCargo.receiver.photo" name="material-symbols:account-circle-outline" size="30px" />
               <img :src="selectedCargo.receiver.photo" alt="senderphoto" v-else>
            </div>
            <div>
              <div class="font-medium text-gray-900">
                {{ selectedCargo.receiver.full_name }}
             </div>
            </div>
            </div>
            <div class="space-y-4 h-full max-h-[80dvh] overflow-y-auto chatContainer" v-if="!chatLoading">
              <div
                v-for="(message, index) in chatMessages"
                :key="index"
                :class="[
                  'flex',
                  message.isOwner ? 'justify-end' : 'justify-start',
                ]"
              >
                <div
                  :class="[
                    'max-w-[70%] rounded-lg p-3',
                    message.isOwner
                      ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900',
                  ]"
                >
                  {{ message.text }}
                  <div
                    :class="[
                      'text-xs mt-1',
                      message.isOwner ? 'text-blue-100':'text-gray-500',
                    ]"
                  >
                    {{ message.time }}
                  </div>
                </div>
              </div>
            </div>
            <div class="h-full flex items-center justify-center" v-else>
              <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
            </div>
            <!-- Ввод сообщения -->
            <div class="mt-4 flex gap-2">
              <input
                type="text"
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Введите сообщение..."
                class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                @click="sendMessage"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
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
  </div>
</template>

<script setup>
// import { formatDate, formatPrice, getStatusClass, getStatusName } from '../utils/formatters'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useAuth } from "~/store/auth";
import {useChatStore} from "~/store/chat";
import { Centrifuge } from 'centrifuge'

// Состояние
const cargoList = ref([]);
const selectedCargo = ref(null);
const chatMessages = ref([]);
const newMessage = ref("");
const loading = ref(true);
const chatStore = useChatStore();
const {SetChannel,chatClient} = chatStore;
const {centrafugoToken} = storeToRefs(chatStore);
const route = useRoute();
const confirm = useConfirm();
const chatLoading = ref(true);
const toast = useToast();
const { user } = useAuth();
let channelId = ref(null);
const centrifuge = ref(null);
const channel = ref(null);
// Загрузка данных
onMounted(async () => {
  getApplications();
  // Тестовые сообщения чата
  // chatMessages.value = [
  //   {
  //     text: "Здравствуйте! Груз еще доступен?",
  //     time: "10:30",
  //     isOwner: false,
  //   },
  //   {
  //     text: "Да, конечно! Когда сможете забрать?",
  //     time: "10:32",
  //     isOwner: true,
  //   },
  //   {
  //     text: "Смогу забрать завтра утром. Какие документы нужны?",
  //     time: "10:35",
  //     isOwner: false,
  //   },
  //   {
  //     text: "Нужен паспорт и доверенность от компании",
  //     time: "10:38",
  //     isOwner: true,
  //   },
  // ];
});

// Методы

function getApplications() {
  let url ='/v1/chat/channels';
  loading.value = true;
  useApi(url, {
    params: route.query,
  }).then((res) => {
    cargoList.value = res.results;
    loading.value = false;
  });
}

const selectCargo = (cargo) => {
  selectedCargo.value = cargo;
  chatLoading.value = true;
  useApi(`/v1/chat/channel/messages?channel=${cargo.id}`).then((res)=>{
    chatMessages.value = res.results.map(res=>{
      return {...res, isOwner: res.created_by === user.id }
    });
    chatLoading.value = false;
  })
};

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

  chatMessages.value.push({
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isOwner: false,
  });
  useApi('/v1/chat/channel/message',{
    method:"POST",
    body:{
    "channel":channelId.value,
    "text":newMessage.value
    }
  })
  newMessage.value = "";
};

async function SetChannelSelected(id) {
    // Unsubscribe from the previous channel if it exists
    console.log(centrifuge.value)
    if (channel.value) {
        channel.value.unsubscribe();
        console.log("Unsubscribed from previous channel");
    }

    // Create a new subscription for the selected channel
    channel.value = centrifuge.value.getSubscription(id);
    if(channel.value){
      channel.value.subscribe()
    }else{
      channel.value = centrifuge.value.newSubscription(id)
            channel.value.on('publication', function (ctx) {
               console.log("New message received:", ctx.data);
            })
            channel.value.on('subscribing', function (ctx) {
               console.log("Subscribing to channel:", id);
            })
            channel.value.subscribe()
    }
    // Event: Message publication
    channel.value.on("publication", function (ctx) {
        console.log("New message received:", ctx.data);
        // Uncomment to process messages
        // AllMessages.value.push(ctx.data);
        // SetMessageList(AllMessages.value);
    });

    // Event: Subscribing
    channel.value.on("subscribing", function (ctx) {
        console.log("Subscribing to channel:", id);
    });

    // Event: Subscribed successfully
    channel.value.on("subscribed", function (ctx) {
        console.log("Subscribed successfully to channel:", id, ctx);
    });

    // Event: Unsubscribed
    channel.value.on("unsubscribed", function (ctx) {
        console.log("Unsubscribed from channel:", id);
    });

    // Subscribe to the channel
    // try {
       // await channel.value.subscribe();
        // centrifuge.value.connect();
        console.log("Subscription process initiated for channel:", id);
    // } catch (error) {
    //     console.error("Error subscribing to channel:", id, error);
    // }
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
      if(user.role == "DRIVER"){
        data.driver = user.id;
        data.owner = selectedCargo.value.user.id;
        data.price = selectedCargo.value.price;
        data.vehicle = route.query.vehicle_id;
      }else{
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
  if(centrafugoToken.value){
    centrifuge.value = new Centrifuge("wss://centrifugo.furago.uz/connection/websocket", {
        token: centrafugoToken.value, // Token for authentication
        resubscribe: true,      // Automatically resubscribe on reconnect
    });

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


watch(()=>centrafugoToken.value,(newVal)=>{
  if(newVal){
    Load();
  }
})
</script>
