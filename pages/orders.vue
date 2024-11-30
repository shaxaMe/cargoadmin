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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Клиент</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Маршрут</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сумма</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap">#{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.client }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.route }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.amount }} ₸</td>
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
            <span class="font-medium">{{ order.amount }} ₸</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const selectedStatus = ref('all')
  const searchQuery = ref('')
  
  const orders = ref([
    {
      id: '1234',
      client: 'ТОО "Логистик Про"',
      route: 'Алматы - Астана',
      status: 'В пути',
      amount: '450,000'
    },
    {
      id: '1233',
      client: 'ИП Иванов',
      route: 'Шымкент - Караганда',
      status: 'Доставлен',
      amount: '280,000'
    },
    {
      id: '1232',
      client: 'АО "Транспорт KZ"',
      route: 'Актау - Атырау',
      status: 'Обработка',
      amount: '650,000'
    },
    {
      id: '1231',
      client: 'ТОО "Карго Плюс"',
      route: 'Павлодар - Костанай',
      status: 'Доставлен',
      amount: '320,000'
    },
    {
      id: '1230',
      client: 'ТОО "Экспресс Логистика"',
      route: 'Усть-Каменогорск - Семей',
      status: 'В пути',
      amount: '180,000'
    }
  ])
  
  const filteredOrders = computed(() => {
    return orders.value.filter(order => {
      const matchesStatus = selectedStatus.value === 'all' || order.status === selectedStatus.value
      const matchesSearch = order.client.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                           order.route.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                           order.id.includes(searchQuery.value)
      return matchesStatus && matchesSearch
    })
  })
  
  const getStatusClass = (status) => {
    const classes = {
      'В пути': 'bg-blue-100 text-blue-800',
      'Доставлен': 'bg-green-100 text-green-800',
      'Обработка': 'bg-yellow-100 text-yellow-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  </script>
  