// Форматирование даты

export const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Форматирование цены
  export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EN', {
      // style: 'currency',
      // currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Получение класса для статуса
  export const getStatusClass = (status) => {
    const classes = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  // Получение названия статуса
  export const getStatusName = (status) => {
    const names = {
      active: 'Активный',
      pending: 'В ожидании',
      completed: 'Завершен',
      cancelled: 'Отменен'
    }
    return names[status] || 'Неизвестно'
  }
  
  // Форматирование типа груза
  export const getCargoTypeClass = (type) => {
    const classes = {
      general: 'bg-blue-100 text-blue-800',
      fragile: 'bg-red-100 text-red-800',
      perishable: 'bg-orange-100 text-orange-800',
      dangerous: 'bg-yellow-100 text-yellow-800'
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
  }
  
  export const userStatus = (userStatus) =>{
    let status = {
      active: 'Aktive',
      activeClass:'bg-green-50 text-green-400',
      inactiveClass:'bg-red-50 text-red-400',
      inactive: 'Aktiv emas',
      wait: "Kutilmoqda",
      waitClass: 'bg-yellow-50 font-semibold text-yellow-400',
      registered:"Ro'yxatdan o'tgan",
      registeredClass:'bg-yellow-50 text-yellow-400'
    }
    let obj = {
      status:status[userStatus],
      class:status[userStatus+'Class']
    }
    return obj || 'Aniqlanmagan'
  }
  export const userDocsStatus = (docStatus)=>{
    let status = {
      accept: 'Qabul qilingan',
      acceptClass:'bg-green-50 text-green-400',
      archivedClass:'bg-yellow-50 text-yellow-400',
      archived: 'Arxiv',
      wait: "Kutilmoqda",
      waitClass: 'bg-yellow-50 text-yellow-400',
      rejected:"Ro'yxatdan o'tgan",
      rejectedClass:'bg-red-50 text-red-400'
    }
    let obj = {
      status:status[docStatus],
      class:status[docStatus+'Class']
    }
    return obj || 'Aniqlanmagan'
  }
  // Получение названия типа груза
  export const vehicleStatus =(vehicleStatus)=>{
     let status = {
      accept: 'Qabul qilingan',
      acceptClass:'bg-green-50 text-green-400',
      archived: 'Arxiv',
      archivedClass:'bg-yellow-50 text-yellow-400',
      wait: "Kutilmoqda",
      waitClass: 'bg-yellow-50 text-yellow-400',
     }
     let obj = {
       status:status[vehicleStatus],
       class:status[vehicleStatus+'Class']
     }
     return obj || 'Aniqlanmagan'
  }
  export const getCargoTypeName = (type) => {
    const names = {
      general: 'Обычный',
      fragile: 'Хрупкий',
      perishable: 'Скоропортящийся',
      dangerous: 'Опасный'
    }
    return names[type] || 'Неизвестно'
  }
  