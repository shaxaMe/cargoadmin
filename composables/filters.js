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
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
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
  
  // Получение названия типа груза
  export const getCargoTypeName = (type) => {
    const names = {
      general: 'Обычный',
      fragile: 'Хрупкий',
      perishable: 'Скоропортящийся',
      dangerous: 'Опасный'
    }
    return names[type] || 'Неизвестно'
  }
  