// Fallback/test data used when backend API is unreachable

import type {
  User, Warranty, Service, Product,
  SellerStats, CustomerStats, TechnicianStats,
  Region, District, AuthResponse,
} from './api/types';

export const fallbackUser: User = {
  id: 1,
  telegram_id: '123456789',
  phone: '+998 94 643-76-76',
  first_name: 'Test',
  last_name: 'User',
  role: 'seller',
  company: 'Test Store',
  region_id: 1,
  district_id: 1,
  status: 'CREATED',
  created_at: '2024-01-01T00:00:00Z',
};

export const fallbackWarranties: Warranty[] = [
  {
    id: '1', product_id: '1', product_code: 'IP15PRO', product_name: 'iPhone 15 Pro',
    serial_number: 'DMPXK3JKXK', seller_id: '1', seller_name: 'Test User',
    customer_name: 'Алишер Каримов', customer_phone: '+998 90 123-45-67',
    warranty_period: 12, status: 'active',
    start_date: '2024-01-15', expiry_date: '2025-01-15',
    created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2', product_id: '2', product_code: 'SGS24', product_name: 'Samsung Galaxy S24',
    serial_number: 'RF8N30BXYZK', seller_id: '1', seller_name: 'Test User',
    customer_name: 'Дилноза Ахмедова', customer_phone: '+998 91 234-56-78',
    warranty_period: 24, status: 'active',
    start_date: '2024-02-20', expiry_date: '2026-02-20',
    created_at: '2024-02-20T14:15:00Z', updated_at: '2024-02-20T14:15:00Z',
  },
  {
    id: '3', product_id: '3', product_code: 'MBA-M2', product_name: 'MacBook Air M2',
    serial_number: 'C02G8KZXQ6LY', seller_id: '1', seller_name: 'Test User',
    customer_name: 'Жавлон Рахимов', customer_phone: '+998 93 345-67-89',
    warranty_period: 12, status: 'expired',
    start_date: '2023-06-10', expiry_date: '2024-06-10',
    created_at: '2023-06-10T09:00:00Z', updated_at: '2023-06-10T09:00:00Z',
  },
  {
    id: '4', product_id: '4', product_code: 'AIRPODS2', product_name: 'AirPods Pro 2',
    serial_number: 'GQRXT4KFXK', seller_id: '1', seller_name: 'Test User',
    customer_name: 'Нигора Тошева', customer_phone: '+998 94 456-78-90',
    warranty_period: 12, status: 'active',
    start_date: '2024-03-01', expiry_date: '2025-03-01',
    created_at: '2024-03-01T11:45:00Z', updated_at: '2024-03-01T11:45:00Z',
  },
  {
    id: '5', product_id: '5', product_code: 'SONYXM5', product_name: 'Sony WH-1000XM5',
    serial_number: 'S01-1234567', seller_id: '1', seller_name: 'Test User',
    customer_name: 'Фаррух Назаров', customer_phone: '+998 95 567-89-01',
    warranty_period: 24, status: 'active',
    start_date: '2024-01-20', expiry_date: '2026-01-20',
    created_at: '2024-01-20T16:20:00Z', updated_at: '2024-01-20T16:20:00Z',
  },
];

export const fallbackServices: Service[] = [
  {
    id: '1', warranty_id: '1', product_code: 'IP15PRO', product_name: 'iPhone 15 Pro',
    serial_number: 'DMPXK3JKXK', technician_id: '1', technician_name: 'Санжар Усмонов',
    customer_name: 'Алишер Каримов', customer_phone: '+998 90 123-45-67',
    problem: 'Не работает Face ID после падения', solution: 'Замена модуля Face ID, калибровка',
    is_warranty: true, price: 0, status: 'completed', warranty_status: 'active',
    created_at: '2024-03-15T10:00:00Z', updated_at: '2024-03-15T14:30:00Z',
  },
  {
    id: '2', warranty_id: '2', product_code: 'SGS24', product_name: 'Samsung Galaxy S24',
    serial_number: 'RF8N30BXYZK', technician_id: '1', technician_name: 'Санжар Усмонов',
    customer_name: 'Дилноза Ахмедова', customer_phone: '+998 91 234-56-78',
    problem: 'Треснул экран', solution: '',
    is_warranty: false, price: 1500000, status: 'in_progress', warranty_status: 'active',
    created_at: '2024-03-20T09:00:00Z', updated_at: '2024-03-20T09:00:00Z',
  },
  {
    id: '3', warranty_id: '4', product_code: 'AIRPODS2', product_name: 'AirPods Pro 2',
    serial_number: 'GQRXT4KFXK', technician_id: '1', technician_name: 'Санжар Усмонов',
    customer_name: 'Нигора Тошева', customer_phone: '+998 94 456-78-90',
    problem: 'Левый наушник не заряжается', solution: '',
    is_warranty: true, price: 0, status: 'pending', warranty_status: 'active',
    created_at: '2024-03-22T11:00:00Z', updated_at: '2024-03-22T11:00:00Z',
  },
  {
    id: '4', warranty_id: '3', product_code: 'MBA-M2', product_name: 'MacBook Air M2',
    serial_number: 'C02G8KZXQ6LY', technician_id: '1', technician_name: 'Санжар Усмонов',
    customer_name: 'Жавлон Рахимов', customer_phone: '+998 93 345-67-89',
    problem: 'Залитие клавиатуры', solution: 'Замена топкейса с клавиатурой',
    is_warranty: false, price: 3500000, status: 'completed', warranty_status: 'expired',
    created_at: '2024-03-10T15:00:00Z', updated_at: '2024-03-12T18:00:00Z',
  },
];

