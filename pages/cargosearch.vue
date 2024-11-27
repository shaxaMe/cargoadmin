<template>
    <div class="h-full flex">
      <!-- Левая панель со списком грузов -->
      <div class="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-4">Список грузов</h2>
          <!-- Список грузов -->
          <div class="space-y-3">
            <div v-if="!loading && cargoList && cargoList.length>0" v-for="cargo in cargoList" 
                 :key="cargo.id" 
                 @click="selectCargo(cargo)"
                 :class="['p-4 rounded-lg cursor-pointer transition-all duration-200',
                         selectedCargo?.id === cargo.id 
                           ? 'bg-blue-50 border-blue-200' 
                           : 'bg-gray-50 hover:bg-gray-100 border-gray-200']"
                 class="border">
              <!-- Краткая информация о грузе -->
              <div class="flex items-start justify-between">
                <div>
                  <div class="font-medium text-gray-900">
                   {{ setNamesFlags('from',cargo.locations)['flag'] }} {{ setNamesFlags('from',cargo.locations)['name'] }} →{{ setNamesFlags('to',cargo.locations)['flag'] }} {{ setNamesFlags('to',cargo.locations)['name'] }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    {{ formatDate(cargo.departure_date) }}
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-sm text-gray-600">
                      {{ cargo.weight }}кг • {{ cargo.volume }}м³
                    </span>
                    <span class="px-2 py-1 text-xs rounded-full">
                      {{ cargo.status}}
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
      <div class="flex-1 flex flex-col h-full bg-gray-50">
        <template v-if="selectedCargo">
          <!-- Детальная информация о грузе -->
          <div class="p-6 bg-white border-b border-gray-200">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-4">
                  Информация о грузе
                </h2>
                <div class="space-y-3">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-sm text-gray-500">Откуда</div>
                      <div class="font-medium">{{ setNamesFlags('from',selectedCargo.locations)['flag'] }} {{ setNamesFlags('from',selectedCargo.locations)['name'] }} </div>
                    </div>
                    <div>
                      <div class="text-sm text-gray-500">Куда</div>
                      <div class="font-medium">{{ setNamesFlags('to',selectedCargo.locations)['flag'] }} {{ setNamesFlags('to',selectedCargo.locations)['name'] }}</div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-sm text-gray-500">Дата загрузки</div>
                      <div class="font-medium">{{ formatDate(selectedCargo.departure_date) }}</div>
                    </div>
                    <!-- <div>
                      <div class="text-sm text-gray-500">Дата выгрузки</div>
                      <div class="font-medium">{{ formatDate(selectedCargo.unloadingDate) }}</div>
                    </div> -->
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
                      <div class="font-medium">{{ formatPrice(selectedCargo.price) }}</div>
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
                    <div class="font-medium">{{ selectedCargo.main_driver['full_name'] }}</div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">Телефон</div>
                    <div class="font-medium">+{{ selectedCargo.main_driver['phone'] }}</div>
                  </div>
                  <div v-if="selectedCargo.notes">
                    <div class="text-sm text-gray-500">Примечания</div>
                    <div class="font-medium">{{ selectedCargo.notes }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Чат -->
          <div class="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div class="bg-white rounded-lg shadow-sm p-4 h-full">
              <h3 class="text-lg font-semibold mb-4">Чат с владельцем груза</h3>
              <div class="space-y-4 h-[calc(100%-8rem)] overflow-y-auto">
                <div v-for="(message, index) in chatMessages" 
                     :key="index"
                     :class="['flex', message.isOwner ? 'justify-start' : 'justify-end']">
                  <div :class="['max-w-[70%] rounded-lg p-3',
                              message.isOwner 
                                ? 'bg-gray-100 text-gray-900' 
                                : 'bg-blue-500 text-white']">
                    {{ message.text }}
                    <div :class="['text-xs mt-1',
                                message.isOwner ? 'text-gray-500' : 'text-blue-100']">
                      {{ message.time }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- Ввод сообщения -->
              <div class="mt-4 flex gap-2">
                <input type="text" 
                       v-model="newMessage"
                       @keyup.enter="sendMessage"
                       placeholder="Введите сообщение..."
                       class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button @click="sendMessage"
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Отправить
                </button>
              </div>
            </div>
          </div>
  
          <!-- Кнопки действий -->
          <div class="p-6 bg-white border-t border-gray-200">
            <div class="flex justify-end gap-4">
              <button @click="takeCargo"
                      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Забрать груз
              </button>
              <button @click="confirmCargo"
                      class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Подтвердить
              </button>
            </div>
          </div>
        </template>
  
        <!-- Заглушка при отсутствии выбранного груза -->
        <div v-else class="h-full flex items-center justify-center text-gray-500">
          <div class="text-center">
            <i class="fas fa-truck text-6xl mb-4"></i>
            <p>Выберите груз из списка слева</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
 // import { formatDate, formatPrice, getStatusClass, getStatusName } from '../utils/formatters'
  
  // Состояние
  const cargoList = ref([])
  const selectedCargo = ref(null)
  const chatMessages = ref([])
  const newMessage = ref('');
  const loading = ref(true);
  const route = useRoute();
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
    loading.value = true;
    useApi('/v1/driver/vehicle-applications/filter',{
        params:route.query
    }).then((res)=>{
        cargoList.value = res.results;
        loading.value = false;
    })
    // Тестовые сообщения чата
    chatMessages.value = [
      {
        text: 'Здравствуйте! Груз еще доступен?',
        time: '10:30',
        isOwner: false
      },
      {
        text: 'Да, конечно! Когда сможете забрать?',
        time: '10:32',
        isOwner: true
      },
      {
        text: 'Смогу забрать завтра утром. Какие документы нужны?',
        time: '10:35',
        isOwner: false
      },
      {
        text: 'Нужен паспорт и доверенность от компании',
        time: '10:38',
        isOwner: true
      }
    ]
    console.log(route.query)
  })
  
  // Методы
  const selectCargo = (cargo) => {
    selectedCargo.value = cargo
  }
  
  const sendMessage = () => {
    if (!newMessage.value.trim()) return
  
    chatMessages.value.push({
      text: newMessage.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwner: false
    })
  
    newMessage.value = ''
  }
  
  const takeCargo = () => {
    // TODO: Реализовать логику забора груза
    console.log('Забрать груз:', selectedCargo.value.id)
  }
  function setNamesFlags(direction,item){
    console.log(item[0])
    let cargo = null;
    if(item && item.length > 0){
      cargo =loading.value == false?item.find(loc=>loc.direction == direction):''
    }
    
    let obj = {
        name:cargo?.name,
        flag:cargo?.country?.flag
    }

    return obj;
  }
  const confirmCargo = () => {
    // TODO: Реализовать логику подтверждения
    console.log('Подтвердить груз:', selectedCargo.value.id)
  }
  </script>
  