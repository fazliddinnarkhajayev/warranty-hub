// Mock data for development

export interface Warranty {
  id: string;
  product_name: string;
  serial_number: string;
  customer_phone: string;
  customer_name: string;
  seller_id: string;
  seller_name: string;
  warranty_period: number; // months
  purchase_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'pending';
  created_at: string;
}

export interface ServiceLog {
  id: string;
  warranty_id: string;
  product_name: string;
  customer_phone: string;
  customer_name: string;
  technician_id: string;
  technician_name: string;
  problem: string;
  solution: string;
  is_warranty: boolean;
  price: number;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  completed_at?: string;
}

export interface User {
  id: string;
  telegram_id: number;
  name: string;
  phone: string;
  role: 'seller' | 'customer' | 'technician';
  created_at: string;
}

// Mock warranties
export const mockWarranties: Warranty[] = [
  {
    id: '1',
    product_name: 'iPhone 15 Pro',
    serial_number: 'DMPXK3JKXK',
    customer_phone: '+7 999 123-45-67',
    customer_name: 'Александр Петров',
    seller_id: 'seller1',
    seller_name: 'Иван Продавцов',
    warranty_period: 12,
    purchase_date: '2024-01-15',
    expiry_date: '2025-01-15',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    product_name: 'Samsung Galaxy S24',
    serial_number: 'RF8N30BXYZK',
    customer_phone: '+7 999 234-56-78',
    customer_name: 'Мария Иванова',
    seller_id: 'seller1',
    seller_name: 'Иван Продавцов',
    warranty_period: 24,
    purchase_date: '2024-02-20',
    expiry_date: '2026-02-20',
    status: 'active',
    created_at: '2024-02-20T14:15:00Z',
  },
  {
    id: '3',
    product_name: 'MacBook Air M2',
    serial_number: 'C02G8KZXQ6LY',
    customer_phone: '+7 999 345-67-89',
    customer_name: 'Дмитрий Сидоров',
    seller_id: 'seller1',
    seller_name: 'Иван Продавцов',
    warranty_period: 12,
    purchase_date: '2023-06-10',
    expiry_date: '2024-06-10',
    status: 'expired',
    created_at: '2023-06-10T09:00:00Z',
  },
  {
    id: '4',
    product_name: 'AirPods Pro 2',
    serial_number: 'GQRXT4KFXK',
    customer_phone: '+7 999 456-78-90',
    customer_name: 'Елена Козлова',
    seller_id: 'seller1',
    seller_name: 'Иван Продавцов',
    warranty_period: 12,
    purchase_date: '2024-03-01',
    expiry_date: '2025-03-01',
    status: 'active',
    created_at: '2024-03-01T11:45:00Z',
  },
  {
    id: '5',
    product_name: 'Sony WH-1000XM5',
    serial_number: 'S01-1234567',
    customer_phone: '+7 999 567-89-01',
    customer_name: 'Андрей Николаев',
    seller_id: 'seller1',
    seller_name: 'Иван Продавцов',
    warranty_period: 24,
    purchase_date: '2024-01-20',
    expiry_date: '2026-01-20',
    status: 'active',
    created_at: '2024-01-20T16:20:00Z',
  },
];

// Mock service logs
export const mockServiceLogs: ServiceLog[] = [
  {
    id: '1',
    warranty_id: '1',
    product_name: 'iPhone 15 Pro',
    customer_phone: '+7 999 123-45-67',
    customer_name: 'Александр Петров',
    technician_id: 'tech1',
    technician_name: 'Сергей Мастеров',
    problem: 'Не работает Face ID после падения',
    solution: 'Замена модуля Face ID, калибровка',
    is_warranty: true,
    price: 0,
    status: 'completed',
    created_at: '2024-03-15T10:00:00Z',
    completed_at: '2024-03-15T14:30:00Z',
  },
  {
    id: '2',
    warranty_id: '2',
    product_name: 'Samsung Galaxy S24',
    customer_phone: '+7 999 234-56-78',
    customer_name: 'Мария Иванова',
    technician_id: 'tech1',
    technician_name: 'Сергей Мастеров',
    problem: 'Треснул экран',
    solution: '',
    is_warranty: false,
    price: 15000,
    status: 'in_progress',
    created_at: '2024-03-20T09:00:00Z',
  },
  {
    id: '3',
    warranty_id: '4',
    product_name: 'AirPods Pro 2',
    customer_phone: '+7 999 456-78-90',
    customer_name: 'Елена Козлова',
    technician_id: 'tech1',
    technician_name: 'Сергей Мастеров',
    problem: 'Левый наушник не заряжается',
    solution: '',
    is_warranty: true,
    price: 0,
    status: 'pending',
    created_at: '2024-03-22T11:00:00Z',
  },
  {
    id: '4',
    warranty_id: '3',
    product_name: 'MacBook Air M2',
    customer_phone: '+7 999 345-67-89',
    customer_name: 'Дмитрий Сидоров',
    technician_id: 'tech1',
    technician_name: 'Сергей Мастеров',
    problem: 'Залитие клавиатуры',
    solution: 'Замена топкейса с клавиатурой',
    is_warranty: false,
    price: 35000,
    status: 'completed',
    created_at: '2024-03-10T15:00:00Z',
    completed_at: '2024-03-12T18:00:00Z',
  },
];

// Stats helpers
export const getSellerStats = () => ({
  totalWarranties: mockWarranties.length,
  activeWarranties: mockWarranties.filter(w => w.status === 'active').length,
  expiredWarranties: mockWarranties.filter(w => w.status === 'expired').length,
  thisMonth: mockWarranties.filter(w => {
    const created = new Date(w.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length,
});

export const getTechnicianStats = () => ({
  totalJobs: mockServiceLogs.length,
  completedJobs: mockServiceLogs.filter(j => j.status === 'completed').length,
  pendingJobs: mockServiceLogs.filter(j => j.status === 'pending').length,
  inProgressJobs: mockServiceLogs.filter(j => j.status === 'in_progress').length,
  warrantyJobs: mockServiceLogs.filter(j => j.is_warranty).length,
  totalEarnings: mockServiceLogs.filter(j => !j.is_warranty && j.status === 'completed').reduce((acc, j) => acc + j.price, 0),
});

export const getCustomerWarranties = (phone: string) => {
  return mockWarranties.filter(w => w.customer_phone === phone);
};

export const getCustomerServiceLogs = (phone: string) => {
  return mockServiceLogs.filter(s => s.customer_phone === phone);
};