export const fallbackProducts: Record<string, Product> = {
  'IP15PRO': { id: '1', code: 'IP15PRO', name: 'iPhone 15 Pro', category: 'Смартфон', warranty_months: 12 },
  'IP15PM': { id: '2', code: 'IP15PM', name: 'iPhone 15 Pro Max', category: 'Смартфон', warranty_months: 12 },
  'SGS24U': { id: '3', code: 'SGS24U', name: 'Samsung Galaxy S24 Ultra', category: 'Смартфон', warranty_months: 12 },
  'SGS24': { id: '4', code: 'SGS24', name: 'Samsung Galaxy S24', category: 'Смартфон', warranty_months: 12 },
  'MBA-M2': { id: '5', code: 'MBA-M2', name: 'MacBook Air M2', category: 'Ноутбук', warranty_months: 12 },
  'MBP-M3': { id: '6', code: 'MBP-M3', name: 'MacBook Pro M3', category: 'Ноутбук', warranty_months: 12 },
  'AIRPODS2': { id: '7', code: 'AIRPODS2', name: 'AirPods Pro 2', category: 'Наушники', warranty_months: 12 },
  'SONYXM5': { id: '8', code: 'SONYXM5', name: 'Sony WH-1000XM5', category: 'Наушники', warranty_months: 24 },
  'IPADPRO': { id: '9', code: 'IPADPRO', name: 'iPad Pro 12.9"', category: 'Планшет', warranty_months: 12 },
};

export const fallbackSellerStats: SellerStats = {
  total_warranties: 5, active_warranties: 4, expired_warranties: 1,
  this_month: 2, this_week: 1,
  by_status: { active: 4, expired: 1, pending: 0 },
  monthly_trend: [
    { month: '2024-03', count: 2 }, { month: '2024-02', count: 1 },
    { month: '2024-01', count: 2 },
  ],
};

export const fallbackCustomerStats: CustomerStats = {
  total_warranties: 3, active_warranties: 2, expired_warranties: 1,
  total_services: 2, warranty_services: 1, paid_services: 1,
};

export const fallbackTechnicianStats: TechnicianStats = {
  total_services: 4, pending_services: 1, in_progress_services: 1,
  completed_services: 2, warranty_repairs: 2, paid_repairs: 2,
  total_earnings: 5000000, this_month_earnings: 1500000,
  monthly_trend: [
    { month: '2024-03', count: 3, earnings: 1500000 },
    { month: '2024-02', count: 1, earnings: 3500000 },
  ],
};

export const fallbackRegions: Region[] = [
  { id: '1', name: 'Toshkent', name_uz: 'Toshkent', name_ru: 'Ташкент', name_en: 'Tashkent' },
  { id: '2', name: 'Samarqand', name_uz: 'Samarqand', name_ru: 'Самарканд', name_en: 'Samarkand' },
  { id: '3', name: 'Buxoro', name_uz: 'Buxoro', name_ru: 'Бухара', name_en: 'Bukhara' },
];

export const fallbackDistricts: Record<string, District[]> = {
  '1': [
    { id: '1', region_id: '1', name: 'Yunusobod', name_uz: 'Yunusobod', name_ru: 'Юнусабад', name_en: 'Yunusabad' },
    { id: '2', region_id: '1', name: 'Chilonzor', name_uz: 'Chilonzor', name_ru: 'Чиланзар', name_en: 'Chilanzar' },
  ],
  '2': [
    { id: '3', region_id: '2', name: 'Markaz', name_uz: 'Markaz', name_ru: 'Центр', name_en: 'Center' },
  ],
  '3': [
    { id: '4', region_id: '3', name: 'Markaz', name_uz: 'Markaz', name_ru: 'Центр', name_en: 'Center' },
  ],
};
