// Internationalization for warranty_bot

export type Language = 'uz' | 'ru' | 'en';

const translations = {
  uz: {
    // Common
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    retry: 'Qayta urinish',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    back: 'Orqaga',
    all: 'Barchasi',
    search: 'Qidirish',
    empty: 'Ma\'lumot topilmadi',
    
    // Auth
    welcome: 'Xush kelibsiz',
    pending_review: 'Arizangiz ko\'rib chiqilmoqda',
    pending_message: 'Tez orada javob beramiz',
    select_role: 'Rolingizni tanlang',
    seller: 'Sotuvchi',
    customer: 'Mijoz',
    technician: 'Texnik',
    register: 'Ro\'yxatdan o\'tish',
    company: 'Kompaniya',
    region: 'Viloyat',
    district: 'Tuman',
    
    // Navigation
    main: 'Asosiy',
    warranties: 'Kafolatlar',
    services: 'Xizmatlar',
    create: 'Yaratish',
    statistics: 'Statistika',
    profile: 'Profil',
    
    // Seller
    new_warranty: 'Yangi kafolat',
    all_warranties: 'Barcha kafolatlar',
    active_warranties: 'Faol kafolatlar',
    this_month: 'Bu oy',
    recent_warranties: 'So\'nggi kafolatlar',
    
    // Customer
    my_warranties: 'Kafolatlarim',
    technical_services: 'Texnik xizmatlar',
    need_help: 'Yordam kerakmi?',
    contact_support: 'Qo\'llab-quvvatlash bilan bog\'lanish',
    
    // Technician
    new_service: 'Yangi ariza',
    all_services: 'Barcha arizalar',
    pending: 'Kutilmoqda',
    in_progress: 'Jarayonda',
    completed: 'Bajarilgan',
    active_jobs: 'Faol arizalar',
    
    // Forms
    product_code: 'Mahsulot kodi',
    serial_number: 'Seriya raqami',
    customer_name: 'Mijoz ismi',
    customer_phone: 'Mijoz telefoni',
    warranty_period: 'Kafolat muddati',
    months: 'oy',
    problem: 'Muammo tavsifi',
    solution: 'Yechim',
    warranty_repair: 'Kafolatli ta\'mirlash',
    paid_repair: 'Pullik ta\'mirlash',
    repair_cost: 'Ta\'mirlash narxi',
    create_warranty: 'Kafolat yaratish',
    create_service: 'Ariza yaratish',
    
    // Status
    status_active: 'Faol',
    status_expired: 'Muddati tugagan',
    status_pending: 'Kutilmoqda',
    status_in_progress: 'Jarayonda',
    status_completed: 'Bajarilgan',
    
    // Errors
    product_not_found: 'Mahsulot topilmadi',
    warranty_not_found: 'Kafolat topilmadi',
    network_error: 'Tarmoq xatosi',
  },
  ru: {
    // Common
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    save: 'Сохранить',
    cancel: 'Отмена',
    back: 'Назад',
    all: 'Все',
    search: 'Поиск',
    empty: 'Данные не найдены',
    
    // Auth
    welcome: 'Добро пожаловать',
    pending_review: 'Ваша заявка на рассмотрении',
    pending_message: 'Мы скоро ответим',
    select_role: 'Выберите роль',
    seller: 'Продавец',
    customer: 'Клиент',
    technician: 'Техник',
    register: 'Регистрация',
    company: 'Компания',
    region: 'Регион',
    district: 'Район',
    
    // Navigation
    main: 'Главная',
    warranties: 'Гарантии',
    services: 'Услуги',
    create: 'Создать',
    statistics: 'Статистика',
    profile: 'Профиль',
    
    // Seller
    new_warranty: 'Новая гарантия',
    all_warranties: 'Все гарантии',
    active_warranties: 'Активных гарантий',
    this_month: 'В этом месяце',
    recent_warranties: 'Последние гарантии',
    
    // Customer
    my_warranties: 'Мои гарантии',
    technical_services: 'Тех. услуги',
    need_help: 'Нужна помощь?',
    contact_support: 'Связаться с поддержкой',
    
    // Technician
    new_service: 'Новая заявка',
    all_services: 'Все заявки',
    pending: 'Ожидают',
    in_progress: 'В работе',
    completed: 'Выполнено',
    active_jobs: 'Активные заявки',
    
    // Forms
    product_code: 'Код товара',
    serial_number: 'Серийный номер',
    customer_name: 'Имя клиента',
    customer_phone: 'Телефон клиента',
    warranty_period: 'Срок гарантии',
    months: 'мес',
    problem: 'Описание проблемы',
    solution: 'Решение',
    warranty_repair: 'Гарантийный ремонт',
    paid_repair: 'Платный ремонт',
    repair_cost: 'Стоимость ремонта',
    create_warranty: 'Создать гарантию',
    create_service: 'Создать заявку',
    
    // Status
    status_active: 'Активно',
    status_expired: 'Истекло',
    status_pending: 'Ожидание',
    status_in_progress: 'В работе',
    status_completed: 'Выполнено',
    
    // Errors
    product_not_found: 'Товар не найден',
    warranty_not_found: 'Гарантия не найдена',
    network_error: 'Ошибка сети',
  },
  en: {
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    all: 'All',
    search: 'Search',
    empty: 'No data found',
    
    // Auth
    welcome: 'Welcome',
    pending_review: 'Your request is under review',
    pending_message: 'We will respond soon',
    select_role: 'Select your role',
    seller: 'Seller',
    customer: 'Customer',
    technician: 'Technician',
    register: 'Register',
    company: 'Company',
    region: 'Region',
    district: 'District',
    
    // Navigation
    main: 'Main',
    warranties: 'Warranties',
    services: 'Services',
    create: 'Create',
    statistics: 'Statistics',
    profile: 'Profile',
    
    // Seller
    new_warranty: 'New warranty',
    all_warranties: 'All warranties',
    active_warranties: 'Active warranties',
    this_month: 'This month',
    recent_warranties: 'Recent warranties',
    
    // Customer
    my_warranties: 'My warranties',
    technical_services: 'Tech services',
    need_help: 'Need help?',
    contact_support: 'Contact support',
    
    // Technician
    new_service: 'New service',
    all_services: 'All services',
    pending: 'Pending',
    in_progress: 'In progress',
    completed: 'Completed',
    active_jobs: 'Active jobs',
    
    // Forms
    product_code: 'Product code',
    serial_number: 'Serial number',
    customer_name: 'Customer name',
    customer_phone: 'Customer phone',
    warranty_period: 'Warranty period',
    months: 'months',
    problem: 'Problem description',
    solution: 'Solution',
    warranty_repair: 'Warranty repair',
    paid_repair: 'Paid repair',
    repair_cost: 'Repair cost',
    create_warranty: 'Create warranty',
    create_service: 'Create service',
    
    // Status
    status_active: 'Active',
    status_expired: 'Expired',
    status_pending: 'Pending',
    status_in_progress: 'In progress',
    status_completed: 'Completed',
    
    // Errors
    product_not_found: 'Product not found',
    warranty_not_found: 'Warranty not found',
    network_error: 'Network error',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

export const detectLanguage = (): Language => {
  // Try Telegram language first
  const telegramLang = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (telegramLang) {
    if (telegramLang === 'uz') return 'uz';
    if (telegramLang === 'ru') return 'ru';
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'uz') return 'uz';
  if (browserLang === 'ru') return 'ru';
  
  return 'en';
};

export default translations;
